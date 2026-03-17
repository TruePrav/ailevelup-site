const CASE_STUDIES = [
  {
    tag: "Retail Automation",
    title: "Caribbean Clothing Retailer",
    problem:
      "Daily stock replenishment was entirely manual — staff printed sales reports, then looked up every item in the system by hand and wrote remaining quantities on paper.",
    solution: [
      "Upload 2 CSVs (store sales + warehouse stock) → instant replenishment report",
      "Smart matching: exact → fuzzy → LLM fallback for unrecognised items",
      "Self-learning: corrections saved and applied on future runs",
    ],
    stack: ["Python", "LangChain", "FastAPI", "Lightspeed POS"],
    result: "Manual stock cross-check eliminated entirely. Phase 2 adds live Lightspeed API sync.",
    accent: "#6366F1",
  },
  {
    tag: "Agent Network · Retail Ops",
    title: "Multi-Location Gaming Retail Chain",
    problem:
      "Customer support, daily sales reconciliation, and inventory reordering across two stores were manual, fragmented, and eating hours every day.",
    solution: [
      "6-agent AI network: support, reconciliation, reorder intelligence, content, and more",
      "Support agent hit 100% eval pass rate across 73 real-world test cases",
      "Reconciliation runs daily — POS data synced to Google Sheets without human input",
    ],
    stack: ["Python", "LangChain", "LangGraph", "Telegram", "Discord", "Google Sheets API", "Lightspeed API"],
    result: "Support automated. Daily reconciliation hands-free. Reorder reports generated on schedule.",
    accent: "#8B5CF6",
  },
];

export default function CaseStudies() {
  return (
    <section
      id="work"
      className="py-28 px-6"
      style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: "var(--accent)" }}
          >
            Selected Work
          </p>
          <h2
            className="text-5xl md:text-6xl mb-5"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            Real problems.
            <br />
            <span style={{ color: "var(--accent)" }}>Real systems. Shipped.</span>
          </h2>
          <p className="text-lg max-w-xl" style={{ color: "var(--text-muted)" }}>
            Every engagement starts with a real business problem and ends with something running in production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CASE_STUDIES.map((cs) => (
            <div
              key={cs.title}
              className="rounded-3xl p-8 flex flex-col gap-6"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Tag */}
              <div>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase"
                  style={{
                    background: `${cs.accent}18`,
                    color: cs.accent,
                  }}
                >
                  {cs.tag}
                </span>
              </div>

              {/* Title + Problem */}
              <div>
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                >
                  {cs.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  <span className="font-semibold" style={{ color: "var(--text)" }}>
                    Problem:{" "}
                  </span>
                  {cs.problem}
                </p>
              </div>

              {/* Solution bullets */}
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  What we built
                </p>
                <ul className="flex flex-col gap-2">
                  {cs.solution.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm" style={{ color: "var(--text)" }}>
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: cs.accent }}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stack chips */}
              <div className="flex flex-wrap gap-2">
                {cs.stack.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Result */}
              <div
                className="rounded-xl p-4 mt-auto"
                style={{
                  background: `${cs.accent}10`,
                  border: `1px solid ${cs.accent}30`,
                }}
              >
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: cs.accent }}>
                  Result
                </p>
                <p className="text-sm" style={{ color: "var(--text)" }}>
                  {cs.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
