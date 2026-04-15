"use client";

import Link from "next/link";
import ProposalForm from "@/components/ProposalForm";

export default function NewProposalPage() {
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
            New Proposal
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Fill in the details below. Tabs switch between sections.
          </p>
        </div>
        <ProposalForm mode="create" />
      </div>
    </main>
  );
}
