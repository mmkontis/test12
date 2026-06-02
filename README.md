# Workaway

**An AI-powered operating system for small businesses.** Workaway brings a
landing page, a website builder, a CRM, finances, tasks, and a team of AI
agents together behind a single login.

Built with **Next.js (App Router)**, **SQLite** (via `better-sqlite3` — the
smallest possible SQL setup, no server to run), **Tailwind CSS**, and a tiny
agent framework ("pi") wired to **Google Gemini**.

## Features

| Area | What it does |
|------|--------------|
| 🌐 Landing page | Public marketing page at `/` |
| 🔐 Login | Simple email + password auth (signed-cookie sessions) |
| 📊 Dashboard | Live widgets: profit, pipeline, overdue, tasks |
| 🛠️ Website builder | Edit landing-page blocks and publish to `/site/<slug>` |
| 👥 Contacts (CRM) | Full create/edit/delete of leads & customers |
| 💰 Economics | Track income/expenses, see profit & overdue |
| ✅ Tasks | Lightweight shared kanban board |
| 🤖 AI agents | Ops, Sales & Finance copilots that read your data and act via tools |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in GEMINI_API_KEY
npm run dev
```

Open http://localhost:3000.

**Demo login:** `demo@workaway.io` / `workaway`

## Environment variables

Set these in `.env.local` (never commit it):

- `GEMINI_API_KEY` — Google Gemini key from https://aistudio.google.com/app/apikey
- `GEMINI_MODEL` — defaults to `gemini-2.0-flash`
- `AUTH_SECRET` — random string used to sign session cookies

Without `GEMINI_API_KEY` the app still runs; the AI agents degrade gracefully
and tell you they need a key.

## Project structure

```
app/
  page.js               Landing page
  login/                Login page
  dashboard/            Authenticated app (overview, builder, contacts,
                        economics, tasks, agents)
  site/[slug]/          Published websites from the builder
  api/                  Route handlers (auth, contacts, transactions,
                        tasks, sites, agents)
lib/
  db.js                 SQLite connection, schema, seed, password hashing
  data.js               Query helpers shared by API + agent tools
  auth.js               Signed-cookie sessions
  agent/                "pi" agent framework + Gemini adapter + tools
components/             Sidebar, SiteEditor, AgentChat
```

The SQLite database is created automatically at `data/workaway.sqlite` on
first run and seeded with demo data. It is gitignored.

## The "pi" agent framework

`lib/agent/pi.js` defines agents as a system prompt + a set of tools, and runs
a tool-calling loop on top of the Gemini adapter (`lib/agent/gemini.js`).
Tools (`lib/agent/tools.js`) act on the real database — so an agent can read
your finances, summarise your pipeline, or create a contact/task for you.
