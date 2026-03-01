import AgentCard from "@/components/AgentCard";
import { AGENTS } from "@/lib/agents";

// ─── Data ───────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    emoji: "🤖",
    title: "Customer Support Agents",
    desc: "Handle 100+ daily questions across WhatsApp, Telegram, and web. Never miss a message.",
    accent: "#4F46E5",
  },
  {
    emoji: "📊",
    title: "Operations Automation",
    desc: "Reconciliation, reporting, inventory tracking. Done automatically. Every day.",
    accent: "#7C3AED",
  },
  {
    emoji: "📈",
    title: "Content & Growth",
    desc: "AI agents that research trends, draft content, and track performance across platforms.",
    accent: "#0EA5E9",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Discovery Call",
    desc: "Map your ops, pain points, and data sources in a focused 60-minute session.",
    color: "#4F46E5",
  },
  {
    num: "02",
    title: "Build & Train",
    desc: "Custom agents trained on your workflows, products, and business data.",
    color: "#7C3AED",
  },
  {
    num: "03",
    title: "Launch & Monitor",
    desc: "Deployed and improved weekly. You stay in control, AI does the work.",
    color: "#0EA5E9",
  },
];

const RESULTS = [
  {
    stat: "40%+ Ops Automated",
    context: "retail business, 2 locations, live in production",
    desc: "Daily reconciliation, supplier checks, inventory alerts — all running without human input.",
    accent: "#4F46E5",
  },
  {
    stat: "Zero Missed Messages",
    context: "24/7 support across channels",
    desc: "AI handles every customer question on WhatsApp, Telegram, and web — even at 3am.",
    accent: "#7C3AED",
  },
  {
    stat: "Week 1 to Live",
    context: "from discovery call to deployed agents",
    desc: "No IT team needed. Most clients have agents running within the first week.",
    accent: "#0EA5E9",
  },
];

const WHO_CARDS = [
  {
    emoji: "🛒",
    title: "Retailers",
    desc: "Handle 100+ daily questions without extra staff. Your AI answers overnight.",
    border: "#4F46E5",
  },
  {
    emoji: "🍽️",
    title: "Restaurants",
    desc: "Automate reservations, menu FAQs, and order tracking. Zero calls for basic info.",
    border: "#7C3AED",
  },
  {
    emoji: "📦",
    title: "eCommerce",
    desc: "Instant support and daily sales reconciliation — fully automated, no manual work.",
    border: "#0EA5E9",
  },
  {
    emoji: "🎯",
    title: "Service Businesses",
    desc: "Qualify leads, answer FAQs, and book appointments 24/7. Wake up to booked clients.",
    border: "#10B981",
  },
];

