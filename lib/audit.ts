import { createClient } from "@supabase/supabase-js";
import { AuthContext } from "@/lib/auth";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface AuditEntry {
  id: string;
  key_id: string | null;
  key_name: string | null;
  actor: string | null;
  method: string;
  path: string;
  status: number;
  summary: string | null;
  ip: string | null;
  ts: string;
}

export async function logAudit({
  auth,
  method,
  path,
  status,
  summary,
  ip,
}: {
  auth: AuthContext;
  method: string;
  path: string;
  status: number;
  summary?: string;
  ip?: string | null;
}): Promise<void> {
  try {
    const row = {
      key_id: auth.type === "apikey" ? auth.keyId : null,
      key_name: auth.type === "apikey" ? auth.keyName : null,
      actor:
        auth.type === "session"
          ? auth.email ?? auth.userId
          : auth.type === "apikey"
          ? auth.keyName
          : null,
      method,
      path,
      status,
      summary: summary?.slice(0, 500) ?? null,
      ip: ip ?? null,
    };
    await getAdminSupabase().from("api_audit").insert(row);
  } catch (err) {
    console.error("[audit] failed:", err);
  }
}

export async function listAudit(limit = 100): Promise<AuditEntry[]> {
  const { data, error } = await getAdminSupabase()
    .from("api_audit")
    .select("*")
    .order("ts", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as AuditEntry[];
}
