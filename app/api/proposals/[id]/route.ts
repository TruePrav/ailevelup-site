import { NextRequest, NextResponse } from "next/server";
import { getProposal, saveProposal } from "@/lib/proposals";
import { Proposal } from "@/types/proposal";
import { isAdmin } from "@/lib/admin";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const proposal = await getProposal(id);
  if (!proposal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(proposal);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getProposal(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: Partial<Proposal>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.id && body.id !== id) {
    return NextResponse.json({ error: "Body id does not match URL id" }, { status: 400 });
  }

  if (!body.clientName || !body.clientName.trim()) {
    return NextResponse.json({ error: "clientName is required" }, { status: 400 });
  }

  const updated: Proposal = {
    ...existing,
    ...body,
    id,
    createdAt: existing.createdAt,
  };

  await saveProposal(updated);
  return NextResponse.json({ id, message: "Proposal updated" });
}
