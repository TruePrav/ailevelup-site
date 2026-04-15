"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiKeyRecord } from "@/lib/apiKeys";

const sectionStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "16px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  color: "#1a1a2e",
  fontSize: "14px",
  outline: "none",
};

const btnStyle: React.CSSProperties = {
  background: "var(--accent, #6366F1)",
  color: "white",
  fontSize: "13px",
  fontWeight: 700,
  padding: "10px 20px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
};

const revokeBtnStyle: React.CSSProperties = {
  background: "transparent",
  color: "#EF4444",
  fontSize: "12px",
  fontWeight: 700,
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid #FECACA",
  cursor: "pointer",
};

function formatDate(s: string | null): string {
  if (!s) return "—";
  return new Date(s).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ApiKeysClient({ initialKeys }: { initialKeys: ApiKeyRecord[] }) {
  const router = useRouter();
  const [keys] = useState(initialKeys);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create key");
      setNewKey(data.rawKey);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string, keyName: string) => {
    if (!confirm(`Revoke key "${keyName}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/api-keys/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(`Revoke failed: ${data.error || res.status}`);
    }
  };

  const handleCopy = async () => {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDone = () => {
    setNewKey(null);
    setCopied(false);
    router.refresh();
  };

  const active = keys.filter((k) => !k.revoked_at);
  const revoked = keys.filter((k) => k.revoked_at);

  return (
    <>
      {newKey && (
        <div
          style={{
            ...sectionStyle,
            background: "#FFFBEB",
            border: "2px solid #F59E0B",
          }}
        >
          <h2 className="text-lg font-bold mb-2" style={{ color: "#92400E" }}>
            New API Key — Copy Now
          </h2>
          <p className="text-sm mb-4" style={{ color: "#92400E" }}>
            This is the only time you&apos;ll see this key. Store it immediately in your
            agent&apos;s secret manager. If lost, revoke and create a new one.
          </p>
          <div
            style={{
              background: "#1a1a2e",
              color: "#a5f3fc",
              padding: "14px 16px",
              borderRadius: "10px",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "13px",
              wordBreak: "break-all",
              marginBottom: "12px",
            }}
          >
            {newKey}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={handleCopy} style={btnStyle}>
              {copied ? "Copied!" : "Copy key"}
            </button>
            <button
              type="button"
              onClick={handleDone}
              style={{ ...btnStyle, background: "transparent", color: "#92400E", border: "1px solid #F59E0B" }}
            >
              I&apos;ve saved it
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleCreate} style={sectionStyle}>
        <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text)" }}>
          Create new key
        </h2>
        <div className="flex gap-3">
          <input
            style={inputStyle}
            placeholder="e.g. production agent, staging, local dev"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={creating}
          />
          <button type="submit" disabled={creating} style={btnStyle}>
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
        {error && (
          <p className="text-sm mt-3" style={{ color: "#DC2626" }}>
            {error}
          </p>
        )}
      </form>

      <div style={sectionStyle}>
        <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text)" }}>
          Active keys ({active.length})
        </h2>
        {active.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No active keys.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {active.map((k) => (
              <div
                key={k.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm" style={{ color: "var(--text)" }}>
                    {k.name}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    <code>{k.key_prefix}…</code> · created {formatDate(k.created_at)} · last used{" "}
                    {formatDate(k.last_used_at)}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    scopes: {k.scopes.join(", ")}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRevoke(k.id, k.name)}
                  style={revokeBtnStyle}
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {revoked.length > 0 && (
        <div style={sectionStyle}>
          <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-muted)" }}>
            Revoked keys ({revoked.length})
          </h2>
          <div className="flex flex-col gap-2">
            {revoked.map((k) => (
              <div
                key={k.id}
                className="text-xs p-2 rounded"
                style={{ color: "var(--text-muted)", background: "var(--bg-surface)" }}
              >
                <strong>{k.name}</strong> · <code>{k.key_prefix}…</code> · revoked{" "}
                {formatDate(k.revoked_at)}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
