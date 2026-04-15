import { createClient } from "@supabase/supabase-js";
import { Proposal } from "@/types/proposal";

function getSupabase() {
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

export async function listProposals(): Promise<Proposal[]> {
  const { data, error } = await getSupabase()
    .from("proposal_docs")
    .select("data")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[proposal_docs] listProposals error:", error.message);
    return [];
  }

  return (data ?? []).map((r) => r.data as Proposal);
}

export async function getProposal(id: string): Promise<Proposal | null> {
  const { data, error } = await getSupabase()
    .from("proposal_docs")
    .select("data")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data.data as Proposal;
}

export async function saveProposal(proposal: Proposal): Promise<void> {
  const sb = getSupabase();
  const row = {
    id: proposal.id,
    data: proposal,
    updated_at: new Date().toISOString(),
  };

  // Try to update first
  const { data: updated, error: updateError } = await sb
    .from("proposal_docs")
    .update({ data: proposal, updated_at: row.updated_at })
    .eq("id", proposal.id)
    .select();

  if (updateError) {
    console.error("[proposal_docs] update error:", updateError.message);
    throw new Error(updateError.message);
  }

  if (updated && updated.length > 0) {
    console.log("[proposal_docs] updated rows:", updated.length);
    return;
  }

  // No row existed — insert a new one
  const { error: insertError } = await sb.from("proposal_docs").insert(row);
  if (insertError) {
    console.error("[proposal_docs] insert error:", insertError.message);
    throw new Error(insertError.message);
  }
  console.log("[proposal_docs] inserted new row");
}

export function generateProposalId(clientName: string): string {
  const slug = clientName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `${slug}-${timestamp}`;
}
