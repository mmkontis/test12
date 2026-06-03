import { NextResponse } from "next/server";
import { requireSession } from "../_guard";
import { tasks } from "@/lib/data";

export async function GET() {
  const s = requireSession();
  if (s instanceof NextResponse) return s;
  return NextResponse.json({ tasks: tasks.list() });
}

export async function POST(req) {
  const s = requireSession();
  if (s instanceof NextResponse) return s;
  const body = await req.json().catch(() => ({}));
  if (!body.title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  const info = tasks.create(body);
  return NextResponse.json({ ok: true, id: info.lastInsertRowid }, { status: 201 });
}
