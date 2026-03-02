import AgentCard from "@/components/AgentCard";
import { AGENTS } from "@/lib/agents";

// ─── Data ─────────────────────────────────────────────────────────────────────

const WHO_CARDS = [
  { emoji: "🛒", title: "Retail Stores", desc: "Answer customer questions overnight. Reconcile sales automatically. Never run out of stock silently." },
  { emoji: "🛍️", title: "E-commerce", desc: "Instant support, daily sales reconciliation, and inventory alerts — fully automated." },
  { emoji: "🍽️", title: "Restaurants", desc: "Automate reservations, menu FAQs, and order status. Zero calls for basic info." },
  { emoji: "🎯", title: "Service Businesses", desc: "Qualify leads, answer FAQs, book appointments 24/7. Wake up to confirmed clients." },
  { emoji: "🏨", title: "Hospitality", desc: "Handle guest inquiries, booking requests, and amenity questions around the clock." },
  { emoji: "📣", title: "Agencies", desc: "Automate client reporting, content research, and campaign updates without lifting a finger." },
];

const TICKER_ITEMS = [
  "AI OPERATIONS",
  "CUSTOM AGENTS",
  "ZERO FLUFF",
  "BARBADOS-BUILT",
  "SMALL BUSINESS SCALE",
  "AUTOMATE EVERYTHING",
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main style={{ background: "var(--bg)" }}>

      {/* ── 1. NAV ────────────────────────────────────────────────────────── */}
      <nav
        className="px-6 py-4 sticky top-0 z-50"
        style={{ background: "#0A0A0A", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span
            className="text-xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--coral)", fontStyle: "italic" }}
          >
            ailevelup
          </span>
          <a
            href="https://wa.me/12463334444"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "var(--coral)", color: "#0A0A0A" }}
          >
            Book a call
          </a>
        </div>
      </nav>

      {/* ── 2. TICKER BAR ─────────────────────────────────────────────────── */}
      <div
        className="py-3"
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        <div className="marquee-track">
          {[0, 1].map((copyIdx) => (
            <span key={copyIdx} className="flex items-center">
              {TICKER_ITEMS.map((item, j) => (
                <span key={j} className="flex items-center">
                  <span
                    className="text-xs tracking-widest uppercase px-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item}
                  </span>
                  <span style={{ color: "var(--coral)" }}>·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. HERO ───────────────────────────────────────────────────────── */}
      <section
        className="grain relative px-6 py-24 min-h-screen flex items-center"
        style={{ overflow: "hidden" }}
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex flex-col md:flex-row gap-16 items-center">

            {/* LEFT 60% */}
            <div className="md:w-[60%]">
              <p
                className="text-xs tracking-widest uppercase mb-6"
                style={{ color: "var(--coral)" }}
              >
                AI Operations Studio
              </p>
              <h1
                className="text-6xl md:text-8xl mb-6"
                style={{ fontFamily: "var(--font-display)", lineHeight: 1, color: "var(--text)" }}
              >
                Your business.<br />On autopilot.
              </h1>
              <p
                className="text-xl mt-6 mb-10 max-w-md"
                style={{ fontFamily: "var(--font-sans)", color: "var(--text-muted)" }}
              >
                We build custom AI agents that handle customer support, reconciliation, and content — so your team stops doing work a machine can do better.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#agents"
                  className="px-8 py-4 rounded-full text-base font-semibold transition-opacity hover:opacity-80"
                  style={{ background: "var(--coral)", color: "#0A0A0A" }}
                >
                  See it live
                </a>
                <a
                  href="#how"
                  className="px-8 py-4 rounded-full text-base font-semibold transition-opacity hover:opacity-70"
                  style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                >
                  How it works
                </a>
              </div>
            </div>

            {/* RIGHT 40% — floating decorative chat card */}
            <div className="md:w-[40%] w-full">
              <div
                style={{
                  transform: "rotate(-2deg) translateY(-20px)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
                }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-semibold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--coral)", fontStyle: "italic" }}
                  >
                    Scout
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs" style={{ color: "#10B981" }}>online</span>
                  </div>
                </div>

                {/* Sample chat */}
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <div
                      className="max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed"
                      style={{ background: "rgba(255,107,53,0.15)", color: "var(--text)", borderBottomRightRadius: "4px" }}
                    >
                      A customer asked about their PSN code — haven&apos;t replied yet
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: "rgba(255,107,53,0.15)" }}
                    >
                      🎮
                    </div>
                    <div
                      className="max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "var(--text)",
                        border: "1px solid var(--border)",
                        borderBottomLeftRadius: "4px",
                      }}
                    >
                      Already handled it — sent the code and asked if they needed anything else. Ticket closed. ✓
                    </div>
                  </div>
                </div>

                {/* Decorative input bar */}
                <div
                  className="flex items-center gap-2 mt-4 p-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}
                >
                  <span className="flex-1 text-sm" style={{ color: "var(--text-muted)" }}>
                    Ask Scout anything...
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "var(--coral)", color: "#0A0A0A" }}
                  >
                    Send
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. STATS ──────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6"
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: "70%", label: "of routine support automated" },
            { num: "3 min", label: "avg response time" },
            { num: "24/7", label: "operations coverage" },
            { num: "$0", label: "per automated conversation" },
          ].map((s, i) => (
            <div key={i} className="text-center px-4">
              <div
                className="text-7xl mb-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--coral)", lineHeight: 1 }}
              >
                {s.num}
              </div>
              <div
                className="text-sm uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. AGENT CARDS ────────────────────────────────────────────────── */}
      <section id="agents" className="py-24 px-6" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2
              className="text-5xl mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              Meet the team
            </h2>
            <p
              className="text-lg max-w-xl"
              style={{ fontFamily: "var(--font-sans)", color: "var(--text-muted)" }}
            >
              These aren&apos;t demos — they&apos;re the actual agents we deploy for clients. Chat with them now.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AGENTS.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. HOW IT WORKS ───────────────────────────────────────────────── */}
      <section id="how" className="py-24 px-6" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-5xl mb-16"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            From call to live agent in 5 days
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                num: "01",
                title: "Discovery call",
                desc: "We map your biggest time sinks in a focused 30-minute session.",
              },
              {
                num: "02",
                title: "We build",
                desc: "Custom agents trained on your data, workflows, and business logic. No generic chatbots.",
              },
              {
                num: "03",
                title: "You automate",
                desc: "Deployed and refined weekly. You stay in control — AI does the work.",
              },
            ].map((step) => (
              <div key={step.num}>
                <div
                  className="text-8xl mb-4 opacity-30"
                  style={{ fontFamily: "var(--font-display)", color: "var(--coral)", lineHeight: 1 }}
                >
                  {step.num}
                </div>
                <h3
                  className="text-2xl mb-3"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                >
                  {step.title}
                </h3>
                <p style={{ fontFamily: "var(--font-sans)", color: "var(--text-muted)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. WHO WE HELP ────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-5xl mb-12"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Built for operators, not enterprises
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHO_CARDS.map((c) => (
              <div
                key={c.title}
                className="rounded-xl p-6"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div className="text-3xl mb-4">{c.emoji}</div>
                <h3
                  className="text-xl mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                >
                  {c.title}
                </h3>
                <p
                  className="text-sm"
                  style={{ fontFamily: "var(--font-sans)", color: "var(--text-muted)" }}
                >
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA BAND ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 text-center" style={{ background: "var(--coral)" }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-5xl font-bold mb-6"
            style={{ fontFamily: "var(--font-display)", color: "#0A0A0A" }}
          >
            Ready to stop doing everything manually?
          </h2>
          <p className="text-lg mb-10" style={{ color: "rgba(10,10,10,0.7)" }}>
            30-minute call. We map your biggest time sinks and give you a clear plan — no commitment required.
          </p>
          <a
            href="https://wa.me/12463334444"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-opacity hover:opacity-80"
            style={{ background: "#0A0A0A", color: "#FFFFFF" }}
          >
            WhatsApp us now
          </a>
        </div>
      </section>

      {/* ── 9. FOOTER ─────────────────────────────────────────────────────── */}
      <footer
        className="py-12 px-6"
        style={{ background: "#080808", borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span
            className="text-xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--coral)", fontStyle: "italic" }}
          >
            ailevelup
          </span>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            Built in Barbados. Deployed everywhere.
          </span>
        </div>
        <div className="max-w-7xl mx-auto mt-6 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            © 2026 ailevelup.ca
          </span>
          <a
            href="mailto:praveen@play.bb"
            className="text-xs transition-opacity hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            praveen@play.bb
          </a>
        </div>
      </footer>

    </main>
  );
}
