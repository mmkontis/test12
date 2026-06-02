"use client";

import { useState, useRef, useEffect } from "react";

const SUGGESTIONS = {
  ops: ["Give me a business overview", "What needs my attention today?", "Create a task to review May expenses"],
  sales: ["Summarise my pipeline by value", "Who should I follow up with first?", "Add a lead: Jane Doe at Pixel Co, $5000"],
  finance: ["What's overdue right now?", "Explain my profit this month", "List my biggest expenses"],
};

export default function AgentChat({ agents }) {
  const [activeId, setActiveId] = useState(agents[0]?.id || "ops");
  const [messages, setMessages] = useState([]); // {role, text, tools}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const active = agents.find((a) => a.id === activeId) || agents[0];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  function switchAgent(id) {
    setActiveId(id);
    setMessages([]);
  }

  async function send(text) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: activeId, message: msg, history }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.text || data.error || "(no response)", tools: data.toolsUsed || [] }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Network error — please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Agent picker */}
      <div className="space-y-3 lg:col-span-1">
        {agents.map((a) => (
          <button
            key={a.id}
            onClick={() => switchAgent(a.id)}
            className={`card w-full p-4 text-left transition ${activeId === a.id ? "ring-2 ring-brand-500" : "hover:bg-slate-50"}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{a.emoji}</span>
              <span className="font-semibold text-slate-900">{a.name}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">{a.blurb}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {a.tools.slice(0, 3).map((t) => (
                <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">{t}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="card flex h-[34rem] flex-col lg:col-span-3">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
          <span className="text-xl">{active?.emoji}</span>
          <span className="font-semibold text-slate-800">{active?.name}</span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
              <span className="text-4xl">{active?.emoji}</span>
              <p className="mt-3 max-w-xs text-sm">{active?.blurb}</p>
              <div className="mt-5 flex flex-col gap-2">
                {(SUGGESTIONS[activeId] || []).map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                <p className="whitespace-pre-wrap">{m.text}</p>
                {m.tools && m.tools.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.tools.map((t, j) => (
                      <span key={j} className="rounded bg-white/70 px-1.5 py-0.5 text-[10px] text-slate-500">🔧 {t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-400">{active?.name} is thinking…</div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 border-t border-slate-100 p-3">
          <input
            className="input"
            placeholder={`Message ${active?.name}…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button className="btn-primary" disabled={loading || !input.trim()}>Send</button>
        </form>
      </div>
    </div>
  );
}
