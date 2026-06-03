import { NextResponse } from "next/server";
import { requireSession } from "../_guard";
import { runAgent } from "@/lib/agent/pi";

export async function POST(req) {
  const s = requireSession();
  if (s instanceof NextResponse) return s;

  const { agent, message, history } = await req.json().catch(() => ({}));
  if (!message) return NextResponse.json({ error: "Message is required." }, { status: 400 });

  try {
    const result = await runAgent(agent || "ops", message, Array.isArray(history) ? history : []);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err.message || err), configured: true }, { status: 500 });
  }
}
