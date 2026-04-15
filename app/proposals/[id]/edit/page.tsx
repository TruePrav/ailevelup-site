import { notFound } from "next/navigation";
import Link from "next/link";
import { getProposal } from "@/lib/proposals";
import ProposalForm from "@/components/ProposalForm";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditProposalPage({ params }: Props) {
  const { id } = await params;
  const proposal = await getProposal(id);
  if (!proposal) notFound();

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/admin/proposals"
            className="text-sm font-medium"
            style={{ color: "var(--accent, #6366F1)" }}
          >
            ← Back to dashboard
          </Link>
          <h1
            className="text-4xl font-bold mt-3 mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Edit Proposal
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {proposal.clientName} &middot;{" "}
            <code
              style={{
                background: "var(--bg-surface)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              {proposal.id}
            </code>
          </p>
        </div>
        <ProposalForm mode="edit" initial={proposal} />
      </div>
    </main>
  );
}
