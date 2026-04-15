import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { revokeApiKey } from "@/lib/apiKeys";
import { requireSession, AuthError } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  let auth;
  try {
    auth = await requireSession();
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  try {
    await revokeApiKey(id);

    const h = await headers();
    const ip = h.get("x-forwarded-for") ?? h.get("x-real-ip");
    await logAudit({
      auth,
      method: "DELETE",
      path: `/api/admin/api-keys/${id}`,
      status: 200,
      summary: `Revoked key ${id}`,
      ip,
    });

    return NextResponse.json({ message: "Revoked" });
  } catch (err) {
    console.error("[admin/api-keys] DELETE error:", err);
    return NextResponse.json({ error: "Failed to revoke key" }, { status: 500 });
  }
}
