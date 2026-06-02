"use client";

import { useEffect, useState } from "react";

const COLUMNS = [
  { key: "todo", label: "To do" },
  { key: "doing", label: "In progress" },
  { key: "done", label: "Done" },
];
const NEXT = { todo: "doing", doing: "done", done: "todo" };

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [due, setDue] = useState("");

  async function load() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data.tasks || []);
  }
  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, priority, due_at: due || null }) });
    setTitle(""); setDue(""); setPriority("medium");
    load();
  }

  async function advance(t) {
    await fetch(`/api/tasks/${t.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: NEXT[t.status] }) });
    load();
  }

  async function remove(id) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
        <p className="mt-1 text-slate-500">A shared board to keep the team moving.</p>
      </div>

      <form onSubmit={add} className="card flex flex-wrap items-end gap-3 p-4">
        <div className="flex-1 min-w-[200px]">
          <label className="label">New task</label>
          <input className="input" placeholder="What needs doing?" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="label">Priority</label>
          <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="label">Due</label>
          <input className="input" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </div>
        <button className="btn-primary">Add</button>
      </form>

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="card p-4">
              <h2 className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-700">
                {col.label}
                <span className="rounded-full bg-slate-100 px-2 text-xs text-slate-500">{items.length}</span>
              </h2>
              <ul className="space-y-2">
                {items.map((t) => (
                  <li key={t.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${t.priority === "high" ? "bg-red-500" : t.priority === "medium" ? "bg-amber-400" : "bg-slate-300"}`} />
                      <span className={`flex-1 text-sm ${t.status === "done" ? "text-slate-400 line-through" : "text-slate-700"}`}>{t.title}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{t.due_at || ""}</span>
                      <div className="flex gap-2">
                        <button onClick={() => advance(t)} className="text-brand-600 hover:underline">{t.status === "done" ? "Reopen" : "Advance"}</button>
                        <button onClick={() => remove(t.id)} className="text-red-500 hover:underline">Delete</button>
                      </div>
                    </div>
                  </li>
                ))}
                {items.length === 0 && <li className="py-4 text-center text-xs text-slate-300">Nothing here</li>}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
