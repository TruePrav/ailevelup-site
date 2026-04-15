import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createApiKey, listApiKeys } from "@/lib/apiKeys";
import { requireSession, AuthError } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    await requireSession();
    const keys = await listApiKeys();
    return NextResponse.json({ keys });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[admin/api-keys] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const scopes = Array.isArray(body.scopes) ? body.scopes : undefined;
    const createdBy = auth.type === "session" ? auth.email ?? auth.userId : null;
    const { raw, record } = await createApiKey(name, createdBy, scopes);

    const h = await headers();
    const ip = h.get("x-forwarded-for") ?? h.get("x-real-ip");
    await logAudit({
      auth,
      method: "POST",
      path: "/api/admin/api-keys",
      status: 201,
      summary: `Created key "${name}" (${record.key_prefix}…)`,
      ip,
    });

    return NextResponse.json({ rawKey: raw, record }, { status: 201 });
  } catch (err) {
    console.error("[admin/api-keys] POST error:", err);
    return NextResponse.json({ error: "Failed to create key" }, { status: 500 });
  }
}
