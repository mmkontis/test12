import { NextResponse } from "next/server";
import { requireSession } from "../_guard";
import { contacts } from "@/lib/data";

export async function GET() {
  const s = requireSession();
  if (s instanceof NextResponse) return s;
  return NextResponse.json({ contacts: contacts.list() });
}

export async function POST(req) {
  const s = requireSession();
  if (s instanceof NextResponse) return s;
  const body = await req.json().catch(() => ({}));
  if (!body.name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  const info = contacts.create(body);
  return NextResponse.json({ ok: true, id: info.lastInsertRowid }, { status: 201 });
}
