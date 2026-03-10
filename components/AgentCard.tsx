"use client";

import { useEffect, useRef, useState } from "react";
import { Agent } from "@/lib/agents";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  agent: Agent;
}

const AGENT_CONFIG: Record<string, { capabilities: string[]; prompts: string[]; chips: string[] }> = {
  ally: {
    capabilities: ["Customer Q&A", "WhatsApp", "Telegram", "24/7", "Multi-language"],
    prompts: [
      "We get tons of the same questions on WhatsApp",
      "It's just me handling everything right now",
      "Customers message us after hours and get no reply",
    ],
    chips: ["24/7", "Instant", "No code"],
  },
  sterling: {
    capabilities: ["Daily Reconciliation", "Margin Analysis", "Cost Leakage", "Cash Flow", "Supplier Audit"],
    prompts: [
      "I never know my real margins until month-end",
      "Supplier invoices don't always match what we ordered",
      "Cash flow surprises keep catching me off guard",
    ],
    chips: ["Daily", "Accurate", "No code"],
  },
  nova: {
    capabilities: ["Lead Qualification", "Auto Follow-ups", "CRM Updates", "Pipeline Tracking", "Lead Scoring"],
    prompts: [
      "Leads come in but nobody follows up fast enough",
      "I don't know which leads are actually serious",
      "We lose deals because we forget to follow up",
    ],
    chips: ["Auto", "Smart", "No code"],
  },
  pulse: {
    capabilities: ["Ops Monitoring", "Daily Briefings", "Task Tracking", "Anomaly Alerts", "Auto Reports"],
    prompts: [
      "Checking inventory and staff schedules every morning",
      "I spend hours making status update spreadsheets",
      "Things fall through the cracks when I'm not looking",
    ],
    chips: ["Reliable", "Daily", "No code"],
  },
  atlas: {
    capabilities: ["Trend Research", "Draft Posts", "Competitor Watch", "Content Calendar", "Brand Voice"],
    prompts: [
      "Instagram and TikTok — we post once a month if we're lucky",
      "I never know what to post about",
      "Our competitors post daily and we can't keep up",
    ],
    chips: ["Smart", "Full-stack", "No code"],
  },
  forge: {
    capabilities: ["Automation Builds", "Tool Integrations", "Python & JS", "Web Maintenance", "AI Agent Deploy"],
    prompts: [
      "Sending invoices and updating spreadsheets every week",
      "Copying data between our POS and accounting software",
      "Manually updating product listings across 3 platforms",
    ],
    chips: ["Fast", "Scalable", "Custom"],
  },
  barney: {
    capabilities: ["Screen Applicants", "Onboarding Packs", "Training Docs", "Job Postings", "Interview Prep"],
    prompts: [
      "We get 50 resumes and no time to read them all",
      "Every new hire gets a different onboarding experience",
      "Writing job postings takes me half a day",
    ],
    chips: ["Fast", "Consistent", "No code"],
  },
};

const PLACEHOLDERS: Record<string, string[]> = {
  ally:     ["Tell Ally about your support setup...", "What questions do customers ask most?", "Which channels do you use?"],
  sterling: ["Tell Sterling about your finances...", "What's your biggest cost headache?", "How do you track margins?"],
  nova:     ["Tell Nova about your sales process...", "How do leads come in?", "What happens after a lead comes in?"],
  pulse:    ["Tell Pulse about your daily ops...", "What takes the most time each morning?", "What falls through the cracks?"],
  atlas:    ["Tell Atlas about your content...", "What platforms are you on?", "How often do you post?"],
  forge:    ["Tell Forge what to automate...", "What's the most repetitive task?", "What tools need connecting?"],
  barney:   ["Tell Barney about your hiring...", "How do you onboard new hires?", "What's your biggest HR pain?"],
};

function AgentAvatar({ agent, accentColor }: { agent: Agent; accentColor: string }) {
  return (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0"
      style={{
        background: `${accentColor}18`,
        border: `1.5px solid ${accentColor}55`,
      }}
    >
      {agent.icon}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2"
      style={{ background: "#F3F4F6" }}
    >
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  );
}

