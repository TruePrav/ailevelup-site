"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Proposal, Deliverable, TimelineEntry, TermItem, SetupFeeItem } from "@/types/proposal";
import { createClient } from "@/lib/supabase/client";

type Mode = "create" | "edit";

interface Props {
  initial?: Proposal;
  mode: Mode;
}

const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

function emptyProposal(): Proposal {
  return {
    id: "",
    badge: "Proposal",
    headline: "Proposal for",
    clientName: "",
    subtitle: "",
    preparedFor: "",
    date: today,
    preparedBy: "Praveen Mahtani | AILevelUp",
    validUntil: "",
    challenge: "",
    deliverables: [],
    scopeIncluded: [],
    scopeExcluded: [],
    timeline: [],
    timelineNote: "",
    pricingPhase: "Phase 1",
    pricingSubtitle: "",
    pricingAmount: "",
    pricingCurrency: "USD",
    pricingNote: "",
    pricingIncludes: [],
    paymentTerms: "50% to start, 50% on delivery",
    paymentMethods: "Wire transfer, Wise, or PayPal",
    whatWeNeed: [],
    clientProvides: [],
    terms: [],
    ctaSteps: [],
    status: "draft",
    createdAt: new Date().toISOString(),
  };
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  color: "#1a1a2e",
  fontSize: "14px",
  outline: "none",
  fontFamily: "var(--font-sans, system-ui, sans-serif)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#6b7280",
  marginBottom: "6px",
};

const sectionStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "16px",
  padding: "28px",
  marginBottom: "16px",
};

const addBtnStyle: React.CSSProperties = {
  background: "var(--accent-light, #EEF2FF)",
  color: "var(--accent, #6366F1)",
  fontSize: "11px",
  fontWeight: 700,
  padding: "8px 14px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const removeBtnStyle: React.CSSProperties = {
  background: "transparent",
  color: "#EF4444",
  fontSize: "11px",
  fontWeight: 700,
  padding: "4px 8px",
  borderRadius: "6px",
  border: "1px solid #FECACA",
  cursor: "pointer",
  flexShrink: 0,
};

// Defined outside ProposalForm so it has a stable reference and inputs don't lose focus on each keystroke
function StringArrayEditor({
  items,
  label,
  placeholder,
  onAdd,
  onChange,
  onRemove,
}: {
  items: string[];
  label: string;
  placeholder: string;
  onAdd: () => void;
  onChange: (i: number, value: string) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div style={sectionStyle}>
      <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
        {label}
      </h2>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            style={inputStyle}
            value={item}
            onChange={(e) => onChange(i, e.target.value)}
            placeholder={placeholder}
          />
          <button type="button" onClick={() => onRemove(i)} style={removeBtnStyle}>
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={onAdd} style={addBtnStyle}>
        + Add
      </button>
    </div>
  );
}

