import Link from "next/link";

const features = [
  { icon: "🌐", title: "Website builder", desc: "Spin up a landing page in minutes with editable blocks — no code, publish instantly." },
  { icon: "👥", title: "Contacts (CRM)", desc: "Track leads, customers and deal value in one tidy pipeline." },
  { icon: "💰", title: "Economics", desc: "See income, expenses and profit at a glance. Catch overdue invoices early." },
  { icon: "✅", title: "Tasks", desc: "Keep the team aligned with a lightweight shared to-do board." },
  { icon: "🤖", title: "AI agents", desc: "Sales, finance and ops copilots that read your data and take action." },
  { icon: "📊", title: "Live widgets", desc: "A dashboard that surfaces what needs attention right now." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">W</span>
          Workaway
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#features" className="hidden text-slate-600 hover:text-slate-900 sm:block">Features</a>
          <Link href="/login" className="btn-ghost">Log in</Link>
          <Link href="/login" className="btn-primary">Get started</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 to-white" />
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700">
            Built for small enterprises
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Run your whole business <span className="text-brand-600">from one place.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Workaway combines a website builder, CRM, finances, tasks and AI agents into a single dashboard —
            so small teams can do the work of a big one.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/login" className="btn-primary px-6 py-3 text-base">Start free</Link>
            <a href="#features" className="btn-ghost px-6 py-3 text-base">See what's inside</a>
          </div>
          <p className="mt-4 text-xs text-slate-400">Demo login: demo@workaway.io / workaway</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-slate-900">Everything a small business needs</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
          One login. One dashboard. No more juggling six different tools.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-2xl bg-brand-600 px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold">Your business, with an AI team behind it.</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Let the agents handle the busywork while you focus on customers.
          </p>
          <Link href="/login" className="btn mt-8 bg-white px-6 py-3 text-base text-brand-700 hover:bg-brand-50">
            Open the dashboard
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Workaway. A demo platform for small enterprises.
      </footer>
    </div>
  );
}
