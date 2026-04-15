import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Resend } from "resend";
import { getProposal, saveProposal } from "@/lib/proposals";
import { logAudit } from "@/lib/audit";
import { renderProposalPdf } from "@/lib/pdf";

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

async function sendSignedEmail(opts: {
  proposalId: string;
  clientName: string;
  signerEmail: string;
  pricingAmount: string;
  pricingCurrency: string;
  signature: string; // data URL
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from = process.env.NOTIFY_EMAIL_FROM ?? "Proposals <proposals@ailevelup.ca>";

  if (!apiKey || !to) {
    console.warn("[proposal-signature] email skipped — RESEND_API_KEY or NOTIFY_EMAIL_TO not set");
    return { sent: false, reason: "email env vars not set" };
  }

  try {
    const resend = new Resend(apiKey);
    const proposalUrl = `https://www.ailevelup.ca/proposals/${opts.proposalId}`;

    const attachments: { filename: string; content: string }[] = [];

    // Full signed proposal as PDF (best effort — if it fails, we still
    // send the email without it rather than losing the notification)
    try {
      console.log("[proposal-signature] rendering PDF for", opts.proposalId);
      const pdf = await renderProposalPdf(opts.proposalId);
      attachments.push({
        filename: `${opts.proposalId}-signed.pdf`,
        content: pdf.toString("base64"),
      });
      console.log("[proposal-signature] PDF rendered", pdf.length, "bytes");
    } catch (err) {
      console.error("[proposal-signature] PDF render failed:", err);
    }

    // Signature PNG as a separate attachment for quick reference
    if (opts.signature.startsWith("data:image")) {
      const base64 = opts.signature.split(",")[1];
      if (base64) {
        attachments.push({ filename: `${opts.proposalId}-signature.png`, content: base64 });
      }
    }

    const hasPdf = attachments.some((a) => a.filename.endsWith(".pdf"));

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
      console.error("[proposal-signature] resend error:", result.error);
      return { sent: false, reason: String(result.error.message ?? result.error) };
    }
    console.log("[proposal-signature] email sent:", result.data?.id);
    return { sent: true };
  } catch (err) {
    console.error("[proposal-signature] email exception:", err);
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

    // Send email notification (best effort, doesn't block success)
    const emailResult = await sendSignedEmail({
      proposalId: proposalSlug,
      clientName: name || proposal.clientName,
      signerEmail: email,
      pricingAmount: proposal.pricingAmount ?? "",
      pricingCurrency: proposal.pricingCurrency ?? "",
      signature,
    });

    // Audit
    await logAudit({
      auth: { type: "none" },
      method: "POST",
      path: "/api/proposal-signature",
      status: 200,
      summary: `${name || proposal.clientName} signed ${proposalSlug} (${email}) — email ${emailResult.sent ? "sent" : "skipped"}`,
      ip,
    });

    return NextResponse.json(
      {
        success: true,
        proposalId: proposalSlug,
        status: "signed",
        emailSent: emailResult.sent,
        emailReason: emailResult.sent ? undefined : emailResult.reason,
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
