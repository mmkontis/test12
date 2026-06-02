import { listAgents, isConfigured } from "@/lib/agent/pi";
import AgentChat from "@/components/AgentChat";

export default function AgentsPage() {
  const agents = listAgents();
  const configured = isConfigured();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI agents</h1>
          <p className="mt-1 text-slate-500">Your copilots — they read your real data and can take action.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${configured ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
          {configured ? "● Gemini connected" : "○ Gemini not configured"}
        </span>
      </div>

      {!configured && (
        <div className="card border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Add <code className="rounded bg-white px-1">GEMINI_API_KEY</code> to <code className="rounded bg-white px-1">.env.local</code> and restart to enable live responses. The UI and tools still work in stub mode.
        </div>
      )}

      <AgentChat agents={agents} />
    </div>
  );
}
