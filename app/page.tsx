import AgentCard from "@/components/AgentCard";
import { AGENTS } from "@/lib/agents";

// ─── Data ────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    emoji: "🤖",
    title: "Customer Support Agents",
    desc: "Handle 100+ daily questions across WhatsApp, Telegram, and web. Never miss a message, never pay overtime.",
  },
  {
    emoji: "📊",
    title: "Operations Automation",
    desc: "Reconciliation, inventory tracking, supplier checks — done automatically, every single day.",
  },
  {
    emoji: "📈",
    title: "Content & Growth",
    desc: "AI agents that research trends, write drafts, and track performance. Post consistently without the grind.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Discovery Call",
    desc: "We map your biggest time sinks in a focused 30-minute session.",
  },
  {
    num: "02",
    title: "Build & Train",
    desc: "Custom agents trained on your data, workflows, and business logic. No generic chatbots.",
  },
  {
    num: "03",
    title: "Launch & Improve",
    desc: "Deployed and refined weekly. You stay in control — AI does the work.",
  },
];

const RESULTS = [
  {
    stat: "40%+",
    label: "Ops Automated",
    context: "Gaming retailer · 2 locations · Barbados · live since 2025",
    desc: "Daily reconciliation, supplier checks, inventory alerts — running without human input.",
  },
  {
    stat: "0",
    label: "Missed Messages",
    context: "24/7 across WhatsApp, Telegram, and web",
    desc: "AI handles every inbound question. Human team steps in only for complex issues.",
  },
  {
    stat: "7 days",
    label: "First Agent Live",
    context: "from discovery call to production",
    desc: "Discovery call Monday. Agents running the following week. No IT team required.",
  },
];

const WHO_CARDS = [
  { emoji: "🛒", title: "Retailers", desc: "Answer customer questions overnight. Reconcile sales automatically. Never run out of stock silently." },
  { emoji: "🍽️", title: "Restaurants", desc: "Automate reservations, menu FAQs, and order status. Zero calls for basic info." },
  { emoji: "📦", title: "eCommerce", desc: "Instant support, daily sales reconciliation, and inventory alerts — fully automated." },
  { emoji: "🎯", title: "Service Businesses", desc: "Qualify leads, answer FAQs, book appointments 24/7. Wake up to confirmed clients." },
];

