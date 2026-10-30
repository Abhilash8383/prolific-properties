import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Building2, CalendarCheck, Car, CheckCircle2, ChevronRight, MapPin, Phone, Ruler } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PropertyCard } from "@/components/PropertyCard";
import { Gallery, ScheduleTour, ShareActions } from "@/components/PropertyInteractive";
import { WhatsApp } from "@/components/icons";
import { formatPrice, priceToRupees } from "@/lib/format";
import { getProperties, getProperty, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, seoMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const p = await getProperty((await params).slug);
  return p ? seoMetadata({
    title: `${p.title} | ${p.category} in ${p.area}, ${p.city}`,
    description: `${p.title}: ${p.category.toLowerCase()} for ${p.listingType.toLowerCase()} in ${p.area}, ${p.city}. ${formatPrice(p)}. ${p.summary}`.slice(0, 290),
    path: `/properties/${p.slug}`,
    image: p.images[0],
  }) : {};
}

function Card({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-36 rounded-3xl border border-line bg-white p-5 md:p-8">
      <h2 className="mb-5 text-lg font-semibold text-ink md:mb-6 md:text-xl">{title}</h2>
      {children}
    </section>
  );
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const p = await getProperty((await params).slug);
  if (!p) notFound();
  const [site, properties] = await Promise.all([getSettings(), getProperties()]);
  const priceAmount = priceToRupees(p.price);
  const availability = typeof p.units !== "number" ? undefined : p.units > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";

  const address = `${p.area}, ${p.city}, ${p.state}, India`;
  const similar = properties.filter((x) => x.slug !== p.slug && (x.category === p.category || x.city === p.city)).slice(0, 3);
  const overview = [
    p.bedrooms > 0 && { Icon: BedDouble, label: "Bedrooms", value: p.bedrooms },
    p.bathrooms > 0 && { Icon: Bath, label: "Bathrooms", value: p.bathrooms },
    typeof p.units === "number" && { Icon: Building2, label: "Units available", value: p.units },
    { Icon: Ruler, label: "Size", value: `${p.sqft.toLocaleString("en-IN")} ft²` },
    p.parking > 0 && { Icon: Car, label: "Parking", value: `${p.parking} car` },
    { Icon: Building2, label: "Type", value: p.category },
    { Icon: CalendarCheck, label: "Possession", value: p.availableFrom },
  ].filter(Boolean) as { Icon: typeof Bath; label: string; value: string | number }[];
  const details = [
    ["Property ID", p.ref],
    ["Price", `${formatPrice(p)}${p.listingType === "Sale" ? " onwards" : ""}`],
    ["Units available", typeof p.units === "number" ? p.units : "-"],
    ["Configurations", p.configurations],
    ["Property size", `${p.sqft.toLocaleString("en-IN")} ft²`],
    ["Bedrooms", p.bedrooms || "-"],
    ["Bathrooms", p.bathrooms || "-"],
    ["Parking", p.parking ? `${p.parking} car` : "-"],
    ["Available from", p.availableFrom],
    ["Status", p.status],
    ["Project name", p.title],
    ["Developer", p.developer],
    ["RERA No.", p.rera],
  ];

  return (
    <div className="bg-surface pb-28 lg:pb-24">
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
      <div className="container-x pt-6 md:pt-8">
        <nav className="flex flex-wrap items-center gap-1 text-sm text-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <ChevronRight className="size-4" />
          <Link href="/properties" className="hover:text-ink">Properties</Link>
          <ChevronRight className="size-4" />
          <Link href={`/properties?category=${p.category}`} className="hover:text-ink">{p.category}</Link>
          <ChevronRight className="size-4" />
          <span className="text-ink">{p.title}</span>
        </nav>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-5 md:mt-6 md:gap-6">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">For {p.listingType}</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink ring-1 ring-line">{p.status}</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink ring-1 ring-line">{p.category}</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink md:text-5xl">{p.title}</h1>
            <p className="mt-3 flex items-start gap-1.5 text-sm text-muted md:items-center md:text-base">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600 md:mt-0" /> {address}
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-4 md:w-auto md:flex-col md:items-end">
            <p className="text-3xl font-bold text-brand-700 md:text-4xl">
              {formatPrice(p)}
              {p.listingType === "Sale" && <span className="ml-1 text-base font-medium text-muted">onwards</span>}
            </p>
            <ShareActions title={p.title} />
          </div>
        </div>

        <div className="mt-6 md:mt-8">
          <Gallery images={p.images} title={p.title} />
        </div>

        <div className="no-scrollbar sticky top-18 z-30 -mx-5 mt-6 flex gap-2 overflow-x-auto bg-surface/90 px-5 py-3 backdrop-blur md:mx-0 md:mt-8 md:px-0">
          {["Overview", "Description", "Pricing", "Features", "Details", "Location"].map((s) => (
            <a key={s} href={`#${s.toLowerCase()}`} className="rounded-full bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-ink ring-1 ring-line hover:text-brand-700 hover:ring-brand-300">
              {s}
            </a>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-8">
          <div className="min-w-0 space-y-4 md:space-y-6">
            <Card title="Overview" id="overview">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {overview.map(({ Icon, label, value }) => (
                  <div key={label} className="flex min-w-0 items-center gap-3 rounded-2xl bg-surface p-3 sm:p-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-brand-600 sm:size-11">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs text-muted">{label}</p>
                      <p className="truncate text-sm font-semibold text-ink sm:text-base">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Description" id="description">
              <div className="space-y-4 leading-relaxed text-muted">
                {p.description.map((d) => (
                  <p key={d}>{d}</p>
                ))}
              </div>
            </Card>

            <Card title="Floor plans & pricing" id="pricing">
              <div className="overflow-x-auto rounded-2xl border border-line">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface text-muted">
                    <tr>
                      <th className="px-4 py-3 font-medium sm:px-5">Unit</th>
                      <th className="px-4 py-3 font-medium sm:px-5">Size</th>
                      <th className="px-4 py-3 font-medium sm:px-5">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.floorPlans.map((f) => (
                      <tr key={f.name} className="border-t border-line">
                        <td className="px-4 py-4 font-semibold text-ink sm:px-5">{f.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-muted sm:px-5">{f.sqft.toLocaleString("en-IN")} ft²</td>
                        <td className="px-4 py-4 font-semibold whitespace-nowrap text-brand-700 sm:px-5">{formatPrice({ price: f.price, listingType: p.listingType })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Features & amenities" id="features">
              <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                {Object.entries(p.features)
                  .filter(([, items]) => items.length)
                  .map(([group, items]) => (
                    <div key={group}>
                      <h3 className="mb-3 text-sm font-semibold tracking-wider text-muted uppercase">{group}</h3>
                      <ul className="space-y-2.5">
                        {items.map((f) => (
                          <li key={f} className="flex items-center gap-2.5 text-ink">
                            <CheckCircle2 className="size-4 text-brand-600" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </Card>

            <Card title="Details" id="details">
              <dl className="grid gap-x-10 sm:grid-cols-2">
                {details.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-line py-3 text-sm">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-right font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card title="Location" id="location">
              <dl className="mb-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                {[
                  ["Address", p.area],
                  ["City", p.city],
                  ["State", p.state],
                  ["Country", "India"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <iframe
                title={`Map of ${p.title}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&z=14&output=embed`}
                className="h-64 w-full rounded-2xl border-0 sm:h-80"
                loading="lazy"
              />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
              >
                <MapPin className="size-4" /> Open in Google Maps
              </a>
            </Card>
          </div>

          <aside className="min-w-0 space-y-4 md:space-y-6 lg:sticky lg:top-36 lg:self-start">
            <div id="enquire" className="scroll-mt-36 rounded-3xl border border-line bg-white p-5 md:p-6">
              <h2 className="text-lg font-semibold text-ink">Interested in this property?</h2>
              <p className="mt-1 mb-5 text-sm text-muted">Get the brochure, best price and site visit details.</p>
              <div className="mb-5 grid grid-cols-2 gap-2">
                <a href={`tel:${site.phone}`} className="flex items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm font-semibold text-ink hover:border-brand-300">
                  <Phone className="size-4" /> Call
                </a>
                <a
                  href={whatsappLink(site.whatsapp, `I'm interested in ${p.title}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white"
                >
                  <WhatsApp className="size-4" /> WhatsApp
                </a>
              </div>
              <EnquiryForm
                type="property"
                subject={`Enquiry for ${p.title} (ID ${p.ref})`}
                fields={[
                  { name: "Full name", required: true },
                  { name: "Mobile", type: "tel", required: true },
                  { name: "Email", type: "email" },
                ]}
                submitLabel="Get best price"
              />
            </div>
            <div id="tour" className="scroll-mt-36 rounded-3xl border border-line bg-white p-5 md:p-6">
              <h2 className="mb-5 text-lg font-semibold text-ink">Schedule a tour</h2>
              <ScheduleTour title={p.title} />
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-14 md:mt-20">
            <h2 className="text-2xl font-bold text-ink md:text-3xl">Similar listings</h2>
            <div className="mt-6 grid md:mt-8 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => (
                <PropertyCard key={s.slug} p={s} />
              ))}
            </div>
          </section>
        )}
      </div>
      <div id="mobile-cta" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden">
        <a href={`tel:${site.phone}`} className="flex items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm font-semibold text-ink">
          <Phone className="size-4" /> Call
        </a>
        <a
          href={whatsappLink(site.whatsapp, `I'm interested in ${p.title}`)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white"
        >
          <WhatsApp className="size-4" /> Chat
        </a>
        <a href="#enquire" className="flex items-center justify-center rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white">
          Enquire
        </a>
      </div>
    </div>
  );
}
