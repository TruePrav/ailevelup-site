"use client";

import { useState, useRef, useEffect } from "react";
import { Agent } from "@/lib/agents";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  agent: Agent;
}

// Robot-human avatar — replace src with real images when available
// Prompt for Midjourney: "professional AI assistant robot with human features, business casual, dark background, portrait, cinematic lighting"
function AgentAvatar({ agent }: { agent: Agent }) {
  return (
    <div
      className="relative mx-auto mb-4"
      style={{ width: 100, height: 100 }}
    >
      {/* Glow ring */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-40"
        style={{ background: agent.color }}
      />
      {/* Avatar circle — swap this div for an <img> with your robot photo */}
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center text-4xl border-2"
        style={{
          background: `radial-gradient(circle at 40% 35%, ${agent.gradientFrom}, #050810)`,
          borderColor: agent.color,
        }}
      >
        {agent.icon}
      </div>
      {/* Online indicator */}
      <span
        className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#050810] bg-green-400"
      />
    </div>
  );
}

export default function AgentCard({ agent }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: agent.openingMessage },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
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

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: reply };
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex flex-col rounded-2xl border overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0d1424 0%, #080b14 100%)",
        borderColor: `${agent.color}33`,
        boxShadow: `0 0 40px ${agent.color}15`,
        height: 520,
      }}
    >
      {/* Header */}
      <div className="p-5 pb-3 text-center border-b" style={{ borderColor: `${agent.color}22` }}>
        <AgentAvatar agent={agent} />
        <h3 className="text-white font-bold text-lg leading-tight">{agent.name}</h3>
        <span
          className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-medium"
          style={{ background: `${agent.color}22`, color: agent.color }}
        >
          {agent.role}
        </span>
        <p className="mt-2 text-xs text-gray-400 leading-relaxed">{agent.tagline}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "text-white rounded-br-sm"
                  : "text-gray-200 rounded-bl-sm"
              }`}
              style={
                m.role === "user"
                  ? { background: agent.color, color: "#000" }
                  : { background: "#151c2e" }
              }
            >
              {m.content || (
                <span className="opacity-50 animate-pulse">Thinking…</span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t" style={{ borderColor: `${agent.color}22` }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Reply…"
            disabled={loading}
            className="flex-1 bg-[#0f1525] border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 disabled:opacity-50"
            style={{ borderColor: `${agent.color}44`, ["--tw-ring-color" as string]: agent.color }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40 transition-opacity"
            style={{ background: agent.color, color: "#000" }}
          >
            {loading ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
