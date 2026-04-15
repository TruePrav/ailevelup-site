"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const colors = {
  draft:  { bg: "#F3F4F6", fg: "#6B7280" },
  sent:   { bg: "#DBEAFE", fg: "#1E40AF" },
  signed: { bg: "#D1FAE5", fg: "#065F46" },
};

export default function StatusSelect({
  proposalId,
  initialStatus,
}: {
  proposalId: string;
  initialStatus: "draft" | "sent" | "signed";
}) {
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const c = colors[status];

  const handleChange = async (next: "draft" | "sent" | "signed") => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const authHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        authHeaders["Authorization"] = `Bearer ${session.access_token}`;
      }
      await fetch(`/api/proposals/${proposalId}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ status: next }),
      });
      setStatus(next);
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value as typeof status)}
      style={{
        background: c.bg,
        color: c.fg,
        border: "none",
        borderRadius: "6px",
        padding: "3px 8px",
        fontSize: "11px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        cursor: saving ? "not-allowed" : "pointer",
        opacity: saving ? 0.6 : 1,
      }}
    >
      <option value="draft">Draft</option>
      <option value="sent">Sent</option>
      <option value="signed">Signed</option>
    </select>
  );
}
