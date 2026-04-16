"use client";

import { useState } from "react";

export default function ResetSignatureButton({ proposalId }: { proposalId: string }) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    const ok = confirm(
      `Reset signature for "${proposalId}"? This clears the signature on the proposal AND deletes the matching row in proposal_signatures. Admin testing only.`
    );
    if (!ok) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/reset-signature`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({} as { error?: string }));
      if (!res.ok) {
        alert(`Reset failed: ${data?.error ?? res.status}`);
        setBusy(false);
        return;
      }
      // Reload the list so the status badge flips back
      window.location.reload();
    } catch (err) {
      alert(`Reset error: ${String(err)}`);
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      title="Reset signature (admin testing)"
      className="px-4 py-2 rounded-lg text-xs font-bold"
      style={{
        border: "1px solid #ef4444",
        color: "#ef4444",
        background: "transparent",
        cursor: busy ? "not-allowed" : "pointer",
        opacity: busy ? 0.5 : 1,
      }}
    >
      {busy ? "..." : "Reset"}
    </button>
  );
}
