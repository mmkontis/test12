"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@workaway.io");
  const [password, setPassword] = useState("workaway");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="hidden flex-col justify-between bg-brand-600 p-12 text-white lg:flex">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/20">W</span>
          Workaway
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-snug">
            Welcome back.<br />Your business is waiting.
          </h2>
          <p className="mt-4 max-w-sm text-brand-100">
            Website, contacts, finances, tasks and AI agents — all behind this one login.
          </p>
        </div>
        <p className="text-sm text-brand-200">© {new Date().getFullYear()} Workaway</p>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2 text-lg font-bold lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">W</span>
            Workaway
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Log in</h1>
          <p className="mt-1 text-sm text-slate-500">Use the demo account to explore.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <button className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? "Signing in…" : "Log in"}
            </button>
          </form>

          <p className="mt-6 rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-xs text-slate-500">
            Demo: <b>demo@workaway.io</b> / <b>workaway</b>
          </p>
        </div>
      </div>
    </div>
  );
}
