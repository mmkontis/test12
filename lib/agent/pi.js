// "pi" — a tiny agent framework. An agent is a system prompt plus a set of
// tools; running it drives a tool-calling loop on top of the Gemini adapter.
import { generate, geminiConfigured } from "./gemini";
import { TOOLS, declarationsFor, runTool } from "./tools";
import { agentRuns } from "../data";

// --- Agent registry ----------------------------------------------------------
export const AGENTS = {
  ops: {
    id: "ops",
    name: "Ops Copilot",
    emoji: "🧭",
    blurb: "Your all-round business assistant. Knows your finances, contacts and tasks.",
    tools: ["get_business_overview", "finance_summary", "list_contacts", "list_transactions", "list_tasks", "create_task"],
    system:
      "You are Ops Copilot, the operations assistant inside Workaway, a platform for small businesses. " +
      "Be concise and practical. Use tools to look up real data before answering. " +
      "When the user asks you to do something actionable (like creating a task), use the appropriate tool. " +
      "Format answers with short paragraphs or bullet points.",
  },
  sales: {
    id: "sales",
    name: "Sales Agent",
    emoji: "📈",
    blurb: "Works your pipeline: summarises leads, drafts follow-ups, adds contacts.",
    tools: ["list_contacts", "create_contact", "create_task", "get_business_overview"],
    system:
      "You are the Sales Agent inside Workaway. You help a small business owner manage their CRM pipeline. " +
      "Prioritise leads by value, suggest concrete next steps, and draft short, friendly outreach when asked. " +
      "Use tools to read the pipeline and to create contacts or follow-up tasks.",
  },
  finance: {
    id: "finance",
    name: "Finance Agent",
    emoji: "💰",
    blurb: "Watches cash flow, flags overdue items, explains the numbers.",
    tools: ["finance_summary", "list_transactions", "create_task", "get_business_overview"],
    system:
      "You are the Finance Agent inside Workaway. You help a non-accountant business owner understand their money. " +
      "Always ground numbers in tool data. Call out overdue and pending amounts. Explain plainly, no jargon. " +
      "Use dollar amounts and be specific.",
  },
};

export function listAgents() {
  return Object.values(AGENTS).map(({ id, name, emoji, blurb, tools }) => ({ id, name, emoji, blurb, tools }));
}

export function isConfigured() {
  return geminiConfigured();
}

const MAX_STEPS = 5;

/**
 * Run an agent against a user message.
 * @returns {Promise<{text: string, toolsUsed: string[], configured: boolean}>}
 */
export async function runAgent(agentId, message, history = []) {
  const agent = AGENTS[agentId] || AGENTS.ops;

  if (!geminiConfigured()) {
    const text =
      `⚠️ Gemini is not configured, so I can't reach the model. ` +
      `Add GEMINI_API_KEY to your .env.local to enable ${agent.name}. ` +
      `Once configured I can use these tools: ${agent.tools.join(", ")}.`;
    return { text, toolsUsed: [], configured: false };
  }

  const tools = declarationsFor(agent.tools);
  const contents = [
    ...history.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] })),
    { role: "user", parts: [{ text: message }] },
  ];

  const toolsUsed = [];

  for (let step = 0; step < MAX_STEPS; step++) {
    const content = await generate({ contents, system: agent.system, tools });
    const parts = content.parts || [];
    contents.push({ role: "model", parts });

    const calls = parts.filter((p) => p.functionCall).map((p) => p.functionCall);
    if (calls.length === 0) {
      const text = parts.map((p) => p.text).filter(Boolean).join("\n").trim() || "(no response)";
      agentRuns.log(agent.id, message, text, toolsUsed);
      return { text, toolsUsed, configured: true };
    }

    // Execute tool calls and feed results back to the model.
    const responseParts = [];
    for (const call of calls) {
      toolsUsed.push(call.name);
      const result = await runTool(call.name, call.args);
      responseParts.push({ functionResponse: { name: call.name, response: { result } } });
    }
    contents.push({ role: "user", parts: responseParts });
  }

  const text = "I wasn't able to finish that within the step limit. Try narrowing the request.";
  agentRuns.log(agent.id, message, text, toolsUsed);
  return { text, toolsUsed, configured: true };
}
