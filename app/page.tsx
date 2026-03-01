import AgentCard from "@/components/AgentCard";
import { AGENTS } from "@/lib/agents";

// ─── Design tokens ──────────────────────────────────────────────────────────
const CORAL = "#FF6B35";
const BG_CARD = "#141414";
const TEXT = "#F5F0E8";
const TEXT_MUTED = "#8A8078";

// ─── Data ───────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    emoji: "🤖",
    title: "Customer Support Agent",
    desc: "Handle 100+ daily questions across WhatsApp, Telegram, and web. Never miss a message again.",
  },
  {
    emoji: "📊",
    title: "Operations Automation",
    desc: "Reconciliation, reporting, inventory tracking. Done automatically. Every single day.",
  },
  {
    emoji: "📈",
    title: "Content & Growth",
    desc: "AI agents that research trends, draft content, and track performance across your platforms.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Discovery Call · 30 min",
    desc: "Map your ops, pain points, and data sources in a focused session.",
  },
  {
    num: "02",
    title: "Build & Train · 1 week",
    desc: "Custom agents trained on your workflows, products, and business data.",
  },
  {
    num: "03",
    title: "Launch & Monitor · ongoing",
    desc: "Deployed and improved weekly. You stay in control, AI does the work.",
  },
];

const RESULTS = [
  {
    num: "40%+",
    label: "Ops Automated",
    context: "Gaming retailer · 2 locations · Barbados · live since 2025",
    desc: "Daily reconciliation, supplier checks, inventory alerts — all running without human input.",
  },
  {
    num: "0",
    label: "Missed Messages",
    context: "24/7 customer support · WhatsApp + Telegram + web",
    desc: "AI handles every inbound question around the clock. Response time: under 10 seconds.",
  },
  {
    num: "7 Days",
    label: "First Agent Live",
    context: "from first call to live in production",
    desc: "Discovery call Monday. Agents live the following week. No IT team, no long onboarding.",
  },
];

const WHO_CARDS = [
  {
    emoji: "🛒",
    title: "Retailers",
    desc: "Handle 100+ daily questions without extra staff. Your AI answers overnight.",
  },
  {
    emoji: "🍽️",
    title: "Restaurants",
    desc: "Automate reservations, menu FAQs, and order tracking. Zero calls for basic info.",
  },
  {
    emoji: "📦",
    title: "eCommerce",
    desc: "Instant support and daily sales reconciliation — fully automated, no manual work.",
  },
  {
    emoji: "🎯",
    title: "Service Businesses",
    desc: "Qualify leads, answer FAQs, and book appointments 24/7. Wake up to booked clients.",
  },
];

const TICKER_TEXT =
  "Live in 7 Days · 40%+ Ops Automated · Real AI, Not Chatbots · Caribbean-Built · 24/7 Coverage · Zero Missed Messages · ";