const TICKER_ITEMS = [
  "Live in 7 Days",
  "40%+ Ops Automated",
  "Real AI — Not a Chatbot",
  "24/7 Customer Coverage",
  "No IT Team Needed",
  "Zero Missed Messages",
  "Built for Small Business",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const tickerText = [...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
    <span key={i} className="flex items-center gap-6 px-3">
      <span className="text-sm font-semibold text-gray-700">{t}</span>
      <span style={{ color: "#C5F135", fontSize: 18 }}>✦</span>
    </span>
  ));

  return (
    <main className="min-h-screen" style={{ background: "#FAFAFA" }}>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav style={{ borderBottom: "1.5px solid #E5E7EB", background: "#FFFFFF" }} className="px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-xl font-black tracking-tight" style={{ color: "#0D0D0D" }}>
            ailevelup<span style={{ color: "#C5F135" }}>.</span>ca
          </span>
          <div className="hidden md:flex items-center gap-8">
            {["#services", "#agents", "#how", "#results"].map((href, i) => (
              <a key={i} href={href} className="text-sm font-medium transition-colors hover:text-black" style={{ color: "#6B7280" }}>
                {["Services", "Agents", "How It Works", "Results"][i]}
              </a>
            ))}
          </div>
          <a
            href="mailto:hello@ailevelup.ca?subject=Free Strategy Call"
            className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90"
            style={{ background: "#C5F135", color: "#0D0D0D" }}
          >
            Book a Free Call
          </a>
        </div>
      </nav>

      {/* ── TICKER ───────────────────────────────────────────────────────── */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E7EB", overflow: "hidden" }} className="py-3">
        <div className="marquee-track">{tickerText}</div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: "#F0F9E0", color: "#3A6B00", border: "1px solid #C5F135" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C5F135", display: "inline-block" }} />
            AI Operations — Live in Production
          </div>

          <h1 className="hero-headline mb-6" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}>
            Your team is doing work<br />
            <span className="hero-lime">AI should handle.</span>
          </h1>

          <p className="text-xl leading-relaxed mb-10 max-w-2xl" style={{ color: "#4B5563" }}>
            We build custom AI agents that handle reconciliation, customer support, and content — so your team stops wasting hours on tasks a machine can do better.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            <span className="stat-pill">⚡ Live in 7 days</span>
            <span className="stat-pill">🤖 24/7 coverage</span>
            <span className="stat-pill">✅ No IT team</span>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:hello@ailevelup.ca?subject=Free Strategy Call"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:opacity-90"
              style={{ background: "#C5F135", color: "#0D0D0D" }}
            >
              Book a Free Strategy Call →
            </a>
            <a
              href="#agents"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold border-2 transition-all hover:border-gray-400"
              style={{ borderColor: "#E5E7EB", color: "#374151", background: "#FFFFFF" }}
            >
              See Agents Live
            </a>
          </div>
        </div>
      </section>

      {/* ── DARK STATS BAND ──────────────────────────────────────────────── */}
      <section className="stats-band py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { num: "40%+", label: "Ops Automated", sub: "live in production" },
            { num: "7 days", label: "First Agent Live", sub: "from call to deploy" },
            { num: "24/7", label: "Uptime", sub: "no days off" },
            { num: "0", label: "Missed Messages", sub: "across all channels" },
          ].map((s) => (
            <div key={s.num} className="text-center">
              <div className="font-black mb-1" style={{ fontSize: "clamp(2rem,4vw,3rem)", color: "#C5F135", letterSpacing: "-0.03em" }}>
                {s.num}
              </div>
              <div className="font-bold text-white text-base">{s.label}</div>
              <div className="text-xs mt-1" style={{ color: "#6B7280" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO WE HELP ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#9CA3AF" }}>Who We Help</p>
          <h2 className="text-3xl font-black tracking-tight" style={{ color: "#0D0D0D" }}>Built for businesses like yours.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHO_CARDS.map((c) => (
            <div key={c.title} className="who-card">
              <div className="text-3xl mb-4">{c.emoji}</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#0D0D0D" }}>{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section id="services" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#9CA3AF" }}>What We Build</p>
          <h2 className="text-3xl font-black tracking-tight" style={{ color: "#0D0D0D" }}>Three ways AI saves your team hours.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <div key={s.title} className="service-card">
              <div className="text-3xl mb-5">{s.emoji}</div>
              <h3 className="font-bold text-xl mb-3" style={{ color: "#0D0D0D" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AGENT DEMO ───────────────────────────────────────────────────── */}
      <section id="agents" className="py-20 px-6" style={{ background: "#F4F9E8" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#3A6B00" }}>Live Demo</p>
            <h2 className="text-3xl font-black tracking-tight mb-4" style={{ color: "#0D0D0D" }}>Meet your AI team.</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "#4B5563" }}>
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

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how" className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#9CA3AF" }}>The Process</p>
          <h2 className="text-3xl font-black tracking-tight" style={{ color: "#0D0D0D" }}>Simple to start. Powerful fast.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.num} className="relative">
              <div className="font-black mb-4" style={{ fontSize: "5rem", color: "#E5E7EB", lineHeight: 1, letterSpacing: "-0.05em" }}>
                {step.num}
              </div>
              <h3 className="font-bold text-xl mb-2" style={{ color: "#0D0D0D" }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RESULTS ──────────────────────────────────────────────────────── */}
      <section id="results" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#9CA3AF" }}>Proof</p>
          <h2 className="text-3xl font-black tracking-tight" style={{ color: "#0D0D0D" }}>Real results. Real businesses.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RESULTS.map((r) => (
            <div key={r.label} className="result-card">
              <div className="font-black mb-1" style={{ fontSize: "clamp(2.4rem,4vw,3.2rem)", color: "#0D0D0D", letterSpacing: "-0.04em" }}>
                {r.stat}
              </div>
              <div className="font-bold text-lg mb-1" style={{ color: "#0D0D0D" }}>{r.label}</div>
              <div className="text-xs font-semibold mb-4 px-2 py-1 rounded-full inline-block" style={{ background: "#F0F9E0", color: "#3A6B00" }}>
                {r.context}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="cta-section text-center">
          <h2 className="font-black text-4xl mb-4 tracking-tight" style={{ color: "#0D0D0D" }}>
            Ready to stop doing everything manually?
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "#1A1A1A" }}>
            30-minute call. We map your biggest time sinks, tell you exactly what AI can fix, and give you a clear plan.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href="mailto:hello@ailevelup.ca?subject=Free Strategy Call"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all"
              style={{ background: "#0D0D0D", color: "#FFFFFF" }}
            >
              📧 Email Us
            </a>
            <a
              href="https://wa.me/12463334444?text=Hi%2C%20I%27d%20like%20to%20learn%20more%20about%20ailevelup"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all"
              style={{ background: "#25D366", color: "#FFFFFF" }}
            >
              💬 WhatsApp Us
            </a>
          </div>
          <p className="text-sm" style={{ color: "#374151" }}>
            No commitment required · We&apos;ll tell you honestly if AI is the right fit
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="px-6 py-8" style={{ borderTop: "1px solid #E5E7EB" }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="font-black text-lg" style={{ color: "#0D0D0D" }}>
            ailevelup<span style={{ color: "#C5F135" }}>.</span>ca
          </span>
          <div className="flex items-center gap-6 text-sm" style={{ color: "#9CA3AF" }}>
            <a href="mailto:hello@ailevelup.ca" className="hover:text-gray-600 transition-colors">hello@ailevelup.ca</a>
            <a href="https://wa.me/12463334444" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">WhatsApp</a>
          </div>
          <span className="text-xs" style={{ color: "#D1D5DB" }}>© 2026 ailevelup.ca</span>
        </div>
      </footer>

    </main>
  );
}
