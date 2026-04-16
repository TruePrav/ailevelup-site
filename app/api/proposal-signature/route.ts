import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { waitUntil } from "@vercel/functions";
import { getProposal, saveProposal } from "@/lib/proposals";
import { logAudit } from "@/lib/audit";
import { renderProposalPdf } from "@/lib/pdf";

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function recordSignatureRow(opts: {
  name: string;
  email: string;
  signer: string;
  proposalSlug: string;
  date: string;
  signatureDataUrl: string;
}) {
  try {
    const sb = getServiceSupabase();
    const { error } = await sb.from("proposal_signatures").insert({
      name: opts.name,
      email: opts.email,
      signer: opts.signer,
      proposal_slug: opts.proposalSlug,
      date: opts.date,
      signature_base64: opts.signatureDataUrl,
      raw_data: {
        userAgent: null,
        submittedAt: new Date().toISOString(),
      },
    });
    if (error) {
      console.error("[proposal-signature] proposal_signatures insert failed:", error.message);
      return { ok: false, reason: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[proposal-signature] proposal_signatures insert exception:", err);
    return { ok: false, reason: String(err) };
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 60;
export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

async function renderSignedPdfOnce(proposalId: string): Promise<Buffer | null> {
  try {
    console.log("[proposal-signature] rendering PDF for", proposalId);
    const pdf = await renderProposalPdf(proposalId);
    console.log("[proposal-signature] PDF rendered", pdf.length, "bytes");
    return pdf;
  } catch (err) {
    console.error("[proposal-signature] PDF render failed:", err);
    return null;
  }
}

interface EmailSendOpts {
  proposalId: string;
  clientName: string;
  /** Friendly greeting name (from proposal.addressAs). Falls back to
   *  the first word of clientName when blank. */
  addressAs: string;
  signerEmail: string;
  pricingAmount: string;
  pricingCurrency: string;
  signature: string; // data URL
}

function greetingName(opts: { addressAs?: string; clientName?: string }): string {
  const candidate = (opts.addressAs ?? "").trim();
  if (candidate) return candidate;
  return (opts.clientName ?? "").trim().split(/\s+/)[0] ?? "";
}

function pdfAttachment(proposalId: string, pdf: Buffer | null) {
  if (!pdf) return null;
  return {
    filename: `${proposalId}-signed.pdf`,
    content: pdf.toString("base64"),
  };
}

function signaturePngAttachment(proposalId: string, signatureDataUrl: string) {
  if (!signatureDataUrl.startsWith("data:image")) return null;
  const base64 = signatureDataUrl.split(",")[1];
  if (!base64) return null;
  return { filename: `${proposalId}-signature.png`, content: base64 };
}

async function sendAdminNotification(opts: EmailSendOpts, pdf: Buffer | null) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from = process.env.NOTIFY_EMAIL_FROM ?? "Proposals <proposals@ailevelup.ca>";

  if (!apiKey || !to) {
    console.warn("[proposal-signature] admin email skipped — RESEND_API_KEY or NOTIFY_EMAIL_TO not set");
    return { sent: false, reason: "admin email env vars not set" };
  }

  try {
    const resend = new Resend(apiKey);
    const proposalUrl = `https://www.ailevelup.ca/proposals/${opts.proposalId}`;

    const attachments = [
      pdfAttachment(opts.proposalId, pdf),
      signaturePngAttachment(opts.proposalId, opts.signature),
    ].filter(Boolean) as { filename: string; content: string }[];

    const hasPdf = !!pdf;

    const result = await resend.emails.send({
      from,
      to,
      subject: `✅ Proposal signed by ${opts.clientName}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a; line-height: 1.5;">
          <h2 style="margin:0 0 8px">Proposal signed</h2>
          <p style="margin:0 0 16px;color:#475569">
            <strong>${opts.clientName}</strong> just accepted and signed their proposal.
          </p>
          <table style="border-collapse:collapse;margin:16px 0;font-size:14px">
            <tr><td style="padding:4px 12px 4px 0;color:#64748b">Client</td><td>${opts.clientName}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#64748b">Signer email</td><td>${opts.signerEmail}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#64748b">Amount</td><td>${opts.pricingAmount} ${opts.pricingCurrency}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#64748b">Proposal</td><td><a href="${proposalUrl}">${proposalUrl}</a></td></tr>
          </table>
          <p style="margin:16px 0 8px;color:#64748b;font-size:13px">
            ${hasPdf ? "Signed proposal attached as PDF" : "⚠️ PDF render failed — open the link above to view the signed proposal"}, signature attached as PNG.
          </p>
        </div>
      `,
      attachments,
    });

    if (result.error) {
      console.error("[proposal-signature] admin resend error:", result.error);
      return { sent: false, reason: String(result.error.message ?? result.error) };
    }
    console.log("[proposal-signature] admin email sent:", result.data?.id);
    return { sent: true };
  } catch (err) {
    console.error("[proposal-signature] admin email exception:", err);
    return { sent: false, reason: String(err) };
  }
}

async function sendClientConfirmation(opts: EmailSendOpts, pdf: Buffer | null) {
  const apiKey = process.env.RESEND_API_KEY;
  // Uses the same verified sender address so Resend's SPF/DKIM applies,
  // but brands the display name as AILevelUp (not "Proposals"). The admin
  // notification keeps its own display name via NOTIFY_EMAIL_FROM; we
  // intentionally do NOT inherit from that here — client-facing mail
  // should always show the company name.
  const from = process.env.CLIENT_EMAIL_FROM ?? "AILevelUp <proposals@ailevelup.ca>";
  const replyTo = process.env.CLIENT_EMAIL_REPLY_TO ?? "praveen@ailevelup.ca";

  if (!apiKey) {
    console.warn("[proposal-signature] client email skipped — RESEND_API_KEY not set");
    return { sent: false, reason: "RESEND_API_KEY not set" };
  }
  if (!opts.signerEmail) {
    console.warn("[proposal-signature] client email skipped — no signer email");
    return { sent: false, reason: "no signer email" };
  }

  try {
    const resend = new Resend(apiKey);
    const firstName = greetingName(opts);
    const attachments = [pdfAttachment(opts.proposalId, pdf)].filter(Boolean) as {
      filename: string;
      content: string;
    }[];
    const hasPdf = !!pdf;

    const result = await resend.emails.send({
      from,
      to: opts.signerEmail,
      replyTo,
      subject: `Your signed proposal with AILevelUp`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a; line-height: 1.6; max-width: 560px;">
          <h2 style="margin:0 0 12px;font-size:20px;color:#0f172a">Thank you${firstName ? `, ${firstName}` : ""}.</h2>
          <p style="margin:0 0 14px;color:#334155">
            We've received your signed proposal${hasPdf ? " and attached a copy for your records" : ""}.
            We'll be in touch within 24 hours to kick off the next steps.
          </p>
          ${hasPdf
            ? `<p style="margin:0 0 14px;color:#334155">
                 The full signed PDF is attached to this email.
               </p>`
            : `<p style="margin:0 0 14px;color:#b91c1c;font-size:13px">
                 Note: we couldn't generate your signed PDF this time — a copy is saved on our side and we'll send it over shortly.
               </p>`
          }
          <p style="margin:0 0 18px;color:#334155">
            If anything looks off, or you have questions, reach out to
            <a href="mailto:${replyTo}" style="color:#2563eb;text-decoration:none;">${replyTo}</a>.
          </p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0 18px" />
          <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6">
            This is an automated message from an unmonitored address (proposals@ailevelup.ca).
            <strong style="color:#64748b">Please do not reply directly.</strong>
            For any questions, email <a href="mailto:${replyTo}" style="color:#94a3b8;">${replyTo}</a>.
          </p>
          <p style="margin:10px 0 0;color:#94a3b8;font-size:12px;">
            AILevelUp · <a href="https://ailevelup.ca" style="color:#94a3b8;">ailevelup.ca</a>
          </p>
        </div>
      `,
      attachments,
    });

    if (result.error) {
      console.error("[proposal-signature] client resend error:", result.error);
      return { sent: false, reason: String(result.error.message ?? result.error) };
    }
    console.log("[proposal-signature] client email sent:", result.data?.id);
    return { sent: true };
  } catch (err) {
    console.error("[proposal-signature] client email exception:", err);
    return { sent: false, reason: String(err) };
  }
}

export async function POST(req: NextRequest) {
  const h = await headers();
  const ip = h.get("x-forwarded-for") ?? h.get("x-real-ip");

  try {
    const formData = await req.formData();
    const name = (formData.get("name") as string) || "";
    const email = (formData.get("email") as string) || "";
    const date = (formData.get("date") as string) || "";
    const proposalSlug = (formData.get("proposal_slug") as string) || "";
    const signature = (formData.get("signature") as string) || "";

    console.log("[proposal-signature] incoming", {
      slug: proposalSlug,
      email,
      hasSignature: !!signature,
      sigLength: signature.length,
    });

    if (!proposalSlug) {
      return NextResponse.json({ error: "proposal_slug required" }, { status: 400, headers: corsHeaders });
    }
    if (!signature || !signature.startsWith("data:image")) {
      return NextResponse.json({ error: "signature data URL required" }, { status: 400, headers: corsHeaders });
    }
    if (!email) {
      return NextResponse.json({ error: "email required" }, { status: 400, headers: corsHeaders });
    }

    // Load the proposal
    const proposal = await getProposal(proposalSlug);
    if (!proposal) {
      console.error("[proposal-signature] proposal not found:", proposalSlug);
      await logAudit({
        auth: { type: "none" },
        method: "POST",
        path: "/api/proposal-signature",
        status: 404,
        summary: `Sign attempt — proposal not found (${proposalSlug}) by ${email}`,
        ip,
      });
      return NextResponse.json({ error: "Proposal not found" }, { status: 404, headers: corsHeaders });
    }

    // Persist signature + mark signed
    proposal.signatureDataUrl = signature;
    proposal.signedByEmail = email;
    proposal.submittedAt = new Date().toISOString();
    proposal.status = "signed";

    try {
      await saveProposal(proposal);
      console.log("[proposal-signature] saved", proposalSlug);
    } catch (err) {
      console.error("[proposal-signature] saveProposal failed:", err);
      return NextResponse.json(
        { error: "Failed to save signature", details: String(err) },
        { status: 500, headers: corsHeaders }
      );
    }

    // Also record an audit row in proposal_signatures (uses service role, so
    // RLS policies don't block it). Failure here must NOT fail the sign flow.
    const sigRowResult = await recordSignatureRow({
      name: name || proposal.clientName || "",
      email,
      signer: name || proposal.clientName || "",
      proposalSlug,
      date,
      signatureDataUrl: signature,
    });
    if (!sigRowResult.ok) {
      console.warn("[proposal-signature] signature row not recorded:", sigRowResult.reason);
    }

    // At this point the signature is persisted — respond to the client
    // IMMEDIATELY so they see the success UI without waiting on puppeteer
    // or Resend. The PDF render + emails + audit log run in the background
    // via Vercel's waitUntil; the function stays alive until they finish
    // (or until maxDuration = 60s, whichever comes first).
    const emailOpts: EmailSendOpts = {
      proposalId: proposalSlug,
      clientName: name || proposal.clientName,
      addressAs: proposal.addressAs ?? "",
      signerEmail: email,
      pricingAmount: proposal.pricingAmount ?? "",
      pricingCurrency: proposal.pricingCurrency ?? "",
      signature,
    };

    waitUntil(
      (async () => {
        const t0 = Date.now();
        try {
          const pdf = await renderSignedPdfOnce(proposalSlug);
          const [adminResult, clientResult] = await Promise.all([
            sendAdminNotification(emailOpts, pdf),
            sendClientConfirmation(emailOpts, pdf),
          ]);
          await logAudit({
            auth: { type: "none" },
            method: "POST",
            path: "/api/proposal-signature",
            status: 200,
            summary:
              `${name || proposal.clientName} signed ${proposalSlug} (${email}) — ` +
              `admin email ${adminResult.sent ? "sent" : "skipped"}, ` +
              `client email ${clientResult.sent ? "sent" : "skipped"} ` +
              `(bg took ${Date.now() - t0}ms)`,
            ip,
          });
        } catch (err) {
          console.error("[proposal-signature] background work failed:", err);
          // Best-effort audit even on failure so we know the sign happened
          await logAudit({
            auth: { type: "none" },
            method: "POST",
            path: "/api/proposal-signature",
            status: 500,
            summary:
              `${name || proposal.clientName} signed ${proposalSlug} (${email}) — ` +
              `bg failed: ${String(err).slice(0, 200)}`,
            ip,
          }).catch(() => {});
        }
      })()
    );

    return NextResponse.json(
      {
        success: true,
        proposalId: proposalSlug,
        status: "signed",
        // Emails are now async — the client can't know their status yet
        emailsQueued: true,
        date,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[proposal-signature] FATAL:", error);
    return NextResponse.json(
      { error: "Failed to save", details: String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
