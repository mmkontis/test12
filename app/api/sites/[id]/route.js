import { NextResponse } from "next/server";
import { requireSession } from "../../_guard";
import { sites } from "@/lib/data";

export async function PUT(req, { params }) {
  const s = requireSession();
  if (s instanceof NextResponse) return s;
  const body = await req.json().catch(() => ({}));
  sites.save(Number(params.id), {
    title: body.title,
    blocks: body.blocks,
    published: body.published,
  });
  return NextResponse.json({ ok: true });
}
