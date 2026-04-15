import { NextRequest, NextResponse } from "next/server";
import { getProposal, saveProposal } from "@/lib/proposals";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { proposalId, signature } = body as { proposalId: string; signature: string };

    if (!proposalId || !signature) {
      return NextResponse.json({ error: "Missing proposalId or signature" }, { status: 400 });
    }

    const proposal = await getProposal(proposalId);
    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    proposal.signatureDataUrl = signature;
    proposal.submittedAt = new Date().toISOString();
    proposal.status = "signed";
    await saveProposal(proposal);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[proposals/sign] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
