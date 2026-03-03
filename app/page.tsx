import AgentCard from "@/components/AgentCard";
import { AGENTS } from "@/lib/agents";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollButton from "@/components/ScrollButton";

// ─── Data ─────────────────────────────────────────────────────────────────────

const WHO_CARDS = [
  { emoji: "🛒", title: "Retail Stores", desc: "Know your numbers every morning. Never miss a supplier error or run out of stock silently." },
  { emoji: "🛍️", title: "E-commerce", desc: "Automated support, daily reconciliation, inventory alerts — your store runs while you sleep." },
  { emoji: "🍽️", title: "Restaurants", desc: "Answer FAQs, handle reservations, and track your busiest hours — without adding headcount." },
  { emoji: "🎯", title: "Service Businesses", desc: "Qualify leads, book appointments, and follow up automatically. Wake up to a full calendar." },
  { emoji: "🏨", title: "Hospitality", desc: "Guest inquiries answered instantly, 24/7. Every question handled before it becomes a complaint." },
  { emoji: "📣", title: "Agencies & Consultants", desc: "Automate client reporting, content research, and project updates. Deliver more without hiring." },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main style={{ background: "var(--bg)" }}>
      <ScrollToTop />

      {/* ── 1. NAV ────────────────────────────────────────────────────────── */}
      <nav
        className="px-6 py-4 sticky top-0 z-50"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--accent)", fontStyle: "italic" }}
          >
            ailevelup
          </span>
          <div className="flex items-center gap-4">
            <ScrollButton
              targetId="agents"
              className="hidden md:block text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: "var(--text-muted)", fontFamily: "inherit", fontSize: "inherit" }}
            >
              Talk to your agents
            </ScrollButton>
            <a
              href="https://wa.me/12463334444"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ background: "var(--accent)", color: "#FFFFFF" }}
            >
              Book a call
            </a>
          </div>
        </div>
      </nav>

      {/* ── 2. HERO ───────────────────────────────────────────────────────── */}
      <section className="relative px-6 py-28 overflow-hidden" style={{ background: "var(--bg)" }}>
        {/* Radial indigo glow top-right */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            {/* LEFT */}
            <div className="lg:w-[55%] fade-up">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{ background: "var(--accent-light)", color: "var(--accent)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Agents live now — chat below
              </div>

              <h1
                className="text-5xl md:text-7xl leading-none mb-6"
                style={{ fontFamily: "var(--font-display)", color: "var(--text)", letterSpacing: "-0.02em" }}
              >
                Your business,
                <br />
                <span style={{ color: "var(--accent)" }}>on autopilot.</span>
              </h1>

              <p
                className="text-xl mb-10 max-w-lg leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                We build and deploy AI agents for support, finance, ops, and marketing.
                Done-for-you. Running 24/7.
              </p>

              <div className="flex flex-wrap gap-4">
                <ScrollButton
                  targetId="agents"
                  className="px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-105 flex items-center gap-2"
                  style={{ background: "var(--accent)", color: "#FFFFFF", fontFamily: "inherit", fontSize: "inherit" }}
                >
                  Talk to your agents
                  <span>↓</span>
                </ScrollButton>
                <a
                  href="https://wa.me/12463334444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-80"
                  style={{ border: "1.5px solid var(--accent-border)", color: "var(--accent)", background: "var(--accent-light)" }}
                >
                  Book a free call
                </a>
              </div>
            </div>

            {/* RIGHT — live dashboard card */}
            <div className="lg:w-[45%] w-full">
              <div
                style={{
                  transform: "rotate(1.5deg)",
                  background: "#FFFFFF",
                  border: "1px solid var(--accent-border)",
                  borderRadius: "1.25rem",
                  padding: "1.5rem",
                  boxShadow: "0 20px 60px rgba(79,70,229,0.12), 0 4px 16px rgba(0,0,0,0.06)",
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
                    Your business · Today
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: "#10B981" }}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    All agents running
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: "🎮", agent: "Scout", status: "23 support tickets resolved", sub: "0 unanswered · avg 47s response", color: "#00d4ff" },
                    { icon: "📊", agent: "Ledger", status: "Sales reconciled ✓", sub: "$4,280 matched · 1 supplier discrepancy flagged", color: "#a855f7" },
                    { icon: "✍️", agent: "Aria", status: "3 posts drafted for review", sub: "Top trend: AI automation for retail", color: "#f59e0b" },
                  ].map((item) => (
                    <div
                      key={item.agent}
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 mt-0.5"
                        style={{ background: `${item.color}15` }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                          {item.agent}: {item.status}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {item.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-4 p-3 rounded-xl text-center text-xs font-semibold"
                  style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                >
                  This is what your mornings look like with AILevelUp
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. QUICK STATS ────────────────────────────────────────────────── */}
      <section
        className="py-16 px-6"
        style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: "70%", label: "of support automated" },
            { num: "< 1 min", label: "avg customer response" },
            { num: "24/7", label: "operations coverage" },
            { num: "5 days", label: "from call to live agent" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-5xl font-bold mb-1"
                style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}
              >
                {s.num}
              </div>
              <div className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. AGENTS — the centerpiece ───────────────────────────────────── */}
      <section id="agents" className="py-28 px-6" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: "var(--accent)" }}
            >
              Live Agents
            </p>
            <h2
              className="text-5xl md:text-6xl mb-5"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)", letterSpacing: "-0.02em" }}
            >
              Talk to your agents.
              <br />
              <span style={{ color: "var(--accent)" }}>Right now.</span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "var(--text-muted)" }}
            >
              These aren&apos;t demos. They&apos;re barebones versions of agents already running for real businesses —
              fine-tuned to their products, their voice, their operations.
              Chat with them and see what a version trained on your business would look like.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AGENTS.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>

          <div
            className="mt-10 rounded-2xl p-6 text-center"
            style={{ background: "var(--accent-light)", border: "1px solid var(--accent-border)" }}
          >
            <p className="text-base font-semibold mb-1" style={{ color: "var(--accent)" }}>
              What you&apos;re talking to is the barebones version. Yours would be fully trained on your business.
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Your agent learns your products, your tone, your customers, your data — and handles every business function that eats your time.
              We build it, deploy it, and maintain it. No technical knowledge required.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ───────────────────────────────────────────────── */}
      <section
        id="how"
        className="py-24 px-6"
        style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2
              className="text-5xl mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)", letterSpacing: "-0.02em" }}
            >
              From call to live agent in 5 days.
            </h2>
            <p className="text-lg max-w-xl" style={{ color: "var(--text-muted)" }}>
              We handle the build. You keep running your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                num: "01",
                title: "Discovery call",
                desc: "30 minutes. We map your biggest time sinks — customer questions, manual reporting, content. No commitment.",
              },
              {
                num: "02",
                title: "We build",
                desc: "Custom agents trained on your business, your data, your voice. No generic chatbots. No templates.",
              },
              {
                num: "03",
                title: "You become the expert",
                desc: "Every morning you wake up knowing your numbers, your customers are answered, and your brand is active — automatically.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="p-8 rounded-2xl"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div
                  className="text-6xl font-bold mb-5 opacity-20"
                  style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}
                >
                  {step.num}
                </div>
                <h3
                  className="text-2xl mb-3"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. WHO WE HELP ────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2
              className="text-5xl mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)", letterSpacing: "-0.02em" }}
            >
              Built for business owners,
              <br />not enterprises.
            </h2>
            <p className="text-lg max-w-xl" style={{ color: "var(--text-muted)" }}>
              We work with small and medium businesses that run lean — where one person wearing six hats is the norm.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHO_CARDS.map((c) => (
              <div
                key={c.title}
                className="rounded-xl p-6 transition-all hover:-translate-y-1"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="text-3xl mb-4">{c.emoji}</div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                >
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA BAND ───────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #3730A3 0%, #4F46E5 50%, #6366F1 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-5xl font-bold mb-5"
            style={{ fontFamily: "var(--font-display)", color: "#FFFFFF", letterSpacing: "-0.02em" }}
          >
            Stop guessing.
            <br />Start knowing.
          </h2>
          <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.8)" }}>
            30-minute call. We&apos;ll map out exactly which agents would have the biggest impact on your business — no commitment, no pitch deck.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/12463334444"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-105"
              style={{ background: "#FFFFFF", color: "var(--accent)" }}
            >
              WhatsApp us now
            </a>
            <a
              href="mailto:info@ailevelup.ca"
              className="px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-80"
              style={{ border: "1.5px solid rgba(255,255,255,0.5)", color: "#FFFFFF" }}
            >
              info@ailevelup.ca
            </a>
          </div>
        </div>
      </section>

      {/* ── 8. FOOTER ─────────────────────────────────────────────────────── */}
      <footer
        className="py-12 px-6"
        style={{ background: "#F8F9FF", borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--accent)", fontStyle: "italic" }}
          >
            ailevelup
          </span>
          <div className="flex items-center gap-6">
            <a
              href="mailto:info@ailevelup.ca"
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: "var(--text-muted)" }}
            >
              info@ailevelup.ca
            </a>
            <a
              href="https://wa.me/12463334444"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: "var(--text-muted)" }}
            >
              WhatsApp
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 flex flex-wrap items-center justify-between gap-2"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            © 2026 ailevelup.ca — AI automation for businesses that want to grow.
          </span>
        </div>
      </footer>

    </main>
  );
}
