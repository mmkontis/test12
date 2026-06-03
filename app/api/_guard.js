import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// Returns a session or a 401 NextResponse. Usage:
//   const s = requireSession(); if (s instanceof NextResponse) return s;
export function requireSession() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return session;
}
