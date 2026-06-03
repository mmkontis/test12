"use client";

import { useEffect, useState } from "react";

const STATUS = ["lead", "active", "churned"];
const empty = { name: "", email: "", phone: "", company: "", status: "lead", value: 0, notes: "" };

function money(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
}

function StatusBadge({ status }) {
  const map = {
    lead: "bg-amber-100 text-amber-700",
    active: "bg-emerald-100 text-emerald-700",
    churned: "bg-slate-200 text-slate-500",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[status]}`}>{status}</span>;
}

export default function ContactsPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/contacts");
    const data = await res.json();
    setList(data.contacts || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault();
    const url = editingId ? `/api/contacts/${editingId}` : "/api/contacts";
    const method = editingId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm(empty);
    setEditingId(null);
    load();
  }

  function edit(c) {
    setEditingId(c.id);
    setForm({ name: c.name, email: c.email || "", phone: c.phone || "", company: c.company || "", status: c.status, value: c.value, notes: c.notes || "" });
  }

  async function remove(id) {
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
        <p className="mt-1 text-slate-500">Your CRM pipeline — leads, customers and deal value.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* List */}
        <div className="card overflow-hidden lg:col-span-2">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Value</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Loading…</td></tr>}
              {!loading && list.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No contacts yet.</td></tr>}
              {list.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.company} · {c.email}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-700">{money(c.value)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => edit(c)} className="text-xs text-brand-600 hover:underline">Edit</button>
                    <button onClick={() => remove(c.id)} className="ml-3 text-xs text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form */}
        <form onSubmit={save} className="card h-fit space-y-3 p-5">
          <h2 className="font-semibold text-slate-900">{editingId ? "Edit contact" : "Add contact"}</h2>
          <div>
            <label className="label">Name *</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Email</label>
              <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Company</label>
            <input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Value ($)</label>
              <input className="input" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button className="btn-primary flex-1">{editingId ? "Save" : "Add"}</button>
            {editingId && (
              <button type="button" className="btn-ghost" onClick={() => { setEditingId(null); setForm(empty); }}>Cancel</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
