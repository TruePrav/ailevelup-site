import { notFound } from "next/navigation";
import Link from "next/link";
import { getProposal } from "@/lib/proposals";
import { getPreparerSignature } from "@/lib/settings";
import ProposalClient from "./ProposalClient";
import { isAdmin } from "@/lib/admin";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const proposal = await getProposal(id);
  if (!proposal) return { title: "Proposal Not Found" };
  return {
    title: `${proposal.pricingPhase ?? proposal.id} — ${proposal.clientName}`,
    description: `Proposal for ${proposal.clientName} · ${proposal.badge ?? ""}`,
  };
}

export default async function ProposalPage({ params }: Props) {
  const { id } = await params;
  const proposal = await getProposal(id);
  if (!proposal) notFound();

  const [admin, preparerSignature] = await Promise.all([
    isAdmin(),
    getPreparerSignature(),
  ]);

  return (
    <>
      <ProposalClient proposal={proposal} preparerSignature={preparerSignature} isAdmin={admin} />
      {admin && (
        <Link
          href={`/proposals/${id}/edit`}
          title="Edit proposal (admin)"
          style={{
            position: "fixed",
            bottom: 24,
            right: 96,
            zIndex: 9999,
            background: "#0f172a",
            color: "white",
            borderRadius: "50%",
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(15,23,42,0.35)",
            textDecoration: "none",
          }}
        >
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </Link>
      )}
    </>
  );
}
