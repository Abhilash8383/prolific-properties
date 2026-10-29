import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  FileCheck2,
  House,
  KeyRound,
  Landmark,
  MapPinned,
  MessagesSquare,
  PanelsTopLeft,
  Phone,
  Quote,
  Scale,
  Search,
  ShieldCheck,
} from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PostCard } from "@/components/PostCard";
import { SectionHeading } from "@/components/ui";
import { budgets, formatPrice } from "@/lib/format";
import {
  getPosts,
  getProperties,
  getSettings,
  getTestimonials,
} from "@/lib/data";
import { CATEGORIES } from "@/lib/types";
import { img } from "@/lib/site";
import { seoMetadata } from "@/lib/seo";

export const metadata: Metadata = seoMetadata({
  title: "Property in Bhubaneswar | Apartments, Villas & Plots",
  description: "Find apartments, villas, duplex homes and plots in Bhubaneswar. Browse local property listings and get help with shortlisting, visits and home buying.",
  path: "/",
});

const propertyTypes = [
  { category: "Apartment", label: "Apartments", hint: "Easy city living", Icon: Building2 },
  { category: "Villa", label: "Villas", hint: "More room to grow", Icon: House },
  { category: "Duplex", label: "Duplex homes", hint: "Space on two levels", Icon: PanelsTopLeft },
  { category: "Plot", label: "Residential plots", hint: "Build your own home", Icon: MapPinned },
] as const;

const support = [
  { title: "Find the right home", text: "Shortlists built around your needs and budget.", Icon: Search },
  { title: "Compare with confidence", text: "Clear details on pricing, plans and locations.", Icon: FileCheck2 },
  { title: "Get expert guidance", text: "Help with visits, loans and paperwork.", Icon: MessagesSquare },
  { title: "Move forward easily", text: "Support from the first visit to the keys.", Icon: KeyRound },
] as const;

