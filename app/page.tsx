import AgentCard from "@/components/AgentCard";
import { AGENTS } from "@/lib/agents";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050810] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            ailevelup
          </span>
          <span className="text-gray-500 text-sm font-light">.ca</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#agents" className="text-sm text-gray-400 hover:text-white transition-colors">Agents</a>
          <a href="#how" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</a>
          <a
            href="mailto:hello@ailevelup.ca"
            className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-600 hover:bg-purple-500 transition-colors"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          AI Agents for Caribbean Businesses
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6">
          Chat with your new{" "}
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            24/7 team
          </span>{" "}
          now
        </h1>

        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-4">
          Meet your AI operations team — always on, never tired, built for your business.
          Try them live below. No signup needed.
        </p>

        <p className="text-gray-500 text-sm mb-12">
          These are real AI agents. Ask them anything about your business.
        </p>

        {/* Scroll hint */}
        <div className="flex justify-center gap-1 mb-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: i === 0 ? "#00d4ff" : i === 1 ? "#a855f7" : "#f59e0b",
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      </section>

      {/* Agent Cards */}
      <section id="agents" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="border-t border-white/5 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 mb-12 max-w-xl mx-auto">
            We train agents on your business — your products, policies, suppliers, and data.
            They go live in days, not months.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "We learn your business",
                desc: "A 1-hour discovery call. We map your operations, pain points, and data sources.",
                color: "#00d4ff",
              },
              {
                step: "02",
                title: "We build your agents",
                desc: "Custom AI agents trained on your products, policies, and systems. Tested before launch.",
                color: "#a855f7",
              },
              {
                step: "03",
                title: "They run automatically",
                desc: "Deployed to your channels (Telegram, WhatsApp, web). Monitored 24/7. Improved weekly.",
                color: "#f59e0b",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl p-6 border border-white/5 bg-[#0d1424]"
              >
                <div
                  className="text-3xl font-black mb-4"
                  style={{ color: item.color }}
                >
                  {item.step}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="rounded-3xl p-12 border border-purple-500/20"
            style={{ background: "linear-gradient(135deg, #1a0a3e 0%, #0a1030 100%)" }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to build your team?</h2>
            <p className="text-gray-400 mb-8">
              Start with one agent. Scale to a full AI operations stack.
              Most clients are live within 2 weeks.
            </p>
            <a
              href="mailto:hello@ailevelup.ca?subject=Let's build my AI team"
              className="inline-block px-8 py-4 rounded-full text-base font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all text-white"
            >
              Book a free discovery call →
            </a>
            <p className="mt-4 text-xs text-gray-500">
              No commitment. We'll tell you honestly if AI is the right fit.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-gray-500 text-sm">
        <p>
          © 2026{" "}
          <span className="text-gray-400 font-semibold">ailevelup.ca</span> · Built in Barbados 🇧🇧
        </p>
      </footer>
    </main>
  );
}