export default function AgentCard({ agent }: Props) {
  const config = AGENT_CONFIG[agent.id] ?? AGENT_CONFIG.ally;
  const rotatingPlaceholders = PLACEHOLDERS[agent.id] ?? PLACEHOLDERS.ally;
  const accentColor = agent.color;

  const openingMessages: Message[] = [{ role: "assistant", content: agent.openingMessage }];

  const [messages, setMessages] = useState<Message[]>(openingMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const autoDemoFiredRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((idx) => (idx + 1) % rotatingPlaceholders.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [rotatingPlaceholders.length]);

  // Auto-demo: fire first prompt when card enters viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !autoDemoFiredRef.current) {
            autoDemoFiredRef.current = true;
            const firstPrompt = config.prompts[0];
            setTimeout(() => {
              void sendMessage(firstPrompt);
            }, 1500);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id, messages: newMessages }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      let started = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          if (!started) {
            updated.push({ role: "assistant", content: reply });
            started = true;
            return updated;
          }
          updated[updated.length - 1] = { role: "assistant", content: reply };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function submitFromInput() {
    void sendMessage(input);
  }

  function sendPrompt(prompt: string) {
    setInput(prompt);
    void sendMessage(prompt);
  }

  function resetChat() {
    setMessages(openingMessages);
    setInput("");
  }

  const isLastMessageAssistant =
    messages.length > 0 && messages[messages.length - 1].role === "assistant";

  return (
    <div
      ref={cardRef}
      className="console-card group rounded-2xl transition-all duration-200 hover:-translate-y-1"
      style={{ height: 620 }}
    >
      <div className="console-inner h-full flex flex-col rounded-2xl">
        {/* Header */}
        <div className="p-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
          <div className="flex items-start justify-between gap-3">
            <AgentAvatar agent={agent} accentColor={accentColor} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-lg leading-tight" style={{ color: "#111827" }}>{agent.name}</h3>
                <span
                  className="px-2 py-0.5 text-[11px] rounded-full font-semibold"
                  style={{ background: `${accentColor}15`, color: accentColor }}
                >
                  {agent.role}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold" style={{ color: "#10B981" }}>LIVE</span>
              </div>
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>{agent.tagline}</p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <button
                onClick={resetChat}
                className="text-xs transition-colors px-2 py-0.5 rounded"
                style={{
                  color: "#9CA3AF",
                  border: "1px solid #E5E7EB",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#374151"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF"; }}
              >
                Reset
              </button>
              {config.chips.map((chip) => (
                <span
                  key={chip}
                  className="px-2 py-0.5 text-[10px] rounded-full font-semibold"
                  style={{
                    color: accentColor,
                    border: `1px solid ${accentColor}44`,
                    background: `${accentColor}0f`,
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="px-4 pt-3 pb-2 overflow-hidden" style={{ borderBottom: "1px solid #F3F4F6" }}>
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-700">
            {config.capabilities.map((item) => (
              <span
                key={item}
                className="text-[11px] px-3 py-1 rounded-full"
                style={{
                  color: "#374151",
                  border: "1px solid #E5E7EB",
                  background: "#F9FAFB",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700"
          style={{ background: "#FAFAFA" }}
        >
          {messages.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`message-enter flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <span
                  className="mr-2 mt-1 text-xs w-6 h-6 rounded-full inline-flex items-center justify-center flex-shrink-0"
                  style={{ background: `${accentColor}15` }}
                >
                  {agent.icon}
                </span>
              )}
              <div
                className="max-w-[78%] px-3 py-2 rounded-xl text-sm leading-relaxed"
                style={
                  m.role === "user"
                    ? {
                        background: accentColor,
                        color: "#FFFFFF",
                        borderBottomRightRadius: "4px",
                      }
                    : {
                        background: "#FFFFFF",
                        color: "#374151",
                        border: "1px solid #E5E7EB",
                        borderBottomLeftRadius: "4px",
                      }
                }
              >
                {m.content}
                {loading && isLastMessageAssistant && i === messages.length - 1 && m.role === "assistant" && (
                  <span className="streaming-cursor" />
                )}
              </div>
            </div>
          ))}

          {/* Quick-reply chips — only when only opening message exists */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {config.prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendPrompt(prompt)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-40"
                  style={{
                    color: accentColor,
                    border: `1px solid ${accentColor}55`,
                    background: `${accentColor}0a`,
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="message-enter flex justify-start">
              <span
                className="mr-2 mt-1 text-xs w-6 h-6 rounded-full inline-flex items-center justify-center flex-shrink-0"
                style={{ background: `${accentColor}15` }}
              >
                {agent.icon}
              </span>
              <TypingIndicator />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3" style={{ borderTop: "1px solid #E5E7EB" }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitFromInput()}
              placeholder={rotatingPlaceholders[placeholderIndex]}
              disabled={loading}
              className="flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none disabled:opacity-60 transition-shadow"
              style={{
                background: "#F9FAFB",
                border: `1.5px solid #E5E7EB`,
                color: "#111827",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = `${accentColor}88`; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
            />
            <button
              onClick={submitFromInput}
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40 transition-opacity text-white"
              style={{ background: accentColor }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
