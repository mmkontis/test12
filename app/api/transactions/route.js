import { NextResponse } from "next/server";
import { requireSession } from "../_guard";
import { transactions } from "@/lib/data";

export async function GET() {
  const s = requireSession();
  if (s instanceof NextResponse) return s;
  return NextResponse.json({ transactions: transactions.list(), summary: transactions.summary() });
}

export async function POST(req) {
  const s = requireSession();
  if (s instanceof NextResponse) return s;
  const body = await req.json().catch(() => ({}));
  if (!body.label || body.amount == null) {
    return NextResponse.json({ error: "Label and amount are required." }, { status: 400 });
  }
  const info = transactions.create(body);
  return NextResponse.json({ ok: true, id: info.lastInsertRowid }, { status: 201 });
}
