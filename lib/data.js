import { db } from "./db";

// Thin query helpers shared by API routes and AI agent tools.

// --- Contacts ----------------------------------------------------------------
export const contacts = {
  list: () => db().prepare("SELECT * FROM contacts ORDER BY created_at DESC").all(),
  get: (id) => db().prepare("SELECT * FROM contacts WHERE id = ?").get(id),
  create: (c) =>
    db()
      .prepare(
        "INSERT INTO contacts (name, email, phone, company, status, value, notes) VALUES (@name, @email, @phone, @company, @status, @value, @notes)"
      )
      .run({
        name: c.name,
        email: c.email ?? null,
        phone: c.phone ?? null,
        company: c.company ?? null,
        status: c.status ?? "lead",
        value: Number(c.value) || 0,
        notes: c.notes ?? null,
      }),
  update: (id, c) =>
    db()
      .prepare(
        "UPDATE contacts SET name=@name, email=@email, phone=@phone, company=@company, status=@status, value=@value, notes=@notes WHERE id=@id"
      )
      .run({
        id,
        name: c.name,
        email: c.email ?? null,
        phone: c.phone ?? null,
        company: c.company ?? null,
        status: c.status ?? "lead",
        value: Number(c.value) || 0,
        notes: c.notes ?? null,
      }),
  remove: (id) => db().prepare("DELETE FROM contacts WHERE id = ?").run(id),
};

// --- Transactions (Economics) ------------------------------------------------
export const transactions = {
  list: () => db().prepare("SELECT * FROM transactions ORDER BY occurred_at DESC, id DESC").all(),
  create: (t) =>
    db()
      .prepare(
        "INSERT INTO transactions (kind, label, amount, category, status, occurred_at) VALUES (@kind, @label, @amount, @category, @status, @occurred_at)"
      )
      .run({
        kind: t.kind === "expense" ? "expense" : "income",
        label: t.label,
        amount: Number(t.amount) || 0,
        category: t.category ?? null,
        status: t.status ?? "paid",
        occurred_at: t.occurred_at || new Date().toISOString().slice(0, 10),
      }),
  remove: (id) => db().prepare("DELETE FROM transactions WHERE id = ?").run(id),
  summary: () => {
    const rows = db().prepare("SELECT kind, status, SUM(amount) AS total FROM transactions GROUP BY kind, status").all();
    let income = 0, expense = 0, pending = 0, overdue = 0;
    for (const r of rows) {
      if (r.kind === "income") income += r.total;
      else expense += r.total;
      if (r.status === "pending") pending += r.total;
      if (r.status === "overdue") overdue += r.total;
    }
    return { income, expense, profit: income - expense, pending, overdue };
  },
};

// --- Tasks -------------------------------------------------------------------
export const tasks = {
  list: () => db().prepare("SELECT * FROM tasks ORDER BY (status='done'), created_at DESC").all(),
  create: (t) =>
    db()
      .prepare("INSERT INTO tasks (title, status, priority, due_at) VALUES (@title, @status, @priority, @due_at)")
      .run({ title: t.title, status: t.status ?? "todo", priority: t.priority ?? "medium", due_at: t.due_at ?? null }),
  setStatus: (id, status) => db().prepare("UPDATE tasks SET status=? WHERE id=?").run(status, id),
  remove: (id) => db().prepare("DELETE FROM tasks WHERE id = ?").run(id),
};

// --- Sites (Website builder) -------------------------------------------------
export const sites = {
  list: () => db().prepare("SELECT * FROM sites ORDER BY updated_at DESC").all(),
  getBySlug: (slug) => db().prepare("SELECT * FROM sites WHERE slug = ?").get(slug),
  get: (id) => db().prepare("SELECT * FROM sites WHERE id = ?").get(id),
  save: (id, { title, blocks, published }) =>
    db()
      .prepare("UPDATE sites SET title=@title, blocks_json=@blocks, published=@published, updated_at=datetime('now') WHERE id=@id")
      .run({ id, title, blocks: JSON.stringify(blocks ?? []), published: published ? 1 : 0 }),
};

// --- Agent runs --------------------------------------------------------------
export const agentRuns = {
  log: (agent, prompt, response, toolsUsed) =>
    db()
      .prepare("INSERT INTO agent_runs (agent, prompt, response, tools_used) VALUES (?, ?, ?, ?)")
      .run(agent, prompt, response, JSON.stringify(toolsUsed ?? [])),
  recent: (limit = 10) => db().prepare("SELECT * FROM agent_runs ORDER BY id DESC LIMIT ?").all(limit),
};

// --- Dashboard snapshot ------------------------------------------------------
export function dashboardSnapshot() {
  const fin = transactions.summary();
  const allContacts = contacts.list();
  const openTasks = db().prepare("SELECT COUNT(*) AS n FROM tasks WHERE status != 'done'").get().n;
  return {
    finance: fin,
    contacts: {
      total: allContacts.length,
      leads: allContacts.filter((c) => c.status === "lead").length,
      active: allContacts.filter((c) => c.status === "active").length,
      pipeline: allContacts.filter((c) => c.status === "lead").reduce((s, c) => s + c.value, 0),
    },
    tasks: { open: openTasks },
    sites: sites.list().length,
  };
}
