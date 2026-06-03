import { NextResponse } from "next/server";
import { authenticate, createSession } from "@/lib/auth";

export async function POST(req) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  const user = authenticate(email, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
  createSession(user);
  return NextResponse.json({ ok: true, user });
}
