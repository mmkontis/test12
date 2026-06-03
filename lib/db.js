import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

// --- Database location -------------------------------------------------------
// Locally we keep the DB in ./data. On read-only serverless filesystems
// (e.g. Vercel) only /tmp is writable, so fall back there. Override with
// the DATA_DIR env var if you have persistent storage mounted somewhere.
const DATA_DIR =
  process.env.DATA_DIR ||
  (process.env.VERCEL ? path.join(os.tmpdir(), "workaway-data") : path.join(process.cwd(), "data"));
const DB_PATH = path.join(DATA_DIR, "workaway.sqlite");

// Reuse a single connection across Next.js hot reloads / route invocations.
const globalForDb = globalThis;

function createConnection() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const conn = new Database(DB_PATH);
  conn.pragma("journal_mode = WAL");
  conn.pragma("foreign_keys = ON");
  migrate(conn);
  seed(conn);
  return conn;
}

/** @returns {import('better-sqlite3').Database} */
export function db() {
  if (!globalForDb.__workawayDb) {
    globalForDb.__workawayDb = createConnection();
  }
  return globalForDb.__workawayDb;
}

// --- Schema ------------------------------------------------------------------
function migrate(conn) {
  conn.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT NOT NULL UNIQUE,
      name          TEXT NOT NULL,
      company       TEXT,
      password_hash TEXT NOT NULL,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT,
      phone      TEXT,
      company    TEXT,
      status     TEXT NOT NULL DEFAULT 'lead',   -- lead | active | churned
      value      REAL NOT NULL DEFAULT 0,         -- estimated deal value
      notes      TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      kind       TEXT NOT NULL,                   -- income | expense
      label      TEXT NOT NULL,
      amount     REAL NOT NULL,
      category   TEXT,
      status     TEXT NOT NULL DEFAULT 'paid',    -- paid | pending | overdue
      occurred_at TEXT NOT NULL DEFAULT (date('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sites (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      slug        TEXT NOT NULL UNIQUE,
      title       TEXT NOT NULL,
      published    INTEGER NOT NULL DEFAULT 0,
      blocks_json TEXT NOT NULL DEFAULT '[]',
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      status      TEXT NOT NULL DEFAULT 'todo',   -- todo | doing | done
      priority    TEXT NOT NULL DEFAULT 'medium', -- low | medium | high
      due_at      TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS agent_runs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      agent       TEXT NOT NULL,
      prompt      TEXT NOT NULL,
      response    TEXT,
      tools_used  TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

// --- Password hashing (built-in crypto, no extra deps) -----------------------
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, derived] = stored.split(":");
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(check, "hex");
  const b = Buffer.from(derived, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// --- Seed demo data ----------------------------------------------------------
function seed(conn) {
  const userCount = conn.prepare("SELECT COUNT(*) AS n FROM users").get().n;
  if (userCount === 0) {
    conn.prepare(
      "INSERT INTO users (email, name, company, password_hash) VALUES (?, ?, ?, ?)"
    ).run("demo@workaway.io", "Demo Owner", "Acme Studio", hashPassword("workaway"));
  }

  const contactCount = conn.prepare("SELECT COUNT(*) AS n FROM contacts").get().n;
  if (contactCount === 0) {
    const insert = conn.prepare(
      "INSERT INTO contacts (name, email, phone, company, status, value, notes) VALUES (@name, @email, @phone, @company, @status, @value, @notes)"
    );
    const rows = [
      { name: "Maria Gomez", email: "maria@brightlabs.io", phone: "+1 555 0101", company: "Bright Labs", status: "active", value: 12000, notes: "Renewal due in Q3." },
      { name: "Tom Becker", email: "tom@northwind.co", phone: "+1 555 0102", company: "Northwind", status: "lead", value: 4500, notes: "Asked for a demo." },
      { name: "Aisha Khan", email: "aisha@flux.design", phone: "+1 555 0103", company: "Flux Design", status: "active", value: 8800, notes: "Upsell candidate." },
      { name: "Liam O'Brien", email: "liam@harbor.io", phone: "+1 555 0104", company: "Harbor", status: "churned", value: 0, notes: "Left for a competitor." },
      { name: "Sara Lind", email: "sara@meadow.app", phone: "+1 555 0105", company: "Meadow", status: "lead", value: 6200, notes: "Inbound from website." },
    ];
    const tx = conn.transaction((items) => items.forEach((r) => insert.run(r)));
    tx(rows);
  }

  const txCount = conn.prepare("SELECT COUNT(*) AS n FROM transactions").get().n;
  if (txCount === 0) {
    const insert = conn.prepare(
      "INSERT INTO transactions (kind, label, amount, category, status, occurred_at) VALUES (@kind, @label, @amount, @category, @status, @occurred_at)"
    );
    const rows = [
      { kind: "income", label: "Bright Labs — retainer", amount: 4000, category: "Services", status: "paid", occurred_at: "2026-05-03" },
      { kind: "income", label: "Flux Design — project", amount: 8800, category: "Projects", status: "paid", occurred_at: "2026-05-12" },
      { kind: "income", label: "Meadow — deposit", amount: 3100, category: "Projects", status: "pending", occurred_at: "2026-05-28" },
      { kind: "expense", label: "Cloud hosting", amount: 320, category: "Infrastructure", status: "paid", occurred_at: "2026-05-01" },
      { kind: "expense", label: "Design tools", amount: 180, category: "Software", status: "paid", occurred_at: "2026-05-04" },
      { kind: "expense", label: "Contractor — copywriting", amount: 1200, category: "Contractors", status: "overdue", occurred_at: "2026-05-20" },
    ];
    const tx = conn.transaction((items) => items.forEach((r) => insert.run(r)));
    tx(rows);
  }

  const taskCount = conn.prepare("SELECT COUNT(*) AS n FROM tasks").get().n;
  if (taskCount === 0) {
    const insert = conn.prepare(
      "INSERT INTO tasks (title, status, priority, due_at) VALUES (@title, @status, @priority, @due_at)"
    );
    const rows = [
      { title: "Send Q3 renewal to Bright Labs", status: "todo", priority: "high", due_at: "2026-06-10" },
      { title: "Follow up with Tom Becker", status: "doing", priority: "medium", due_at: "2026-06-05" },
      { title: "Publish new landing page", status: "todo", priority: "high", due_at: "2026-06-08" },
      { title: "Reconcile May expenses", status: "done", priority: "low", due_at: "2026-06-01" },
    ];
    const tx = conn.transaction((items) => items.forEach((r) => insert.run(r)));
    tx(rows);
  }

  const siteCount = conn.prepare("SELECT COUNT(*) AS n FROM sites").get().n;
  if (siteCount === 0) {
    const blocks = JSON.stringify([
      { type: "hero", heading: "Acme Studio", subheading: "We design brands that move.", cta: "Work with us" },
      { type: "features", heading: "What we do", items: ["Brand strategy", "Web design", "Content"] },
      { type: "cta", heading: "Ready to start?", subheading: "Book a free intro call.", cta: "Get in touch" },
    ]);
    conn.prepare(
      "INSERT INTO sites (slug, title, published, blocks_json) VALUES (?, ?, ?, ?)"
    ).run("acme-studio", "Acme Studio", 1, blocks);
  }
}
