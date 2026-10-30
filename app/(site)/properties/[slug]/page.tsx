import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, ChevronRight, FileBadge2, MapPin, Phone } from "lucide-react";
import { ConfigurationExplorer, type ConfigurationOption } from "@/components/ConfigurationExplorer";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PropertyCard } from "@/components/PropertyCard";
import { Gallery, ScheduleTour, ShareActions } from "@/components/PropertyInteractive";
import { WhatsApp } from "@/components/icons";
import { formatPrice, priceToRupees } from "@/lib/format";
import { configurationLabel, variantPrice } from "@/lib/variants";
import { getProperties, getProperty, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, seoMetadata } from "@/lib/seo";
import type { Property } from "@/lib/types";

const JUMP = [
  { href: "#homes", label: "Homes" },
  { href: "#about", label: "About" },
  { href: "#location", label: "Location" },
  { href: "#enquire", label: "Enquire" },
] as const;

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const p = await getProperty((await params).slug);
  return p ? seoMetadata({
    title: `${p.title} | ${p.category} in ${p.area}, ${p.city}`,
    description: `${p.title}: ${p.category.toLowerCase()} for ${p.listingType.toLowerCase()} in ${p.area}, ${p.city}. ${formatPrice(p)}. ${p.summary}`.slice(0, 290),
    path: `/properties/${p.slug}`,
    image: p.images[0],
  }) : {};
}

