import { createClient } from "@supabase/supabase-js";

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

export interface AppSettings {
  preparer_signature_data_url: string | null;
  preparer_name: string | null;
  updated_at: string;
}

export async function getAppSettings(): Promise<AppSettings | null> {
  const { data, error } = await getAdminSupabase()
    .from("app_settings")
    .select("preparer_signature_data_url, preparer_name, updated_at")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    console.error("[settings] getAppSettings error:", error.message);
    return null;
  }
  return (data as AppSettings) ?? null;
}

export async function getPreparerSignature(): Promise<string | null> {
  const s = await getAppSettings();
  return s?.preparer_signature_data_url ?? null;
}

export async function setPreparerSignature(
  dataUrl: string | null,
  name?: string | null
): Promise<void> {
  const update: Record<string, unknown> = {
    preparer_signature_data_url: dataUrl,
    updated_at: new Date().toISOString(),
  };
  if (name !== undefined) update.preparer_name = name;

  const sb = getAdminSupabase();
  // Upsert the singleton row
  const { error } = await sb
    .from("app_settings")
    .upsert({ id: 1, ...update }, { onConflict: "id" });
  if (error) {
    console.error("[settings] setPreparerSignature error:", error.message);
    throw new Error(error.message);
  }
}
