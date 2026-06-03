import { NextResponse } from "next/server";
import { requireSession } from "../../_guard";
import { tasks } from "@/lib/data";

export async function PATCH(req, { params }) {
  const s = requireSession();
  if (s instanceof NextResponse) return s;
  const body = await req.json().catch(() => ({}));
  if (body.status) tasks.setStatus(Number(params.id), body.status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req, { params }) {
  const s = requireSession();
  if (s instanceof NextResponse) return s;
  tasks.remove(Number(params.id));
  return NextResponse.json({ ok: true });
}
