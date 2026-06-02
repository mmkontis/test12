import Link from "next/link";
import { getSession } from "@/lib/auth";
import { dashboardSnapshot, transactions, tasks, contacts } from "@/lib/data";

function money(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
}

function Stat({ label, value, sub, tone = "slate" }) {
  const tones = {
    slate: "text-slate-900",
    green: "text-emerald-600",
    red: "text-red-600",
    brand: "text-brand-600",
  };
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${tones[tone]}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

export default function DashboardOverview() {
  const session = getSession();
  const snap = dashboardSnapshot();
  const recentTx = transactions.list().slice(0, 5);
  const openTasks = tasks.list().filter((t) => t.status !== "done").slice(0, 5);
  const hotLeads = contacts.list().filter((c) => c.status === "lead").sort((a, b) => b.value - a.value).slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {session?.name?.split(" ")[0]} 👋</h1>
        <p className="mt-1 text-slate-500">Here's how {session?.company || "your business"} is doing today.</p>
      </div>

      {/* Widgets */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Profit (MTD)" value={money(snap.finance.profit)} sub={`${money(snap.finance.income)} in · ${money(snap.finance.expense)} out`} tone={snap.finance.profit >= 0 ? "green" : "red"} />
        <Stat label="Pipeline" value={money(snap.contacts.pipeline)} sub={`${snap.contacts.leads} open leads`} tone="brand" />
        <Stat label="Overdue" value={money(snap.finance.overdue)} sub="needs chasing" tone={snap.finance.overdue > 0 ? "red" : "slate"} />
        <Stat label="Open tasks" value={snap.tasks.open} sub={`${snap.sites} live site(s)`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent transactions */}
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent transactions</h2>
            <Link href="/dashboard/economics" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {recentTx.map((t) => (
              <li key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{t.label}</p>
                  <p className="text-xs text-slate-400">{t.category} · {t.occurred_at}</p>
                </div>
                <span className={`text-sm font-semibold ${t.kind === "income" ? "text-emerald-600" : "text-red-600"}`}>
                  {t.kind === "income" ? "+" : "-"}{money(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hot leads */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Hot leads</h2>
            <Link href="/dashboard/contacts" className="text-sm text-brand-600 hover:underline">CRM</Link>
          </div>
          <ul className="space-y-3">
            {hotLeads.length === 0 && <li className="text-sm text-slate-400">No open leads.</li>}
            {hotLeads.map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{c.name}</p>
                  <p className="truncate text-xs text-slate-400">{c.company}</p>
                </div>
                <span className="text-sm font-semibold text-brand-600">{money(c.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tasks + AI nudge */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">To do</h2>
            <Link href="/dashboard/tasks" className="text-sm text-brand-600 hover:underline">Board</Link>
          </div>
          <ul className="space-y-2">
            {openTasks.map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2">
                <span className={`h-2 w-2 rounded-full ${t.priority === "high" ? "bg-red-500" : t.priority === "medium" ? "bg-amber-400" : "bg-slate-300"}`} />
                <span className="flex-1 text-sm text-slate-700">{t.title}</span>
                <span className="text-xs text-slate-400">{t.due_at || ""}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link href="/dashboard/agents" className="card flex flex-col justify-between bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white transition hover:from-brand-700">
          <div className="text-3xl">🤖</div>
          <div>
            <h2 className="mt-4 text-lg font-semibold">Ask your AI team</h2>
            <p className="mt-1 text-sm text-brand-100">
              "Summarise my overdue invoices" · "Who should I follow up with?"
            </p>
            <span className="mt-4 inline-block text-sm font-medium underline">Open agents →</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