export default async function Home() {
  const [site, properties, testimonials, posts] = await Promise.all([
    getSettings(),
    getProperties(),
    getTestimonials(),
    getPosts(),
  ]);
  const placed = properties.filter((p) => p.placements.includes("homeFeatured"));
  const featured = (placed.length ? placed : properties).slice(0, 3);
  const heroProperties = [
    ...properties.filter((p) => p.placements.includes("spotlight")),
    ...properties.filter((p) => p.placements.includes("homeFeatured") && !p.placements.includes("spotlight")),
  ];
  if (!heroProperties.length) heroProperties.push(...properties.slice(0, 3));
  const fallbackImage = img("1600596542815-ffad4c1539a9");
  const spotlightImage = heroProperties[0]?.images[0] || fallbackImage;
  const areaMap = new Map<string, { count: number; image: string; city: string }>();
  for (const property of properties) {
    if (!property.area) continue;
    const current = areaMap.get(property.area);
    areaMap.set(property.area, {
      count: (current?.count ?? 0) + 1,
      image: current?.image || property.images[0] || spotlightImage,
      city: property.city,
    });
  }
  const areas = [...areaMap.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, 5);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-white via-brand-50/60 to-surface">
        <div className="container-x grid items-center gap-10 pt-10 pb-20 sm:pt-14 lg:grid-cols-[.95fr_1.05fr] lg:gap-14 lg:pt-16 lg:pb-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-xs font-semibold text-brand-700 shadow-sm sm:text-sm">
              <BadgeCheck className="size-4" /> Verified homes · Local guidance
            </span>
            <h1 className="mt-6 max-w-2xl text-4xl leading-[1.08] font-extrabold tracking-tight text-ink sm:text-5xl xl:text-[3.7rem]">
              {site.hero.title}{" "}
              <span className="text-brand-600">{site.hero.highlight}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {site.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
              >
                Explore properties <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-6 py-3.5 font-semibold text-brand-700 transition hover:border-brand-500"
              >
                Talk to a property advisor
              </Link>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-brand-100 pt-6 text-sm font-medium text-ink/80 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {([
                [BadgeCheck, "Verified projects"],
                [Building2, "More choices"],
                [MessagesSquare, "Personal advice"],
                [KeyRound, "Support to keys"],
              ] as const).map(([Icon, label]) => (
                <span key={label} className="flex items-center gap-2">
                  <Icon className="size-5 shrink-0 text-brand-600" /> {label}
                </span>
              ))}
            </div>
          </div>
          <HeroCarousel
            slides={heroProperties.map((property) => ({
              slug: property.slug,
              title: property.title,
              area: property.area,
              price: formatPrice(property),
              image: property.images[0] || fallbackImage,
            }))}
            fallbackImage={fallbackImage}
            propertyCount={properties.length}
          />
        </div>
      </section>

      {/* Quick search */}
      <section className="container-x relative z-10 -mt-10">
        <form action="/properties" className="grid gap-4 rounded-3xl border border-line bg-white p-5 shadow-xl shadow-brand-950/8 sm:grid-cols-2 xl:grid-cols-[1.35fr_1fr_1fr_.8fr_auto] xl:items-end xl:p-6">
          <label className="grid gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
            Location or project
            <input name="q" placeholder="Area, city or project" className="h-12 rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink normal-case outline-none placeholder:font-normal focus:border-brand-400" />
          </label>
          <label className="grid gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
            Property type
            <select name="category" defaultValue="" className="h-12 rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink normal-case outline-none focus:border-brand-400">
              <option value="">All types</option>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
            Budget
            <select name="budget" defaultValue="" className="h-12 rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink normal-case outline-none focus:border-brand-400">
              <option value="">Any budget</option>
              {budgets.map((budget) => <option key={budget.value} value={budget.value}>{budget.label}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
            Bedrooms
            <select name="beds" defaultValue="" className="h-12 rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink normal-case outline-none focus:border-brand-400">
              <option value="">Any</option>
              {[1, 2, 3, 4].map((beds) => <option key={beds} value={beds}>{beds}+</option>)}
            </select>
          </label>
          <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 font-semibold whitespace-nowrap text-white transition hover:bg-brand-700 sm:col-span-2 xl:col-span-1">
            <Search className="size-4" /> Search homes
          </button>
        </form>
      </section>

      {/* Featured homes */}
      {featured.length > 0 && (
      <section className="container-x py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Featured properties"
            title="Homes worth a closer look"
            text="A few standout options from our current listings."
          />
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:gap-3"
          >
            View all properties <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {featured.map((p) => (
            <div key={p.slug} className="w-[min(82vw,22rem)] shrink-0 snap-start sm:w-auto">
              <PropertyCard p={p} />
            </div>
          ))}
        </div>
      </section>
      )}

      {/* Browse by property type */}
      <section className={`container-x pb-16 md:pb-20 ${featured.length ? "" : "pt-16 md:pt-20"}`}>
        <div className="mb-7 text-center">
          <SectionHeading center eyebrow="Browse by type" title="Start with the space you need" text="Choose a property type to see matching homes." />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {propertyTypes.map(({ category, label, hint, Icon }) => {
            const count = properties.filter((p) => p.category === category).length;
            return (
              <Link
                key={category}
                href={`/properties?category=${encodeURIComponent(category)}`}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-950/8"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white"><Icon className="size-6" /></span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-ink">{label}</h3>
                  <p className="mt-0.5 text-xs text-muted">{hint}</p>
                  <p className="mt-2 text-xs font-semibold text-brand-700">{count} {count === 1 ? "home" : "homes"}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-brand-600 transition group-hover:translate-x-1" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular areas */}
      {areas.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <SectionHeading eyebrow="Explore locations" title="Find a home in the right neighbourhood" text="Browse the areas where we currently have homes." />
              <Link href="/properties" className="inline-flex items-center gap-2 font-semibold text-brand-700">All locations <ArrowRight className="size-4" /></Link>
            </div>
            <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
              {areas.map(([area, details]) => (
                <Link key={area} href={`/properties?q=${encodeURIComponent(area)}`} className="group relative aspect-4/3 w-[72vw] max-w-72 shrink-0 snap-start overflow-hidden rounded-2xl sm:aspect-3/4 sm:w-auto sm:max-w-none lg:aspect-4/5">
                  <Image src={details.image} alt="" fill sizes="(min-width:1024px) 20vw, (min-width:640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-brand-950/85 via-brand-950/10 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 text-white">
                    <h3 className="font-semibold sm:text-lg">{area}</h3>
                    <p className="mt-0.5 text-xs text-white">{details.city} · {details.count} {details.count === 1 ? "home" : "homes"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="bg-surface py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="Personal support"
            title="A clearer path from search to keys"
            text="Get help where it matters, at your own pace."
          />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {support.map(({ title, text, Icon }) => (
              <div key={title} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600"><Icon className="size-6" /></span>
                <h3 className="mt-5 font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center"><Link href="/services" className="inline-flex items-center gap-2 font-semibold text-brand-700">See how we help <ArrowRight className="size-4" /></Link></div>
        </div>
      </section>

      {/* About / why us */}
      <section className="container-x grid items-center gap-10 py-16 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-4/3 overflow-hidden rounded-[2rem] lg:aspect-5/4">
          <Image src={img("1600607687939-ce8a6c25118c")} alt="Bright modern living room" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          <div className="absolute right-4 bottom-4 left-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur sm:right-auto sm:bottom-6 sm:left-6 sm:max-w-xs sm:p-5">
            <p className="text-xs font-semibold tracking-wide text-brand-600 uppercase">Your local property partner</p>
            <p className="mt-1 font-semibold text-ink">Explore with clarity. Choose with confidence.</p>
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow={`Why ${site.siteName}`}
            title="A better way to find your next home"
            text="Good decisions start with clear information and someone you can trust to guide you."
          />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {(
              [
                [ShieldCheck, "Verified options", "Review homes with key details upfront."],
                [MessagesSquare, "Personal guidance", "Get answers from a local advisor."],
                [Landmark, "Financing help", "Understand loan options and next steps."],
                [Scale, "Legal support", "Make sense of documents and approvals."],
              ] as const
            ).map(([Icon, t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon className="size-5" /></span>
                <div>
                  <p className="font-semibold text-ink">{t}</p>
                  <p className="mt-1 text-sm text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-white hover:bg-brand-700"
          >
            More about us <ArrowRight className="size-4" />
          </Link>
          {site.rera && <p className="mt-4 text-xs font-medium text-muted">{site.rera}</p>}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-50/60 py-16 md:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="How it works" title="From first search to front door" text="Four simple steps, with an advisor when you need one." />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {([
              ["01", "Tell us what matters", "Share your location, budget and must-haves."],
              ["02", "Explore your options", "Browse listings and compare the details."],
              ["03", "Visit your favourites", "See shortlisted homes before you decide."],
              ["04", "Move ahead with support", "Get guidance on the final steps."],
            ] as const).map(([number, title, text]) => (
              <div key={number} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
                <span className="grid size-10 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{number}</span>
                <h3 className="mt-5 font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="From our buyers"
            title="What people say about us"
          />
          <div className="mt-9 grid gap-4 sm:gap-6 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-line bg-white p-6 sm:p-8"
              >
                <Quote className="size-8 text-brand-200" />
                <blockquote className="mt-4 line-clamp-4 flex-1 leading-relaxed text-ink/80">
                  {t.text}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-6">
                  <span className="grid size-11 place-items-center rounded-full bg-brand-600 font-semibold text-white">
                    {t.name.replace(/^(Mr|Dr)\.?\s/, "")[0]}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{t.name}</p>
                    <p className="text-sm text-muted">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      {posts.length > 0 && (
        <section className="container-x pt-16 md:pt-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="From our blog" title="Insights for smarter buying" />
            <Link href="/blog" className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:gap-3">
              All articles <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="container-x py-16 md:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-950 px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">
          <Image src={spotlightImage} alt="" fill sizes="100vw" className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-linear-to-r from-brand-950 via-brand-950/90 to-brand-950/50" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-widest text-white uppercase">Ready when you are</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Find a home that feels right.</h2>
              <p className="mt-3 text-white">Explore verified listings or speak with an advisor about your options.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <Link href="/properties" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-brand-700 transition hover:bg-brand-50">Explore properties <ArrowRight className="size-4" /></Link>
              <a href={`tel:${site.phone}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"><Phone className="size-4" /> Talk to an advisor</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
