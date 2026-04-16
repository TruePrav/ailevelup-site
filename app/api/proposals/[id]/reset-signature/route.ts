import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { getProposal, saveProposal } from "@/lib/proposals";
import { isAdmin } from "@/lib/admin";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const h = await headers();
  const ip = h.get("x-forwarded-for") ?? h.get("x-real-ip");

  // Admin gate — testing-only endpoint.
  const admin = await isAdmin();
  if (!admin) {
    await logAudit({
      auth: { type: "none" },
      method: "POST",
      path: `/api/proposals/${id}/reset-signature`,
      status: 403,
      summary: `Unauthorized reset attempt on ${id}`,
      ip,
    });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const proposal = await getProposal(id);
    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Clear signature fields on the proposal doc
    proposal.signatureDataUrl = undefined;
    proposal.signedByEmail = undefined;
    proposal.submittedAt = undefined;
    proposal.status = "sent";
    await saveProposal(proposal);

    // Delete matching rows from proposal_signatures (admin-gated test reset)
    const sb = getServiceSupabase();
    const { error: delError, count } = await sb
      .from("proposal_signatures")
      .delete({ count: "exact" })
      .eq("proposal_slug", id);

    if (delError) {
      console.warn("[reset-signature] proposal_signatures delete warning:", delError.message);
    }

    await logAudit({
      auth: { type: "none" },
      method: "POST",
      path: `/api/proposals/${id}/reset-signature`,
      status: 200,
      summary: `Reset signature for ${id} — removed ${count ?? 0} signature row(s)`,
      ip,
    });

    return NextResponse.json({
      ok: true,
      proposalId: id,
      removedSignatureRows: count ?? 0,
    });
  } catch (err) {
    console.error("[reset-signature] error:", err);
    return NextResponse.json(
      { error: "Failed to reset signature", details: String(err) },
      { status: 500 }
    );
  }
}