// ─── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="relative min-h-screen" style={{ background: "#0A0A0A", color: TEXT }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav
        className="px-6 py-4 sticky top-0 z-50"
        style={{ background: "#0A0A0A", borderBottom: "1px solid rgba(245,240,232,0.06)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)", color: CORAL }}
          >
            ailevelup
          </span>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-8">
            {["Services", "Agents", "Results", "How It Works"].map((label) => {
              const href = label === "How It Works" ? "#how" : `#${label.toLowerCase()}`;
              return (
                <a key={label} href={href} className="text-sm transition-colors hover:text-[#F5F0E8]"
                  style={{ color: TEXT_MUTED }}>
                  {label}
                </a>
              );
            })}
          </div>

          {/* CTA */}
          <a
            href="mailto:hello@ailevelup.ca"
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: CORAL, color: "#FFFFFF", fontFamily: "var(--font-dm-sans)" }}
          >
            Book a Free Call
          </a>
        </div>
      </nav>

      {/* ── TICKER ──────────────────────────────────────────────────────── */}
      <div
        className="py-3 overflow-hidden"
        style={{ background: BG_CARD, borderBottom: "1px solid rgba(245,240,232,0.05)" }}
      >
        <div className="marquee-track">
          {/* Repeated twice for seamless loop */}
          <span className="text-xs mr-0" style={{ color: TEXT_MUTED, fontFamily: "var(--font-dm-sans)" }}>
            {TICKER_TEXT}{TICKER_TEXT}
          </span>
          <span className="text-xs mr-0" style={{ color: TEXT_MUTED, fontFamily: "var(--font-dm-sans)" }}>
            {TICKER_TEXT}{TICKER_TEXT}
          </span>
        </div>
      </div>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* LEFT col */}
          <div>
            {/* Label */}
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: CORAL, fontFamily: "var(--font-dm-sans)" }}
            >
              AI Operations Partner
            </p>

            {/* H1 */}
            <h1
              className="font-black leading-tight"
              style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: "clamp(3rem,7vw,5.5rem)",
                color: TEXT,
                fontWeight: 900,
              }}
            >
              Your team is doing work
              <br />
              <span style={{ color: CORAL }}>AI should handle.</span>
            </h1>

            {/* Subtext */}
            <p
              className="mt-6 text-lg leading-relaxed"
              style={{ color: TEXT_MUTED, fontFamily: "var(--font-dm-sans)" }}
            >
              We build custom AI agents that handle reconciliation, customer support,
              and content — so your team focuses on growth.
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3 mt-8">
              {["⚡ Live in 7 days", "🤖 24/7 coverage", "✅ No IT team"].map((pill) => (
                <span
                  key={pill}
                  className="px-4 py-2 rounded-full text-sm"
                  style={{
                    background: BG_CARD,
                    border: `1px solid ${CORAL}`,
                    color: TEXT,
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mt-10">
              <a
                href="mailto:hello@ailevelup.ca?subject=Free Strategy Call"
                className="inline-block px-7 py-3.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
                style={{ background: CORAL, color: "#FFFFFF", fontFamily: "var(--font-dm-sans)" }}
              >
                Book a Free Call →
              </a>
              <a
                href="#agents"
                className="inline-block px-7 py-3.5 rounded-lg text-sm font-semibold transition-colors hover:bg-[#1a1a1a]"
                style={{
                  border: `1px solid rgba(245,240,232,0.15)`,
                  color: TEXT,
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                See Agents Live
              </a>
            </div>
          </div>

          {/* RIGHT col — hero card preview */}
          <div className="flex justify-center">
            <div
              className="w-full max-w-sm shadow-2xl rounded-2xl overflow-hidden"
              style={{
                transform: "rotate(-2deg)",
                border: `1px solid rgba(255,107,53,0.20)`,
                background: BG_CARD,
              }}
            >
              {/* Agent card header */}
              <div className="p-5" style={{ borderBottom: "1px solid rgba(245,240,232,0.06)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ background: "rgba(0,212,255,0.12)", border: "1.5px solid rgba(0,212,255,0.3)" }}
                  >
                    🎮
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: TEXT, fontFamily: "var(--font-fraunces)" }}>Scout</span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: "rgba(255,107,53,0.12)", color: CORAL }}
                      >
                        Customer Support
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-semibold" style={{ color: "#10B981" }}>LIVE</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs" style={{ color: TEXT_MUTED, fontFamily: "var(--font-dm-sans)" }}>
                  Handles customer questions 24/7 so your team doesn&apos;t have to.
                </p>
              </div>
              {/* Static chat preview */}
              <div className="p-4 space-y-3" style={{ background: "#0F0F0F" }}>
                <div className="flex justify-start gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: "rgba(0,212,255,0.12)" }}
                  >
                    🎮
                  </div>
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                    style={{ background: "#1E1E1E", color: "#D4CFC8", borderBottomLeftRadius: "4px" }}
                  >
                    Hey! I&apos;m Scout — I handle customer questions 24/7. What does your current support setup look like?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div
                    className="max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                    style={{ background: CORAL, color: "#FFFFFF", borderBottomRightRadius: "4px" }}
                  >
                    We get 50+ WhatsApp messages a day and miss tons overnight.
                  </div>
                </div>
                <div className="flex justify-start gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: "rgba(0,212,255,0.12)" }}
                  >
                    🎮
                  </div>
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                    style={{ background: "#1E1E1E", color: "#D4CFC8", borderBottomLeftRadius: "4px" }}
                  >
                    I can handle all 50+ overnight — instantly. Want me to show you what a typical response looks like?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ───────────────────────────────────────────────────── */}
      <div
        className="py-12"
        style={{ background: BG_CARD, borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "40%", label: "Ops Automated", sub: "Gaming retailer, Barbados" },
              { num: "7 Days", label: "First Agent Live", sub: "Discovery to deployed" },
              { num: "0", label: "Missed Messages", sub: "24/7 all channels" },
              { num: "3", label: "Agents Running", sub: "In production now" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="font-black text-5xl mb-1"
                  style={{ fontFamily: "var(--font-fraunces)", color: CORAL, fontWeight: 900 }}
                >
                  {s.num}
                </div>
                <div
                  className="font-semibold text-sm mb-0.5"
                  style={{ color: TEXT, fontFamily: "var(--font-dm-sans)" }}
                >
                  {s.label}
                </div>
                <div className="text-xs" style={{ color: TEXT_MUTED }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-bold text-4xl mb-12"
            style={{ fontFamily: "var(--font-fraunces)", color: TEXT, fontWeight: 700 }}
          >
            What we build
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="service-card rounded-2xl p-8"
                style={{
                  borderLeft: `4px solid ${CORAL}`,
                }}
              >
                <div className="text-3xl mb-4">{s.emoji}</div>
                <h3
                  className="font-bold text-lg mb-3"
                  style={{ fontFamily: "var(--font-fraunces)", color: TEXT }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED, fontFamily: "var(--font-dm-sans)" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENT DEMO ──────────────────────────────────────────────────── */}
      <section id="agents" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: CORAL, fontFamily: "var(--font-dm-sans)" }}
          >
            Your AI Team
          </p>
          <h2
            className="font-bold text-4xl mb-10"
            style={{ fontFamily: "var(--font-fraunces)", color: TEXT, fontWeight: 700 }}
          >
            Meet the agents working while you sleep.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AGENTS.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section id="how" className="py-20 px-6" style={{ background: BG_CARD }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-bold text-4xl mb-14"
            style={{ fontFamily: "var(--font-fraunces)", color: TEXT, fontWeight: 700 }}
          >
            Simple to start.
          </h2>
          <div className="flex flex-col md:flex-row gap-12 md:gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="flex-1">
                <div
                  className="font-black text-7xl mb-4 select-none"
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    color: CORAL,
                    opacity: 0.4,
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </div>
                <h3
                  className="font-semibold text-base mb-2"
                  style={{ color: TEXT, fontFamily: "var(--font-dm-sans)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED, fontFamily: "var(--font-dm-sans)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS ─────────────────────────────────────────────────────── */}
      <section id="results" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-bold text-4xl mb-12"
            style={{ fontFamily: "var(--font-fraunces)", color: TEXT, fontWeight: 700 }}
          >
            Real results from real businesses.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESULTS.map((r) => (
              <div
                key={r.label}
                className="rounded-2xl p-8"
                style={{
                  background: BG_CARD,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  className="font-black text-5xl mb-2"
                  style={{ fontFamily: "var(--font-fraunces)", color: CORAL, fontWeight: 900 }}
                >
                  {r.num}
                </div>
                <p className="font-semibold text-base mb-1" style={{ color: TEXT, fontFamily: "var(--font-dm-sans)" }}>
                  {r.label}
                </p>
                <p className="text-xs mb-3" style={{ color: TEXT_MUTED }}>{r.context}</p>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED, fontFamily: "var(--font-dm-sans)" }}>
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE HELP ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-bold text-4xl mb-12"
            style={{ fontFamily: "var(--font-fraunces)", color: TEXT, fontWeight: 700 }}
          >
            Built for businesses like yours.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {WHO_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-xl p-6"
                style={{ background: BG_CARD }}
              >
                <div className="text-2xl mb-3">{card.emoji}</div>
                <h3
                  className="font-bold text-base mb-2"
                  style={{ fontFamily: "var(--font-fraunces)", color: TEXT }}
                >
                  {card.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: TEXT_MUTED, fontFamily: "var(--font-dm-sans)" }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 mb-20">
        <div
          className="max-w-7xl mx-auto rounded-3xl mx-6 py-16 px-8 text-center"
          style={{ background: BG_CARD }}
        >
          <h2
            className="font-bold mb-5"
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(1.8rem,4vw,2.5rem)",
              color: TEXT,
              fontWeight: 700,
            }}
          >
            Ready to automate the repetitive stuff?
          </h2>
          <p
            className="max-w-xl mx-auto mb-8 leading-relaxed"
            style={{ color: TEXT_MUTED, fontFamily: "var(--font-dm-sans)" }}
          >
            30-minute call. We map your biggest time sinks and give you a clear plan.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:hello@ailevelup.ca?subject=Free Strategy Call"
              className="inline-block px-7 py-3.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
              style={{ background: CORAL, color: "#FFFFFF", fontFamily: "var(--font-dm-sans)" }}
            >
              📧 Email Us
            </a>
            <a
              href="https://wa.me/12463334444?text=Hi%2C%20I%27d%20like%20to%20learn%20more%20about%20ailevelup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-7 py-3.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
              style={{ background: "#25D366", color: "#FFFFFF", fontFamily: "var(--font-dm-sans)" }}
            >
              💬 WhatsApp Us
            </a>
          </div>
          <p className="mt-6 text-xs" style={{ color: TEXT_MUTED }}>
            Serving businesses across Barbados, Trinidad, Jamaica &amp; the wider Caribbean.
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer
        className="py-8 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left */}
          <span
            className="font-bold text-lg"
            style={{ fontFamily: "var(--font-fraunces)", color: CORAL }}
          >
            ailevelup.ca
          </span>

          {/* Center */}
          <div className="flex items-center gap-6">
            {[
              { label: "Services", href: "#services" },
              { label: "Agents", href: "#agents" },
              { label: "Results", href: "#results" },
              { label: "How It Works", href: "#how" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs transition-colors hover:text-[#F5F0E8]"
                style={{ color: TEXT_MUTED, fontFamily: "var(--font-dm-sans)" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right */}
          <p className="text-xs" style={{ color: TEXT_MUTED, fontFamily: "var(--font-dm-sans)" }}>
            © 2026 · AI automation for businesses that move fast
          </p>
        </div>
      </footer>

    </main>
  );
}