export default function ProposalForm({ initial, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Proposal>(initial ?? emptyProposal());
  const [tab, setTab] = useState<"meta" | "scope" | "timeline" | "pricing" | "action">("meta");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState("");

  const set = <K extends keyof Proposal>(key: K, value: Proposal[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const pushStr = (key: "scopeIncluded" | "scopeExcluded" | "pricingIncludes" | "whatWeNeed" | "clientProvides" | "ctaSteps") =>
    setForm((f) => ({ ...f, [key]: [...(f[key] ?? []), ""] }));
  const setStrAt = (key: "scopeIncluded" | "scopeExcluded" | "pricingIncludes" | "whatWeNeed" | "clientProvides" | "ctaSteps", i: number, value: string) =>
    setForm((f) => {
      const arr = [...(f[key] ?? [])];
      arr[i] = value;
      return { ...f, [key]: arr };
    });
  const removeStrAt = (key: "scopeIncluded" | "scopeExcluded" | "pricingIncludes" | "whatWeNeed" | "clientProvides" | "ctaSteps", i: number) =>
    setForm((f) => {
      const arr = [...(f[key] ?? [])];
      arr.splice(i, 1);
      return { ...f, [key]: arr };
    });

  const pushDeliverable = () =>
    setForm((f) => ({ ...f, deliverables: [...(f.deliverables ?? []), { deliverable: "", details: "" }] }));
  const setDeliverable = (i: number, field: keyof Deliverable, value: string) =>
    setForm((f) => {
      const arr = [...(f.deliverables ?? [])];
      arr[i] = { ...arr[i], [field]: value };
      return { ...f, deliverables: arr };
    });
  const removeDeliverable = (i: number) =>
    setForm((f) => {
      const arr = [...(f.deliverables ?? [])];
      arr.splice(i, 1);
      return { ...f, deliverables: arr };
    });

  const pushTimeline = () =>
    setForm((f) => ({ ...f, timeline: [...(f.timeline ?? []), { week: "", title: "", description: "" }] }));
  const setTimelineAt = (i: number, field: keyof TimelineEntry, value: string) =>
    setForm((f) => {
      const arr = [...(f.timeline ?? [])];
      arr[i] = { ...arr[i], [field]: value };
      return { ...f, timeline: arr };
    });
  const removeTimelineAt = (i: number) =>
    setForm((f) => {
      const arr = [...(f.timeline ?? [])];
      arr.splice(i, 1);
      return { ...f, timeline: arr };
    });

  const pushTerm = () =>
    setForm((f) => ({ ...f, terms: [...(f.terms ?? []), { label: "", value: "" }] }));
  const setTermAt = (i: number, field: keyof TermItem, value: string) =>
    setForm((f) => {
      const arr = [...(f.terms ?? [])];
      arr[i] = { ...arr[i], [field]: value };
      return { ...f, terms: arr };
    });
  const removeTermAt = (i: number) =>
    setForm((f) => {
      const arr = [...(f.terms ?? [])];
      arr.splice(i, 1);
      return { ...f, terms: arr };
    });

  const pushSetupFee = () =>
    setForm((f) => ({ ...f, setupFees: [...(f.setupFees ?? []), { item: "", amount: "" }] }));
  const setSetupFeeAt = (i: number, field: keyof SetupFeeItem, value: string) =>
    setForm((f) => {
      const arr = [...(f.setupFees ?? [])];
      arr[i] = { ...arr[i], [field]: value };
      return { ...f, setupFees: arr };
    });
  const removeSetupFeeAt = (i: number) =>
    setForm((f) => {
      const arr = [...(f.setupFees ?? [])];
      arr.splice(i, 1);
      return { ...f, setupFees: arr };
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.clientName.trim()) {
      setError("Client name is required.");
      return;
    }
    setSubmitting(true);
    try {
      const clean = {
        ...form,
        scopeIncluded: (form.scopeIncluded ?? []).filter((s) => s.trim()),
        scopeExcluded: (form.scopeExcluded ?? []).filter((s) => s.trim()),
        pricingIncludes: (form.pricingIncludes ?? []).filter((s) => s.trim()),
        whatWeNeed: (form.whatWeNeed ?? []).filter((s) => s.trim()),
        clientProvides: (form.clientProvides ?? []).filter((s) => s.trim()),
        ctaSteps: (form.ctaSteps ?? []).filter((s) => s.trim()),
        deliverables: (form.deliverables ?? []).filter((d) => d.deliverable.trim() || d.details.trim()),
        timeline: (form.timeline ?? []).filter((t) => t.week.trim() || t.title.trim() || t.description.trim()),
        terms: (form.terms ?? []).filter((t) => t.label.trim() || t.value.trim()),
      };

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const authHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        authHeaders["Authorization"] = `Bearer ${session.access_token}`;
      }

      const url = mode === "create" ? "/api/proposals" : `/api/proposals/${form.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(clean),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Save failed (${res.status})`);
      }
      const data = await res.json();
      const id = data.id ?? form.id;
      if (mode === "create") {
        setSavedId(id);
      } else {
        window.location.href = `/proposals/${id}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (savedId) {
    return (
      <div style={sectionStyle}>
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
            Proposal Created
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Live at /proposals/{savedId}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href={`/proposals/${savedId}`}
              className="px-6 py-3 rounded-xl text-sm font-bold"
              style={{ background: "var(--accent, #6366F1)", color: "white" }}
            >
              View Proposal
            </a>
            <a
              href={`/proposals/${savedId}/edit`}
              className="px-6 py-3 rounded-xl text-sm font-bold"
              style={{ border: "1.5px solid var(--accent, #6366F1)", color: "var(--accent, #6366F1)" }}
            >
              Edit
            </a>
            <a
              href="/admin/proposals"
              className="px-6 py-3 rounded-xl text-sm font-bold"
              style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  const tabs: Array<{ key: typeof tab; label: string }> = [
    { key: "meta", label: "Client & Meta" },
    { key: "scope", label: "Scope" },
    { key: "timeline", label: "Timeline" },
    { key: "pricing", label: "Pricing" },
    { key: "action", label: "Client Action" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-1 mb-6 p-1 rounded-xl flex-wrap" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className="flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all"
            style={{
              background: tab === t.key ? "var(--accent, #6366F1)" : "transparent",
              color: tab === t.key ? "#ffffff" : "var(--text-muted)",
              minWidth: "100px",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "meta" && (
        <div style={sectionStyle}>
          <h2 className="text-lg font-bold mb-5" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
            Client & Meta
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Client Name *</label>
              <input style={inputStyle} value={form.clientName} onChange={(e) => set("clientName", e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Address As</label>
              <input
                style={inputStyle}
                value={form.addressAs ?? ""}
                onChange={(e) => set("addressAs", e.target.value)}
                placeholder={form.clientName ? form.clientName.split(" ")[0] : "Harsha"}
              />
              <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                Used in the email greeting and sign-confirmation banner. Leave blank to use the first word of Client Name.
              </p>
            </div>
            <div>
              <label style={labelStyle}>Signer Full Name</label>
              <input
                style={inputStyle}
                value={form.signerFullName ?? ""}
                onChange={(e) => set("signerFullName", e.target.value)}
                placeholder="Harsha Karnani"
              />
              <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                Full legal name of the person signing. Shown on the signature block. Leave blank when Client Name is already an individual.
              </p>
            </div>
            <div>
              <label style={labelStyle}>Badge</label>
              <input style={inputStyle} value={form.badge ?? ""} onChange={(e) => set("badge", e.target.value)} placeholder="Shopify Store Build Proposal" />
            </div>
            <div>
              <label style={labelStyle}>Headline</label>
              <input style={inputStyle} value={form.headline ?? ""} onChange={(e) => set("headline", e.target.value)} placeholder="Proposal for" />
            </div>
            <div>
              <label style={labelStyle}>Prepared For</label>
              <input style={inputStyle} value={form.preparedFor ?? ""} onChange={(e) => set("preparedFor", e.target.value)} placeholder="Harsha Karnani | Panama" />
            </div>
            <div>
              <label style={labelStyle}>Prepared By</label>
              <input style={inputStyle} value={form.preparedBy ?? ""} onChange={(e) => set("preparedBy", e.target.value)} placeholder="Praveen Mahtani | AILevelUp" />
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input style={inputStyle} value={form.date} onChange={(e) => set("date", e.target.value)} placeholder={today} />
            </div>
            <div>
              <label style={labelStyle}>Valid Until</label>
              <input style={inputStyle} value={form.validUntil ?? ""} onChange={(e) => set("validUntil", e.target.value)} placeholder="May 6, 2026" />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.status ?? "draft"} onChange={(e) => set("status", e.target.value as Proposal["status"])}>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="signed">Signed</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label style={labelStyle}>Subtitle</label>
            <textarea
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
              value={form.subtitle ?? ""}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="One-line description shown under the headline"
            />
          </div>
        </div>
      )}

      {tab === "scope" && (
        <>
          <div style={sectionStyle}>
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
              The Challenge
            </h2>
            <textarea
              style={{ ...inputStyle, minHeight: "140px", resize: "vertical" }}
              value={form.challenge ?? ""}
              onChange={(e) => set("challenge", e.target.value)}
              placeholder="Describe the client's situation and what they need..."
            />
          </div>
          <div style={sectionStyle}>
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
              Deliverables
            </h2>
            {(form.deliverables ?? []).map((d, i) => (
              <div key={i} className="mb-3 p-3 rounded-xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>#{i + 1}</span>
                  <button type="button" onClick={() => removeDeliverable(i)} style={removeBtnStyle}>Remove</button>
                </div>
                <div className="mb-2">
                  <label style={labelStyle}>Deliverable</label>
                  <input style={inputStyle} value={d.deliverable} onChange={(e) => setDeliverable(i, "deliverable", e.target.value)} placeholder="Shopify Store" />
                </div>
                <div>
                  <label style={labelStyle}>Details</label>
                  <textarea style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} value={d.details} onChange={(e) => setDeliverable(i, "details", e.target.value)} placeholder="Basic Shopify plan (~$30/mo USD)..." />
                </div>
              </div>
            ))}
            <button type="button" onClick={pushDeliverable} style={addBtnStyle}>+ Add Deliverable</button>
          </div>
          <StringArrayEditor
            items={form.scopeIncluded ?? []} label="Scope — Included" placeholder="Shopify store setup and theme customization"
            onAdd={() => pushStr("scopeIncluded")} onChange={(i, v) => setStrAt("scopeIncluded", i, v)} onRemove={(i) => removeStrAt("scopeIncluded", i)}
          />
          <StringArrayEditor
            items={form.scopeExcluded ?? []} label="Scope — Not Included" placeholder="Product photography"
            onAdd={() => pushStr("scopeExcluded")} onChange={(i, v) => setStrAt("scopeExcluded", i, v)} onRemove={(i) => removeStrAt("scopeExcluded", i)}
          />
        </>
      )}

      {tab === "timeline" && (
        <div style={sectionStyle}>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
            Timeline
          </h2>
          {(form.timeline ?? []).map((t, i) => (
            <div key={i} className="mb-3 p-3 rounded-xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>#{i + 1}</span>
                <button type="button" onClick={() => removeTimelineAt(i)} style={removeBtnStyle}>Remove</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                <div>
                  <label style={labelStyle}>Week / Phase</label>
                  <input style={inputStyle} value={t.week} onChange={(e) => setTimelineAt(i, "week", e.target.value)} placeholder="Week 1 - Setup" />
                </div>
                <div>
                  <label style={labelStyle}>Title</label>
                  <input style={inputStyle} value={t.title} onChange={(e) => setTimelineAt(i, "title", e.target.value)} placeholder="Shopify store, theme, domain" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} value={t.description} onChange={(e) => setTimelineAt(i, "description", e.target.value)} placeholder="Store created, theme customized..." />
              </div>
            </div>
          ))}
          <button type="button" onClick={pushTimeline} style={addBtnStyle}>+ Add Week</button>
          <div className="mt-4">
            <label style={labelStyle}>Timeline Note</label>
            <input style={inputStyle} value={form.timelineNote ?? ""} onChange={(e) => set("timelineNote", e.target.value)} placeholder="Timeline assumes timely feedback..." />
          </div>
        </div>
      )}

      {tab === "pricing" && (
        <>
          <div style={sectionStyle}>
            <h2 className="text-lg font-bold mb-5" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
              Pricing
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Phase Name</label>
                <input style={inputStyle} value={form.pricingPhase ?? ""} onChange={(e) => set("pricingPhase", e.target.value)} placeholder="Phase 1 - Store Build" />
              </div>
              <div>
                <label style={labelStyle}>Subtitle</label>
                <input style={inputStyle} value={form.pricingSubtitle ?? ""} onChange={(e) => set("pricingSubtitle", e.target.value)} placeholder="Shopify store with 50 products" />
              </div>
              <div>
                <label style={labelStyle}>Amount</label>
                <input style={inputStyle} value={form.pricingAmount ?? ""} onChange={(e) => set("pricingAmount", e.target.value)} placeholder="$500" />
              </div>
              <div>
                <label style={labelStyle}>Currency</label>
                <input style={inputStyle} value={form.pricingCurrency ?? ""} onChange={(e) => set("pricingCurrency", e.target.value)} placeholder="USD" />
              </div>
              <div>
                <label style={labelStyle}>Alt Amount (optional)</label>
                <input style={inputStyle} value={form.pricingAmountAlt ?? ""} onChange={(e) => set("pricingAmountAlt", e.target.value)} placeholder="$725" />
              </div>
              <div>
                <label style={labelStyle}>Alt Currency (optional)</label>
                <input style={inputStyle} value={form.pricingCurrencyAlt ?? ""} onChange={(e) => set("pricingCurrencyAlt", e.target.value)} placeholder="USD" />
              </div>
              <div className="sm:col-span-2">
                <label style={labelStyle}>Pricing Note</label>
                <input style={inputStyle} value={form.pricingNote ?? ""} onChange={(e) => set("pricingNote", e.target.value)} placeholder="One-time build fee · 50/50 payment split" />
              </div>
              <div>
                <label style={labelStyle}>Payment Terms</label>
                <input style={inputStyle} value={form.paymentTerms ?? ""} onChange={(e) => set("paymentTerms", e.target.value)} placeholder="50% to start, 50% on delivery" />
              </div>
              <div>
                <label style={labelStyle}>Payment Methods</label>
                <input style={inputStyle} value={form.paymentMethods ?? ""} onChange={(e) => set("paymentMethods", e.target.value)} placeholder="Wire transfer, Wise, PayPal" />
              </div>
            </div>
          </div>
          <StringArrayEditor
            items={form.pricingIncludes ?? []} label="Pricing Includes" placeholder="50 product pages with variants"
            onAdd={() => pushStr("pricingIncludes")} onChange={(i, v) => setStrAt("pricingIncludes", i, v)} onRemove={(i) => removeStrAt("pricingIncludes", i)}
          />

          <div style={sectionStyle}>
            <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
              Setup Fees
            </h2>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Optional add-ons billed separately (domain, email, etc.)
            </p>
            {(form.setupFees ?? []).map((f, i) => (
              <div key={i} className="mb-3 p-3 rounded-xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>#{i + 1}</span>
                  <button type="button" onClick={() => removeSetupFeeAt(i)} style={removeBtnStyle}>Remove</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label style={labelStyle}>Item</label>
                    <input style={inputStyle} value={f.item} onChange={(e) => setSetupFeeAt(i, "item", e.target.value)} placeholder="Domain & Email Setup" />
                  </div>
                  <div>
                    <label style={labelStyle}>Amount</label>
                    <input style={inputStyle} value={f.amount} onChange={(e) => setSetupFeeAt(i, "amount", e.target.value)} placeholder="$100 CAD + costs" />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={pushSetupFee} style={addBtnStyle}>+ Add Setup Fee</button>
          </div>
        </>
      )}

      {tab === "action" && (
        <>
          <div style={sectionStyle}>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
              Managed Setup Option
            </h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.managedSetup ?? false}
                onChange={(e) => set("managedSetup", e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "var(--accent, #6366F1)", cursor: "pointer" }}
              />
              <div>
                <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Show managed domain &amp; email option
                </span>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Adds a callout on the proposal: &quot;We can handle domain &amp; email setup for $100 CAD + cost of services&quot;
                </p>
              </div>
            </label>
          </div>

          <StringArrayEditor
            items={form.whatWeNeed ?? []} label="What We Need From Client" placeholder="Provide store admin access"
            onAdd={() => pushStr("whatWeNeed")} onChange={(i, v) => setStrAt("whatWeNeed", i, v)} onRemove={(i) => removeStrAt("whatWeNeed", i)}
          />
          <StringArrayEditor
            items={form.clientProvides ?? []} label="Client Provides" placeholder="All product photography"
            onAdd={() => pushStr("clientProvides")} onChange={(i, v) => setStrAt("clientProvides", i, v)} onRemove={(i) => removeStrAt("clientProvides", i)}
          />
          <div style={sectionStyle}>
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
              Terms
            </h2>
            {(form.terms ?? []).map((t, i) => (
              <div key={i} className="mb-3 p-3 rounded-xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>#{i + 1}</span>
                  <button type="button" onClick={() => removeTermAt(i)} style={removeBtnStyle}>Remove</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label style={labelStyle}>Label</label>
                    <input style={inputStyle} value={t.label} onChange={(e) => setTermAt(i, "label", e.target.value)} placeholder="Payment" />
                  </div>
                  <div className="sm:col-span-2">
                    <label style={labelStyle}>Value</label>
                    <input style={inputStyle} value={t.value} onChange={(e) => setTermAt(i, "value", e.target.value)} placeholder="50% on sign-off. 50% on delivery." />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={pushTerm} style={addBtnStyle}>+ Add Term</button>
          </div>
          <StringArrayEditor
            items={form.ctaSteps ?? []} label="Next Steps (CTA)" placeholder="Client reviews and confirms this proposal"
            onAdd={() => pushStr("ctaSteps")} onChange={(i, v) => setStrAt("ctaSteps", i, v)} onRemove={(i) => removeStrAt("ctaSteps", i)}
          />
        </>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-xl text-sm font-semibold" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 rounded-xl text-base font-bold transition-all disabled:opacity-50"
        style={{ background: "var(--accent, #6366F1)", color: "#FFFFFF", cursor: submitting ? "not-allowed" : "pointer" }}
      >
        {submitting ? "Saving..." : mode === "create" ? "Create Proposal" : "Save Changes"}
      </button>
    </form>
  );
}
