import { sites } from "@/lib/data";
import SiteEditor from "@/components/SiteEditor";

export default function BuilderPage() {
  const allSites = sites.list().map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    published: !!s.published,
    blocks: JSON.parse(s.blocks_json || "[]"),
    updated_at: s.updated_at,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Website builder</h1>
        <p className="mt-1 text-slate-500">Edit your landing page blocks and publish in one click.</p>
      </div>
      <SiteEditor sites={allSites} />
    </div>
  );
}