// ─── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="relative min-h-screen" style={{ background: "#FFFFFF", color: "#111827" }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ borderBottom: "1px solid #E5E7EB", background: "#FFFFFF" }} className="px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span
              className="text-xl font-black tracking-tight"
              style={{
                background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ailevelup
            </span>
            <span className="text-sm font-light" style={{ color: "#9CA3AF" }}>.ca</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#services" className="text-sm transition-colors hidden sm:block" style={{ color: "#6B7280" }}>Services</a>
            <a href="#how" className="text-sm transition-colors hidden sm:block" style={{ color: "#6B7280" }}>How It Works</a>
            <a href="#results" className="text-sm transition-colors hidden sm:block" style={{ color: "#6B7280" }}>Results</a>
            <a
              href="mailto:hello@ailevelup.ca"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 text-white"
              style={{ background: "#4F46E5" }}
            >
              Book a Free Call
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center relative">
        <div className="relative max-w-5xl mx-auto">
          <div className="hero-soft-glow" />
          <h1
            className="font-black leading-tight tracking-tight mb-6"
            style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)", color: "#111827" }}
          >
            Your Business Runs on Manual Work.
            <br />
            <span className="hero-gradient-text">It Doesn&apos;t Have To.</span>
          </h1>
        </div>

        <p className="text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "#6B7280" }}>
          Most businesses still run on manual work. We build custom AI systems that handle the
          repetitive stuff — so your team can focus on what actually grows the business.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <a
            href="mailto:hello@ailevelup.ca?subject=Book a Free Call"
            className="inline-block px-8 py-4 rounded-lg text-base font-semibold transition-opacity hover:opacity-90 text-white"
            style={{ background: "#4F46E5" }}
          >
            Book a Free Call
          </a>
          <a
            href="#how"
            className="inline-block px-8 py-4 rounded-lg text-base font-semibold border transition-all"
            style={{
              borderColor: "#E5E7EB",
              color: "#374151",
              background: "#FFFFFF",
            }}
          >
            See How It Works
          </a>
        </div>

        {/* Stats bar */}
        <div
          className="inline-flex flex-wrap justify-center items-center rounded-xl overflow-hidden stats-bar"
          style={{ border: "1px solid #E5E7EB" }}
        >
          {[
            "50+ Hours Saved Monthly",
            "40%+ Ops Automated",
            "24/7 Customer Coverage",
            "Live in Under a Week",
          ].map((stat) => (
            <div
              key={stat}
              className="px-5 py-3 text-sm font-medium"
              style={{ background: "#FAFAFA", color: "#374151" }}
            >
              {stat}
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT WE BUILD (SERVICES) ─────────────────────────────────────── */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3" style={{ color: "#111827" }}>What We Build</h2>
          <p className="max-w-xl mx-auto" style={{ color: "#6B7280" }}>
            Every agent is custom-trained on your business — not a generic chatbot.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="rounded-xl p-7 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderTop: `3px solid ${s.accent}`,
              }}
            >
              <div className="text-3xl mb-4">{s.emoji}</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#111827" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AGENT DEMO CARDS ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#111827" }}>Meet Your AI Team</h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: "#6B7280" }}>
            These are real agents. Ask them anything about your business.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how" className="py-20 px-6" style={{ borderTop: "1px solid #F3F4F6", background: "#FAFAFA" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#111827" }}>How It Works</h2>
            <p className="max-w-xl mx-auto" style={{ color: "#6B7280" }}>
              From first call to live agents — usually under a week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line desktop */}
            <div
              className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px"
              style={{ background: "linear-gradient(90deg, #4F46E5, #7C3AED, #0EA5E9)" }}
            />

            {STEPS.map((step) => (
              <div
                key={step.num}
                className="rounded-xl p-8 text-left relative"
                style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-black text-base mb-6"
                  style={{
                    background: `${step.color}12`,
                    color: step.color,
                    border: `1.5px solid ${step.color}44`,
                  }}
                >
                  {step.num}
                </div>
                <h3 className="font-bold text-xl mb-3" style={{ color: "#111827" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS ───────────────────────────────────────────────────────── */}
      <section id="results" className="py-20 px-6" style={{ borderTop: "1px solid #F3F4F6" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#111827" }}>Real Automation. Real Results.</h2>
            <p className="max-w-xl mx-auto" style={{ color: "#6B7280" }}>
              Deployed for growing businesses just like yours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESULTS.map((r) => (
              <div
                key={r.stat}
                className="rounded-xl p-8 transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderLeft: `3px solid ${r.accent}`,
                }}
              >
                <p
                  className="text-2xl font-black mb-1"
                  style={{ color: r.accent }}
                >
                  {r.stat}
                </p>
                <p className="text-xs mb-4 uppercase tracking-wider font-medium" style={{ color: "#9CA3AF" }}>
                  {r.context}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE HELP ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ borderTop: "1px solid #F3F4F6", background: "#FAFAFA" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#111827" }}>Who We Help</h2>
            <p className="max-w-lg mx-auto" style={{ color: "#6B7280" }}>
              Built for small business owners and operators who are tired of doing everything manually.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHO_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-xl p-6 transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderLeft: `3px solid ${card.border}`,
                }}
              >
                <div className="text-3xl mb-3">{card.emoji}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "#111827" }}>{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ borderTop: "1px solid #F3F4F6" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="rounded-2xl p-12"
            style={{
              background: "#F5F3FF",
              border: "1px solid #DDD6FE",
            }}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: "#111827" }}>
              Ready to stop doing everything manually?
            </h2>
            <p className="mb-8 leading-relaxed" style={{ color: "#6B7280" }}>
              Get your custom AI agent network — built, trained, and deployed in days.
              No IT team required. No long-term contract.
            </p>
            <a
              href="mailto:hello@ailevelup.ca?subject=Book a Free Strategy Call"
              className="inline-block px-8 py-4 rounded-lg text-base font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "#4F46E5" }}
            >
              Book a Free Strategy Call
            </a>
            <p className="mt-6 text-xs" style={{ color: "#9CA3AF" }}>
              No commitment required. We&apos;ll tell you honestly if AI is the right fit.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer
        className="py-8 px-6 text-center text-sm"
        style={{ borderTop: "1px solid #E5E7EB", color: "#9CA3AF" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-4 mb-3">
            <span className="font-semibold" style={{ color: "#374151" }}>ailevelup.ca</span>
            <span style={{ color: "#D1D5DB" }}>·</span>
            <a
              href="mailto:hello@ailevelup.ca"
              className="transition-colors hover:text-gray-600"
            >
              hello@ailevelup.ca
            </a>
          </div>
          <p className="text-xs" style={{ color: "#D1D5DB" }}>
            © 2026 ailevelup.ca
          </p>
        </div>
      </footer>

    </main>
  );
}
