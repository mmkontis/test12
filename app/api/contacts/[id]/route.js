import { NextResponse } from "next/server";
import { requireSession } from "../../_guard";
import { contacts } from "@/lib/data";

export async function PUT(req, { params }) {
  const s = requireSession();
  if (s instanceof NextResponse) return s;
  const body = await req.json().catch(() => ({}));
  if (!body.name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  contacts.update(Number(params.id), body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req, { params }) {
  const s = requireSession();
  if (s instanceof NextResponse) return s;
  contacts.remove(Number(params.id));
  return NextResponse.json({ ok: true });
}
