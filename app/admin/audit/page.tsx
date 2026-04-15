import Link from "next/link";
import { listAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function formatDate(s: string): string {
  return new Date(s).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function statusColor(status: number): string {
  if (status >= 500) return "#DC2626";
  if (status >= 400) return "#F59E0B";
  if (status >= 300) return "#6B7280";
  return "#10B981";
}

export default async function AuditPage() {
  const entries = await listAudit(200);

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex gap-4 text-sm mb-3" style={{ color: "var(--accent, #6366F1)" }}>
            <Link href="/admin/proposals">← Proposals</Link>
            <Link href="/admin/settings">Settings</Link>
            <Link href="/admin/api-keys">API keys</Link>
          </div>
          <h1
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Audit Log
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Last 200 API calls. Shows who did what, when, and the result.
          </p>
        </div>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "8px",
          }}
        >
          {entries.length === 0 ? (
            <p className="p-6 text-sm" style={{ color: "var(--text-muted)" }}>
              No audit entries yet.
            </p>
          ) : (
            <div className="flex flex-col">
              {entries.map((e) => (
                <div
                  key={e.id}
                  className="flex items-start gap-3 py-2 px-3 text-xs border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      color: "var(--text-muted)",
                      minWidth: 150,
                    }}
                  >
                    {formatDate(e.ts)}
                  </div>
                  <div
                    style={{
                      color: statusColor(e.status),
                      fontWeight: 700,
                      minWidth: 36,
                    }}
                  >
                    {e.status}
                  </div>
                  <div
                    style={{
                      color: "var(--text)",
                      fontWeight: 600,
                      minWidth: 54,
                    }}
                  >
                    {e.method}
                  </div>
                  <div
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      color: "var(--text)",
                      flex: 1,
                      minWidth: 0,
                      wordBreak: "break-all",
                    }}
                  >
                    {e.path}
                  </div>
                  <div style={{ color: "var(--text-muted)", minWidth: 140, textAlign: "right" }}>
                    {e.actor ?? "anonymous"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
