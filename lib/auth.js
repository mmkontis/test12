import crypto from "node:crypto";
import { cookies } from "next/headers";
import { db, verifyPassword } from "./db";

const COOKIE = "workaway_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return process.env.AUTH_SECRET || "dev-insecure-secret";
}

// Stateless signed-cookie sessions: base64(payload).hmac
function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const mac = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${mac}`;
}

function unsign(token) {
  if (!token || !token.includes(".")) return null;
  const [body, mac] = token.split(".");
  const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function authenticate(email, password) {
  const user = db().prepare("SELECT * FROM users WHERE email = ?").get(String(email).toLowerCase().trim());
  if (!user) return null;
  if (!verifyPassword(password, user.password_hash)) return null;
  return { id: user.id, email: user.email, name: user.name, company: user.company };
}

export function createSession(user) {
  const token = sign({ ...user, exp: Date.now() + MAX_AGE * 1000 });
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function destroySession() {
  cookies().set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export function getSession() {
  const token = cookies().get(COOKIE)?.value;
  return unsign(token);
}
