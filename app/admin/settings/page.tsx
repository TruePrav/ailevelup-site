import Link from "next/link";
import { getPreparerSignature } from "@/lib/settings";
import SignatureClient from "./SignatureClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function SettingsPage() {
  const signature = await getPreparerSignature();

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex gap-4 text-sm mb-3" style={{ color: "var(--accent, #6366F1)" }}>
            <Link href="/admin/proposals">← Proposals</Link>
            <Link href="/admin/api-keys">API keys</Link>
            <Link href="/admin/audit">Audit log</Link>
          </div>
          <h1
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Settings
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Draw your signature once. It auto-injects into every proposal you create.
          </p>
        </div>

        <SignatureClient initialSignature={signature} />
      </div>
    </main>
  );
}
