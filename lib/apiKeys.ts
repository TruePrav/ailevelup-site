import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        fetch: (url, options = {}) =>
          fetch(url, { ...options, cache: "no-store" }),
      },
    }
  );
}

export function hashKey(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export function generateKey(): { raw: string; hash: string; prefix: string } {
  const random = crypto.randomBytes(32).toString("hex");
  const raw = `ailu_${random}`;
  const hash = hashKey(raw);
  const prefix = raw.slice(0, 13);
  return { raw, hash, prefix };
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  created_at: string;
  created_by: string | null;
  last_used_at: string | null;
  revoked_at: string | null;
}

export async function listApiKeys(): Promise<ApiKeyRecord[]> {
  const { data, error } = await getAdminSupabase()
    .from("api_keys")
    .select("id, name, key_prefix, scopes, created_at, created_by, last_used_at, revoked_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ApiKeyRecord[];
}

export async function createApiKey(
  name: string,
  createdBy: string | null,
  scopes?: string[]
): Promise<{ raw: string; record: ApiKeyRecord }> {
  const { raw, hash, prefix } = generateKey();
  const { data, error } = await getAdminSupabase()
    .from("api_keys")
    .insert({
      name,
      key_hash: hash,
      key_prefix: prefix,
      scopes: scopes ?? ["proposals:read", "proposals:write"],
      created_by: createdBy,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return { raw, record: data as ApiKeyRecord };
}

export async function revokeApiKey(id: string): Promise<void> {
  const { error } = await getAdminSupabase()
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function verifyApiKey(raw: string): Promise<ApiKeyRecord | null> {
  if (!raw.startsWith("ailu_")) return null;
  const hash = hashKey(raw);
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("api_keys")
    .select("id, name, key_prefix, scopes, created_at, created_by, last_used_at, revoked_at")
    .eq("key_hash", hash)
    .is("revoked_at", null)
    .maybeSingle();
  if (error || !data) return null;

  // Fire-and-forget last_used_at update — don't block the request
  void sb
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id)
    .then(() => undefined);

  return data as ApiKeyRecord;
}
