import { getSettings } from "@/lib/data";

// TODO: have the final legal copy reviewed before launch.
export async function LegalPage({ title, sections }: { title: string; sections: [string, string][] }) {
  const site = await getSettings();
  return (
    <div className="container-x max-w-3xl py-12 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">{title}</h1>
      <p className="mt-3 text-muted">
        These terms apply to your use of the {site.siteName} website. Questions? Write to {site.email}.
      </p>
      <div className="mt-10 space-y-8">
        {sections.map(([h, t]) => (
          <section key={h}>
            <h2 className="text-xl font-semibold text-ink">{h}</h2>
            <p className="mt-2 leading-relaxed text-muted">{t}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
