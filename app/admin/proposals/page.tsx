import Link from "next/link";
import { listProposals } from "@/lib/proposals";
import { Proposal } from "@/types/proposal";
import StatusSelect from "@/components/StatusSelect";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminProposalsPage() {
  const proposals: Proposal[] = await listProposals();

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex gap-4 text-sm mb-3" style={{ color: "var(--accent, #6366F1)" }}>
              <Link href="/admin/settings">Settings →</Link>
              <Link href="/admin/api-keys">API keys →</Link>
              <Link href="/admin/audit">Audit log →</Link>
            </div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              Proposals
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {proposals.length} total &middot; admin
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/proposals/new"
              className="px-6 py-3 rounded-xl text-sm font-bold"
              style={{ background: "var(--accent, #6366F1)", color: "white" }}
            >
              + New Proposal
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-3 rounded-xl text-sm font-bold"
                style={{ border: "1px solid var(--border)", color: "var(--text-muted)", background: "transparent", cursor: "pointer" }}
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {proposals.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              No proposals yet.
            </p>
            <Link
              href="/proposals/new"
              className="inline-block px-6 py-3 rounded-xl text-sm font-bold"
              style={{ background: "var(--accent, #6366F1)", color: "white" }}
            >
              Create your first proposal
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {proposals.map((p) => {
              return (
                <div
                  key={p.id}
                  className="rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h2
                        className="text-lg font-bold"
                        style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                      >
                        {p.clientName}
                      </h2>
                      <StatusSelect
                        proposalId={p.id}
                        initialStatus={(p.status ?? "draft") as "draft" | "sent" | "signed"}
                      />
                    </div>
                    <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                      {p.pricingPhase ?? p.badge ?? "Proposal"} &middot;{" "}
                      {p.pricingAmount ?? ""} {p.pricingCurrency ?? ""} &middot; {p.date}
                    </p>
                    <code className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {p.id}
                    </code>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/proposals/${p.id}`}
                      className="px-4 py-2 rounded-lg text-xs font-bold"
                      style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                    >
                      View
                    </Link>
                    <Link
                      href={`/proposals/${p.id}/edit`}
                      className="px-4 py-2 rounded-lg text-xs font-bold"
                      style={{ background: "var(--accent, #6366F1)", color: "white" }}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </main>
  );
}
