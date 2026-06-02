import { NextResponse } from "next/server";
import { requireSession } from "../../_guard";
import { transactions } from "@/lib/data";

export async function DELETE(_req, { params }) {
  const s = requireSession();
  if (s instanceof NextResponse) return s;
  transactions.remove(Number(params.id));
  return NextResponse.json({ ok: true });
}
