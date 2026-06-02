import { notFound } from "next/navigation";
import { sites } from "@/lib/data";

function Block({ block }) {
  if (block.type === "hero")
    return (
      <section className="bg-gradient-to-b from-brand-50 to-white px-6 py-24 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">{block.heading}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">{block.subheading}</p>
        {block.cta && <span className="btn-primary mt-8 px-6 py-3 text-base">{block.cta}</span>}
      </section>
    );
  if (block.type === "features")
    return (
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900">{block.heading}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {(block.items || []).map((it, i) => (
            <div key={i} className="card p-6 text-center text-slate-700">{it}</div>
          ))}
        </div>
      </section>
    );
  if (block.type === "cta")
    return (
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl bg-brand-600 px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold">{block.heading}</h2>
          <p className="mt-2 text-brand-100">{block.subheading}</p>
          {block.cta && <span className="btn mt-6 bg-white px-6 py-3 text-base text-brand-700">{block.cta}</span>}
        </div>
      </section>
    );
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h2 className="text-2xl font-bold text-slate-900">{block.heading}</h2>
      <p className="mt-3 text-slate-600">{block.body}</p>
    </section>
  );
}

export default function PublishedSite({ params }) {
  const site = sites.getBySlug(params.slug);
  if (!site || !site.published) notFound();
  const blocks = JSON.parse(site.blocks_json || "[]");

  return (
    <div className="min-h-screen bg-white">
      {blocks.map((b, i) => <Block key={i} block={b} />)}
      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400">
        Built with Workaway
      </footer>
    </div>
  );
}