function configurationsFor(p: Property): ConfigurationOption[] {
  if (p.variants?.length) return p.variants;
  if (p.floorPlans?.length) return p.floorPlans.map((plan) => ({
    name: plan.name,
    basePrice: "",
    price: String(plan.price || p.price),
    sqft: plan.sqft,
    sqftMax: plan.sqft,
    floorPlans: [],
    bedrooms: Number(plan.name.match(/\b(\d+)\s*BHK\b/i)?.[1]) || undefined,
    status: p.status,
    availableFrom: p.availableFrom,
    description: "",
    features: p.features,
  }));
  return [{
    name: p.configurations || p.category,
    basePrice: "",
    price: p.price,
    sqft: p.sqft,
    sqftMax: p.sqft,
    floorPlans: [],
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    parking: p.parking,
    units: p.units,
    status: p.status,
    availableFrom: p.availableFrom,
    description: "",
    features: p.features,
  }];
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const [{ slug }, site, properties] = await Promise.all([params, getSettings(), getProperties()]);
  const p = properties.find((item) => item.slug === slug);
  if (!p) notFound();
  const options = configurationsFor(p).sort((a, b) => (priceToRupees(variantPrice(a)) ?? Infinity) - (priceToRupees(variantPrice(b)) ?? Infinity));
  const startingPrice = options.reduce((lowest, option) => {
    const price = variantPrice(option);
    return (priceToRupees(price) ?? Infinity) < (priceToRupees(lowest) ?? Infinity) ? price : lowest;
  }, variantPrice(options[0]));
  const priceAmount = priceToRupees(startingPrice);
  const address = [p.area, p.city, p.state, "India"].filter(Boolean).join(", ");
  const similar = properties.filter((x) => x.slug !== p.slug && (x.category === p.category || x.city === p.city)).slice(0, 3);
  const statuses = new Set(options.map((option) => option.status));
  const availability = typeof p.units !== "number" ? undefined : p.units > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";

  return (
    <div className="bg-surface pb-28 lg:pb-20">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "RealEstateListing",
            "@id": `${absoluteUrl(`/properties/${p.slug}`)}#listing`,
            url: absoluteUrl(`/properties/${p.slug}`),
            name: p.title,
            description: p.summary,
            image: p.images.map(absoluteUrl),
            datePosted: p.createdAt,
            dateModified: p.updatedAt,
            mainEntity: {
              "@type": p.category === "Apartment" ? "Apartment" : p.category === "Villa" || p.category === "Duplex" ? "House" : "Place",
              name: p.title,
              address: { "@type": "PostalAddress", addressLocality: p.city, addressRegion: p.state, addressCountry: "IN", streetAddress: p.area },
              floorSize: p.sqft > 0 ? { "@type": "QuantitativeValue", value: p.sqft, unitCode: "FTK" } : undefined,
              numberOfBedrooms: p.bedrooms || undefined,
              numberOfBathroomsTotal: p.bathrooms || undefined,
            },
            offers: priceAmount === null ? undefined : { "@type": "Offer", price: priceAmount, priceCurrency: "INR", availability, seller: { "@id": `${absoluteUrl("/")}#organization` } },
          },
          { "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Properties", item: absoluteUrl("/properties") },
            { "@type": "ListItem", position: 3, name: p.title, item: absoluteUrl(`/properties/${p.slug}`) },
          ] },
        ],
      }} />

      <div className="container-x pt-5 md:pt-8">
        <nav className="flex min-w-0 items-center gap-1 text-sm text-muted">
          <Link href="/" className="shrink-0 hover:text-ink">Home</Link>
          <ChevronRight className="size-4 shrink-0" />
          <Link href="/properties" className="shrink-0 hover:text-ink">Properties</Link>
          <ChevronRight className="size-4 shrink-0" />
          <span className="truncate text-ink">{p.title}</span>
        </nav>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-widest text-brand-700 uppercase">{p.category} · For {p.listingType}{statuses.size === 1 ? ` · ${options[0].status}` : ""}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-5xl">{p.title}</h1>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted md:text-base"><MapPin className="size-4 shrink-0 text-brand-600" /> {[p.area, p.city].filter(Boolean).join(", ")}</p>
          </div>
          <div className="flex w-full items-end justify-between gap-4 sm:w-auto sm:flex-col sm:items-end">
            <div className="sm:text-right">
              <p className="text-xs font-medium text-muted">{p.listingType === "Rent" ? "Rent from" : "Homes from"}</p>
              <p className="mt-1 text-2xl font-bold text-brand-700 md:text-3xl">{formatPrice({ price: startingPrice, listingType: p.listingType })}</p>
            </div>
            <ShareActions title={p.title} />
          </div>
        </div>

        <div className="mt-6"><Gallery images={p.images} title={p.title} /></div>

        <nav aria-label="On this page" className="no-scrollbar mt-5 flex gap-2 overflow-x-auto">
          {JUMP.filter((item) => item.href !== "#about" || p.description.length > 0 || p.summary || p.developer || p.rera).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-muted transition hover:border-brand-300 hover:text-brand-700"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8">
          <main className="min-w-0 space-y-6">
            <ConfigurationExplorer options={options} listingType={p.listingType} />

            {(p.description.length > 0 || p.summary || p.developer || p.rera) && (
              <section id="about" className="scroll-mt-28 rounded-3xl border border-line bg-white p-5 md:p-7">
                <p className="text-xs font-semibold tracking-widest text-brand-700 uppercase">The project</p>
                <h2 className="mt-2 text-2xl font-bold text-ink">About {p.title}</h2>
                <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted md:text-base">
                  {p.description.length ? p.description.map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p>{p.summary}</p>}
                </div>
                {(p.developer || p.rera || p.ref) && (
                  <dl className="mt-6 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
                    {p.developer && (
                      <div className="rounded-2xl bg-surface px-4 py-3">
                        <dt className="flex items-center gap-1.5 text-xs text-muted"><Building2 className="size-3.5 text-brand-700" /> Developer</dt>
                        <dd className="mt-1.5 font-semibold text-ink">{p.developer}</dd>
                      </div>
                    )}
                    {p.rera && (
                      <div className="rounded-2xl bg-surface px-4 py-3">
                        <dt className="flex items-center gap-1.5 text-xs text-muted"><FileBadge2 className="size-3.5 text-brand-700" /> RERA</dt>
                        <dd className="mt-1.5 font-semibold text-ink">{p.rera}</dd>
                      </div>
                    )}
                    <div className="rounded-2xl bg-surface px-4 py-3">
                      <dt className="text-xs text-muted">Property ID</dt>
                      <dd className="mt-1.5 font-semibold text-ink">{p.ref}</dd>
                    </div>
                  </dl>
                )}
              </section>
            )}

            <section id="location" className="scroll-mt-28 rounded-3xl border border-line bg-white p-5 md:p-7">
              <p className="text-xs font-semibold tracking-widest text-brand-700 uppercase">Neighbourhood</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">Location</h2>
              <p className="mt-2 flex items-start gap-1.5 text-sm text-muted"><MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" /> {address}</p>
              <iframe title={`Map of ${p.title}`} src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&z=14&output=embed`} className="mt-5 h-64 w-full rounded-2xl border-0 sm:h-80" loading="lazy" />
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:gap-3"><MapPin className="size-4" /> Open in Google Maps</a>
            </section>
          </main>

          <aside id="enquire" className="scroll-mt-24 rounded-3xl border border-line bg-white p-5 lg:sticky lg:top-28 lg:p-6">
            <h2 className="text-lg font-semibold text-ink">Interested in this property?</h2>
            <p className="mt-1 text-sm text-muted">Ask for availability, a quote or a site visit.</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a href={`tel:${site.phone}`} className="flex items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm font-semibold text-ink transition hover:border-brand-300"><Phone className="size-4" /> Call</a>
              <a href={whatsappLink(site.whatsapp, `I'm interested in ${p.title}`)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white transition hover:brightness-95"><WhatsApp className="size-4" /> WhatsApp</a>
            </div>
            <div className="mt-5">
              <EnquiryForm type="property" subject={`Enquiry for ${p.title} (ID ${p.ref})`} fields={[
                { name: "Full name", required: true },
                { name: "Mobile", type: "tel", required: true },
                ...(options.length > 1 ? [{ name: "Home type", options: options.map(configurationLabel) }] : []),
              ]} submitLabel="Request details" />
            </div>
            <div id="tour" className="mt-6 border-t border-line pt-5">
              <h3 className="text-sm font-semibold text-ink">Schedule a site visit</h3>
              <p className="mt-1 text-sm text-muted">Pick a day and time that works for you.</p>
              <div className="mt-4"><ScheduleTour title={p.title} /></div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-12 md:mt-16">
            <h2 className="text-2xl font-bold text-ink">Similar listings</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => <PropertyCard key={item.slug} p={item} />)}
            </div>
          </section>
        )}
      </div>

      <div id="mobile-cta" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden">
        <a href={`tel:${site.phone}`} className="flex items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm font-semibold text-ink"><Phone className="size-4" /> Call</a>
        <a href={whatsappLink(site.whatsapp, `I'm interested in ${p.title}`)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white"><WhatsApp className="size-4" /> Chat</a>
        <a href="#enquire" className="flex items-center justify-center rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white">Enquire</a>
      </div>
    </div>
  );
}
