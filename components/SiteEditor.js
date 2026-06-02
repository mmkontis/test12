"use client";

import { useState } from "react";

const BLOCK_TEMPLATES = {
  hero: { type: "hero", heading: "Headline", subheading: "A short supporting line.", cta: "Get started" },
  features: { type: "features", heading: "Features", items: ["First thing", "Second thing", "Third thing"] },
  cta: { type: "cta", heading: "Call to action", subheading: "Encourage a click.", cta: "Contact us" },
  text: { type: "text", heading: "Section title", body: "Write something here." },
};

function BlockPreview({ block }) {
  if (block.type === "hero")
    return (
      <div className="rounded-xl bg-gradient-to-b from-brand-50 to-white p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900">{block.heading}</h2>
        <p className="mt-2 text-slate-600">{block.subheading}</p>
        <span className="btn-primary mt-4">{block.cta}</span>
      </div>
    );
  if (block.type === "features")
    return (
      <div className="rounded-xl border border-slate-100 p-8">
        <h2 className="text-center text-xl font-bold text-slate-900">{block.heading}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(block.items || []).map((it, i) => (
            <div key={i} className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-700">{it}</div>
          ))}
        </div>
      </div>
    );
  if (block.type === "cta")
    return (
      <div className="rounded-xl bg-brand-600 p-8 text-center text-white">
        <h2 className="text-xl font-bold">{block.heading}</h2>
        <p className="mt-1 text-brand-100">{block.subheading}</p>
        <span className="btn mt-4 bg-white text-brand-700">{block.cta}</span>
      </div>
    );
  return (
    <div className="rounded-xl border border-slate-100 p-8">
      <h2 className="text-lg font-bold text-slate-900">{block.heading}</h2>
      <p className="mt-2 text-slate-600">{block.body}</p>
    </div>
  );
}

export default function SiteEditor({ sites }) {
  const [site, setSite] = useState(sites[0] || null);
  const [title, setTitle] = useState(site?.title || "");
  const [blocks, setBlocks] = useState(site?.blocks || []);
  const [published, setPublished] = useState(site?.published || false);
  const [saved, setSaved] = useState(false);

  if (!site) return <p className="text-slate-500">No site yet.</p>;

  function updateBlock(i, patch) {
    setBlocks(blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
    setSaved(false);
  }
  function addBlock(type) {
    setBlocks([...blocks, { ...BLOCK_TEMPLATES[type] }]);
    setSaved(false);
  }
  function removeBlock(i) {
    setBlocks(blocks.filter((_, idx) => idx !== i));
    setSaved(false);
  }
  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const copy = [...blocks];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setBlocks(copy);
    setSaved(false);
  }

  async function save() {
    await fetch(`/api/sites/${site.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, blocks, published }),
    });
    setSaved(true);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Editor */}
      <div className="space-y-4">
        <div className="card space-y-3 p-5">
          <div>
            <label className="label">Site title</label>
            <input className="input" value={title} onChange={(e) => { setTitle(e.target.value); setSaved(false); }} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={published} onChange={(e) => { setPublished(e.target.checked); setSaved(false); }} />
            Published at <code className="rounded bg-slate-100 px-1">/site/{site.slug}</code>
          </label>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => addBlock("hero")} className="btn-ghost text-xs">+ Hero</button>
            <button onClick={() => addBlock("features")} className="btn-ghost text-xs">+ Features</button>
            <button onClick={() => addBlock("cta")} className="btn-ghost text-xs">+ CTA</button>
            <button onClick={() => addBlock("text")} className="btn-ghost text-xs">+ Text</button>
          </div>
        </div>

        {blocks.map((b, i) => (
          <div key={i} className="card space-y-2 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">{b.type}</span>
              <div className="flex gap-2 text-xs">
                <button onClick={() => move(i, -1)} className="text-slate-400 hover:text-slate-700">↑</button>
                <button onClick={() => move(i, 1)} className="text-slate-400 hover:text-slate-700">↓</button>
                <button onClick={() => removeBlock(i)} className="text-red-500 hover:underline">remove</button>
              </div>
            </div>
            {"heading" in b && <input className="input" value={b.heading} onChange={(e) => updateBlock(i, { heading: e.target.value })} placeholder="Heading" />}
            {"subheading" in b && <input className="input" value={b.subheading} onChange={(e) => updateBlock(i, { subheading: e.target.value })} placeholder="Subheading" />}
            {"body" in b && <textarea className="input" rows={3} value={b.body} onChange={(e) => updateBlock(i, { body: e.target.value })} placeholder="Body" />}
            {"cta" in b && <input className="input" value={b.cta} onChange={(e) => updateBlock(i, { cta: e.target.value })} placeholder="Button label" />}
            {"items" in b && (
              <textarea className="input" rows={3} value={(b.items || []).join("\n")} onChange={(e) => updateBlock(i, { items: e.target.value.split("\n").filter(Boolean) })} placeholder="One item per line" />
            )}
          </div>
        ))}

        <div className="flex items-center gap-3">
          <button onClick={save} className="btn-primary">Save & publish</button>
          {saved && <span className="text-sm text-emerald-600">Saved ✓</span>}
          {published && <a href={`/site/${site.slug}`} target="_blank" className="text-sm text-brand-600 hover:underline">View live →</a>}
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase text-slate-400">Live preview</p>
        <div className="space-y-4 rounded-xl border border-dashed border-slate-200 bg-white p-4">
          {blocks.length === 0 && <p className="py-12 text-center text-slate-300">Add a block to get started.</p>}
          {blocks.map((b, i) => <BlockPreview key={i} block={b} />)}
        </div>
      </div>
    </div>
  );
}
