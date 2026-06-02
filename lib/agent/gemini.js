// Minimal Google Gemini adapter (REST, no SDK dependency).
// Supports system instructions + function calling, which the pi agent
// framework uses to let agents act on Workaway's data.

const BASE = "https://generativelanguage.googleapis.com/v1beta";

export function geminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

function model() {
  return process.env.GEMINI_MODEL || "gemini-2.5-flash";
}

/**
 * Call Gemini's generateContent.
 * @param {object} opts
 * @param {Array} opts.contents      Conversation turns.
 * @param {string} [opts.system]     System instruction.
 * @param {Array}  [opts.tools]      Function declarations.
 * @returns {Promise<object>} The first candidate's content (parts array).
 */
export async function generate({ contents, system, tools }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");

  const body = { contents };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  if (tools && tools.length) body.tools = [{ functionDeclarations: tools }];

  const res = await fetch(`${BASE}/models/${model()}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gemini error ${res.status}: ${text.slice(0, 300)}`);
  }

  const json = await res.json();
  const candidate = json.candidates?.[0];
  if (!candidate) throw new Error("Gemini returned no candidates");
  return candidate.content; // { role, parts: [...] }
}
