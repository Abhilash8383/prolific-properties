import Link from "next/link";
import { ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/data";
import type { LegalBlock, LegalSection } from "@/lib/legal";

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return <p key={index} className="leading-relaxed text-muted">{block.text}</p>;
        }
        if (block.type === "h3") {
          return <h3 key={index} className="pt-2 text-base font-semibold text-ink">{block.text}</h3>;
        }
        if (block.type === "note") {
          return (
            <p key={index} className="rounded-2xl border border-brand-200 bg-brand-50/70 px-4 py-3 text-sm leading-relaxed text-ink">
              {block.text}
            </p>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc space-y-2 pl-5 text-muted marker:text-brand-600">
              {block.items.map((item) => (
                <li key={item} className="leading-relaxed pl-1">{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <ol key={index} className="list-decimal space-y-2 pl-5 text-muted marker:font-semibold marker:text-brand-700">
            {block.items.map((item) => (
              <li key={item} className="leading-relaxed pl-1">{item}</li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}

export async function LegalPage({
  title,
  updated,
  intro,
  sections,
  relatedHref,
  relatedLabel,
}: {
  title: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
  relatedHref: string;
  relatedLabel: string;
}) {
  const site = await getSettings();
  const email = site.email || "info@prolificproperties.in";
  const phone = site.phone || "9090090155";
  const address = site.address || "Bhubaneswar, Odisha, India";

  return (
    <div className="bg-surface">
      <section className="border-b border-line bg-white">
        <div className="container-x py-10 md:py-14">
          <nav className="flex items-center gap-1 text-sm text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <ChevronRight className="size-4 shrink-0" />
            <span className="text-ink">{title}</span>
          </nav>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-widest text-brand-700 uppercase">Legal</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-5xl">{title}</h1>
              <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>
            </div>
            <Link
              href={relatedHref}
              className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand-300 hover:text-brand-700"
            >
              {relatedLabel}
            </Link>
          </div>
          <div className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-muted md:text-base">
            {intro.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <div className="container-x grid gap-8 py-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12 lg:py-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold tracking-widest text-brand-700 uppercase">On this page</p>
          <nav aria-label="Sections" className="mt-3 max-h-[70vh] space-y-1 overflow-y-auto pr-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white hover:text-brand-700"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 space-y-6">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 rounded-3xl border border-line bg-white p-5 md:p-7"
            >
              <h2 className="text-xl font-bold text-ink md:text-2xl">{section.title}</h2>
              <div className="mt-4">
                <Blocks blocks={section.blocks} />
              </div>
            </section>
          ))}

          <section id="get-in-touch" className="scroll-mt-28 rounded-3xl border border-line bg-white p-5 md:p-7">
            <p className="text-xs font-semibold tracking-widest text-brand-700 uppercase">Get in touch</p>
            <h2 className="mt-2 text-xl font-bold text-ink md:text-2xl">{site.siteName}</h2>
            <p className="mt-2 text-sm text-muted">Website: www.prolificproperties.in</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <a href={`mailto:${email}`} className="flex items-start gap-3 rounded-2xl bg-surface px-4 py-3 transition hover:bg-brand-50">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand-700" />
                <span className="min-w-0">
                  <span className="block text-xs text-muted">Email</span>
                  <span className="mt-0.5 block break-all text-sm font-semibold text-ink">{email}</span>
                </span>
              </a>
              <a href={`tel:${phone}`} className="flex items-start gap-3 rounded-2xl bg-surface px-4 py-3 transition hover:bg-brand-50">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-700" />
                <span className="min-w-0">
                  <span className="block text-xs text-muted">Phone</span>
                  <span className="mt-0.5 block text-sm font-semibold text-ink">{phone}</span>
                </span>
              </a>
              <div className="flex items-start gap-3 rounded-2xl bg-surface px-4 py-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-700" />
                <span className="min-w-0">
                  <span className="block text-xs text-muted">Location</span>
                  <span className="mt-0.5 block text-sm font-semibold text-ink">{address}</span>
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
