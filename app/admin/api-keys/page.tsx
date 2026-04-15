import Link from "next/link";
import { listApiKeys } from "@/lib/apiKeys";
import ApiKeysClient from "./ApiKeysClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ApiKeysPage() {
  const keys = await listApiKeys();

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex gap-4 text-sm mb-3" style={{ color: "var(--accent, #6366F1)" }}>
            <Link href="/admin/proposals">← Proposals</Link>
            <Link href="/admin/audit">Audit log →</Link>
          </div>
          <h1
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            API Keys
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Grant agents programmatic access to the proposals API. Keys are shown once —
            copy immediately and store in the agent&apos;s secret manager.
          </p>
        </div>
        <ApiKeysClient initialKeys={keys} />
      </div>
    </main>
  );
}
