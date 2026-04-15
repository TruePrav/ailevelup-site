import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getPreparerSignature, setPreparerSignature } from "@/lib/settings";
import { requireSession, AuthError } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    await requireSession();
    const signature = await getPreparerSignature();
    return NextResponse.json({ signature });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[settings/signature] GET error:", err);
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
    const signature = typeof body.signature === "string" ? body.signature : null;
    if (signature && !signature.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "signature must be a data:image/* URL" },
        { status: 400 }
      );
    }

    // Soft size guard — a 600x140 canvas PNG data URL is usually 10-40KB.
    if (signature && signature.length > 500_000) {
      return NextResponse.json(
        { error: "Signature too large (>500KB). Try again." },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name : undefined;
    await setPreparerSignature(signature, name);

    const h = await headers();
    const ip = h.get("x-forwarded-for") ?? h.get("x-real-ip");
    await logAudit({
      auth,
      method: "POST",
      path: "/api/admin/settings/signature",
      status: 200,
      summary: signature ? "Updated preparer signature" : "Cleared preparer signature",
      ip,
    });

    return NextResponse.json({ message: "Saved" });
  } catch (err) {
    console.error("[settings/signature] POST error:", err);
    return NextResponse.json({ error: "Failed to save signature" }, { status: 500 });
  }
}
