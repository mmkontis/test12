"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/builder", label: "Website builder", icon: "🌐" },
  { href: "/dashboard/contacts", label: "Contacts", icon: "👥" },
  { href: "/dashboard/economics", label: "Economics", icon: "💰" },
  { href: "/dashboard/tasks", label: "Tasks", icon: "✅" },
  { href: "/dashboard/agents", label: "AI agents", icon: "🤖" },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-5 py-5 text-lg font-bold">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">W</span>
        Workaway
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
            {(user?.name || "U").slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">{user?.name}</p>
            <p className="truncate text-xs text-slate-400">{user?.company}</p>
          </div>
        </div>
        <button onClick={logout} className="btn-ghost mt-2 w-full text-sm">Log out</button>
      </div>
    </aside>
  );
}
