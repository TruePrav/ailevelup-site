import { createClient } from "@supabase/supabase-js";
import { Proposal } from "@/types/proposal";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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
  const { error } = await getSupabase()
    .from("proposal_docs")
    .upsert(
      { id: proposal.id, data: proposal, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );

  if (error) {
    console.error("[proposal_docs] saveProposal error:", error.message);
    throw new Error(error.message);
  }
}

export function generateProposalId(clientName: string): string {
  const slug = clientName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `${slug}-${timestamp}`;
}
