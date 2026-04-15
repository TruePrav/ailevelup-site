import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getProposal, saveProposal } from "@/lib/proposals";
import { Proposal } from "@/types/proposal";
import { requireAuth, AuthError } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface Ctx {
  params: Promise<{ id: string }>;
}

async function getIp() {
  const h = await headers();
  return h.get("x-forwarded-for") ?? h.get("x-real-ip");
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  let auth;
  try {
    auth = await requireAuth("proposals:read");
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  const proposal = await getProposal(id);
  if (!proposal) {
    await logAudit({
      auth,
      method: "GET",
      path: `/api/proposals/${id}`,
      status: 404,
      ip: await getIp(),
    });
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await logAudit({
    auth,
    method: "GET",
    path: `/api/proposals/${id}`,
    status: 200,
    ip: await getIp(),
  });
  return NextResponse.json(proposal);
}

async function handleUpdate(
  req: NextRequest,
  id: string,
  method: "PUT" | "PATCH",
) {
  let auth;
  try {
    auth = await requireAuth("proposals:write");
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

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

  if (
    method === "PUT" &&
    Object.keys(body).length > 1 &&
    (!body.clientName || !body.clientName.trim())
  ) {
    return NextResponse.json({ error: "clientName is required" }, { status: 400 });
  }

  const updated: Proposal = {
    ...existing,
    ...body,
    id,
    createdAt: existing.createdAt,
  };

  await saveProposal(updated);
  const verify = await getProposal(id);

  const changedKeys = Object.keys(body).filter((k) => k !== "id");
  await logAudit({
    auth,
    method,
    path: `/api/proposals/${id}`,
    status: 200,
    summary: `Updated ${changedKeys.length} field(s): ${changedKeys.join(", ")}`,
    ip: await getIp(),
  });

  return NextResponse.json({
    id,
    message: "Proposal updated",
    proposal: verify,
  });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  return handleUpdate(req, id, "PUT");
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  return handleUpdate(req, id, "PATCH");
}
