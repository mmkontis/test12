"use client";

import { useEffect, useState } from "react";

const empty = { kind: "income", label: "", amount: "", category: "", status: "paid", occurred_at: "" };

function money(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
}

function StatusBadge({ status }) {
  const map = {
    paid: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    overdue: "bg-red-100 text-red-700",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[status] || "bg-slate-100"}`}>{status}</span>;
}

export default function EconomicsPage() {
  const [list, setList] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, profit: 0, pending: 0, overdue: 0 });
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setList(data.transactions || []);
    setSummary(data.summary || {});
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    await fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm(empty);
    load();
  }

  async function remove(id) {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Economics</h1>
        <p className="mt-1 text-slate-500">Income, expenses and what's outstanding.</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="card p-5"><p className="text-xs uppercase text-slate-400">Income</p><p className="mt-2 text-xl font-bold text-emerald-600">{money(summary.income)}</p></div>
        <div className="card p-5"><p className="text-xs uppercase text-slate-400">Expenses</p><p className="mt-2 text-xl font-bold text-red-600">{money(summary.expense)}</p></div>
        <div className="card p-5"><p className="text-xs uppercase text-slate-400">Profit</p><p className={`mt-2 text-xl font-bold ${summary.profit >= 0 ? "text-slate-900" : "text-red-600"}`}>{money(summary.profit)}</p></div>
        <div className="card p-5"><p className="text-xs uppercase text-slate-400">Pending / Overdue</p><p className="mt-2 text-xl font-bold text-amber-600">{money(summary.pending)} <span className="text-sm text-red-500">/ {money(summary.overdue)}</span></p></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* List */}
        <div className="card overflow-hidden lg:col-span-2">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Loading…</td></tr>}
              {list.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{t.label}</p>
                    <p className="text-xs text-slate-400">{t.category} · {t.occurred_at}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className={`px-4 py-3 text-right font-semibold ${t.kind === "income" ? "text-emerald-600" : "text-red-600"}`}>
                    {t.kind === "income" ? "+" : "-"}{money(t.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(t.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form */}
        <form onSubmit={add} className="card h-fit space-y-3 p-5">
          <h2 className="font-semibold text-slate-900">Add transaction</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Label *</label>
            <input className="input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Amount ($) *</label>
              <input className="input" type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div>
              <label className="label">Category</label>
              <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Date</label>
            <input className="input" type="date" value={form.occurred_at} onChange={(e) => setForm({ ...form, occurred_at: e.target.value })} />
          </div>
          <button className="btn-primary w-full">Add transaction</button>
        </form>
      </div>
    </div>
  );
}
