import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { verifyApiKey } from "@/lib/apiKeys";

export type AuthContext =
  | { type: "apikey"; keyId: string; keyName: string; scopes: string[] }
  | { type: "session"; userId: string; email: string | null }
  | { type: "none" };

export class AuthError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "AuthError";
  }
}

export async function getAuthContext(): Promise<AuthContext> {
  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");

  if (authHeader?.startsWith("Bearer ailu_")) {
    const token = authHeader.slice(7);
    const record = await verifyApiKey(token);
    if (record) {
      return {
        type: "apikey",
        keyId: record.id,
        keyName: record.name,
        scopes: record.scopes,
      };
    }
  }

  if (authHeader?.startsWith("Bearer eyJ")) {
    const token = authHeader.slice(7);
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user } } = await supabase.auth.getUser(token);
    if (user) {
      return { type: "session", userId: user.id, email: user.email ?? null };
    }
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    return { type: "session", userId: user.id, email: user.email ?? null };
  }

  return { type: "none" };
}

export async function requireAuth(requiredScope?: string): Promise<AuthContext> {
  const ctx = await getAuthContext();
  if (ctx.type === "none") {
    throw new AuthError("Unauthorized", 401);
  }
  if (
    ctx.type === "apikey" &&
    requiredScope &&
    !ctx.scopes.includes(requiredScope)
  ) {
    throw new AuthError(`Missing scope: ${requiredScope}`, 403);
  }
  return ctx;
}

export async function requireSession(): Promise<AuthContext> {
  const ctx = await getAuthContext();
  if (ctx.type !== "session") {
    throw new AuthError("Admin session required", 401);
  }
  return ctx;
}

export function getClientIp(): string | null {
  try {
    // This runs inside route handlers where headers() is available.
    // We read synchronously via a closure pattern elsewhere.
    return null;
  } catch {
    return null;
  }
}
