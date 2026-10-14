import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileCheck2,
  MapPin,
  Quote,
  Scale,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { PostCard } from "@/components/PostCard";
import { EnquiryForm } from "@/components/EnquiryForm";
import { SectionHeading, inputClass } from "@/components/ui";
import { serviceIcons } from "@/components/icons";
import { budgets } from "@/lib/format";
import {
  getPosts,
  getProperties,
  getSettings,
  getTestimonials,
} from "@/lib/data";
import { CATEGORIES } from "@/lib/types";
import { img, services } from "@/lib/site";

export default async function Home() {
  const [site, properties, testimonials, posts] = await Promise.all([
    getSettings(),
    getProperties(),
    getTestimonials(),
    getPosts(),
  ]);
  const featured = properties.filter((p) => p.featured);
  const cities = [...new Set(properties.map((p) => p.city))];
  const { stats, developers } = site;
  const spotlight = featured[0] ?? properties[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface">
        <div className="container-x grid items-center gap-10 pt-8 pb-14 sm:pt-12 lg:grid-cols-2 lg:gap-12 lg:pb-20 lg:pt-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-medium text-brand-700">
              <BadgeCheck className="size-4" /> RERA registered · 100% verified
              listings
            </span>
            <h1 className="mt-6 text-4xl leading-[1.1] font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {site.hero.title}{" "}
              <span className="text-brand-600">{site.hero.highlight}</span>
            </h1>
            <p className="mt-5 max-w-lg text-muted sm:mt-6 sm:text-lg">
              {site.hero.subtitle}
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700"
              >
                Explore properties <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-line bg-white px-6 py-3.5 text-center font-semibold text-ink hover:border-brand-300"
              >
                Talk to an advisor
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 sm:mt-12 sm:gap-6">
              {stats.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-bold text-ink sm:text-3xl">
                    {s.value}
                  </dt>
                  <dd className="text-xs text-muted sm:text-sm">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl sm:aspect-square sm:rounded-[2rem] lg:aspect-4/5">
              <Image
                src={img("1600596542815-ffad4c1539a9")}
                alt="Modern home"
                fill
                loading="eager"
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            {spotlight && (
              <Link
                href={`/properties/${spotlight.slug}`}
                className="absolute -bottom-6 left-3 flex items-center gap-3 rounded-2xl bg-white p-3 sm:left-4 sm:gap-4 sm:p-4 shadow-2xl shadow-brand-900/15 sm:-left-8"
              >
                <div className="relative size-12 overflow-hidden rounded-xl sm:size-16">
                  <Image
                    src={spotlight.images[0]}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs text-muted">Featured this week</p>
                  <p className="font-semibold text-ink">{spotlight.title}</p>
                  <p className="flex items-center gap-1 text-xs text-muted">
                    <MapPin className="size-3" /> {spotlight.area}
                  </p>
                </div>
              </Link>
            )}
            <div className="absolute top-4 right-3 hidden rounded-2xl bg-brand-600 px-5 py-4 text-white shadow-xl sm:top-6 sm:right-4 sm:block lg:-right-6">
              <p className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </p>
              <p className="mt-1 text-sm font-semibold">
                Rated 4.9 by 600+ buyers
              </p>
            </div>
          </div>
        </div>
        {/* Search */}
        <div className="container-x pb-16">
          <form
            action="/properties"
            className="grid gap-3 rounded-3xl border border-line bg-white p-4 shadow-xl shadow-brand-900/5 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
          >
            <input
              name="q"
              placeholder="Search by project, area or developer"
              className={`${inputClass} sm:col-span-3 lg:col-span-1`}
            />
            <select name="city" className={inputClass} defaultValue="">
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select name="category" className={inputClass} defaultValue="">
              <option value="">Property type</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select name="budget" className={inputClass} defaultValue="">
              <option value="">Any budget</option>
              {budgets.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 sm:col-span-3 lg:col-span-1">
              <Search className="size-4" /> Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured */}
      <section className="container-x py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Exclusive deals"
            title="Featured properties"
            text="Hand-picked projects from Bhubaneswar's most trusted developers."
          />
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:gap-3"
          >
            View all properties <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 3).map((p) => (
            <PropertyCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {/* Browse by type */}
      <section className="container-x pb-16 md:pb-24">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {(
            [
              ["Apartment", "Apartments", "1545324418-cc1a3fa10c00"],
              ["Villa", "Villas", "1613490493576-7fde63acd811"],
              ["Duplex", "Duplexes", "1600585154340-be6161a56a0c"],
              ["Plot", "Plots", "1500382017468-9049fed747ef"],
            ] as const
          ).map(([c, label, id]) => {
            const count = properties.filter((p) => p.category === c).length;
            return (
              <Link
                key={c}
                href={`/properties?category=${c}`}
                className="group relative aspect-square overflow-hidden rounded-2xl md:aspect-3/4"
              >
                <Image
                  src={img(id)}
                  alt={c}
                  fill
                  sizes="(min-width:768px) 25vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-brand-950/85 via-brand-950/10" />
                <div className="absolute inset-x-3 bottom-3 flex items-end justify-between text-white sm:inset-x-5 sm:bottom-5">
                  <div>
                    <p className="text-base font-semibold sm:text-xl">
                      {label}
                    </p>
                    <p className="text-xs text-white/70 sm:text-sm">
                      {count} {count === 1 ? "listing" : "listings"}
                    </p>
                  </div>
                  <span className="hidden size-9 place-items-center rounded-full bg-white/15 backdrop-blur group-hover:bg-brand-600 sm:grid">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Services */}
      <section className="bg-surface py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="Our services"
            title="Everything you need, under one roof"
            text="From the first site visit to the final registration, our experts handle it all."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 md:mt-14 lg:grid-cols-3">
            {services.map((s) => {
              const Icon = serviceIcons[s.icon];
              return (
                <div
                  key={s.title}
                  className="group rounded-2xl border border-line bg-white p-7 transition hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {s.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About / why us */}
      <section className="container-x grid items-center gap-14 py-16 md:py-24 lg:grid-cols-2">
        <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
          <div className="relative mt-10 aspect-3/4 overflow-hidden rounded-2xl">
            <Image
              src={img("1560250097-0b93528c311a")}
              alt="Advisor"
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-3/4 overflow-hidden rounded-2xl">
            <Image
              src={img("1600607687939-ce8a6c25118c")}
              alt="Interior"
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-2xl bg-brand-600 px-6 py-4 text-center text-white shadow-xl">
            <p className="text-3xl font-bold">12+</p>
            <p className="text-xs">Years of trust</p>
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow="What we stand for"
            title="Making real estate simple, transparent and reliable"
            text={`${site.siteName} exists to make your home buying experience easy. In a market that often lacks transparency, our team brings verified listings, honest advice and complete support so you can buy with confidence.`}
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {(
              [
                [
                  ShieldCheck,
                  "Verified properties",
                  "Every project is RERA-checked and legally vetted.",
                ],
                [
                  Scale,
                  "Legal assistance",
                  "In-house experts for titles and agreements.",
                ],
                [
                  FileCheck2,
                  "Smooth documentation",
                  "Paperwork and approvals handled end to end.",
                ],
                [
                  BadgeCheck,
                  "Best price promise",
                  "Direct developer tie-ups, no hidden costs.",
                ],
              ] as const
            ).map(([Icon, t, d]) => (
              <li key={t} className="flex gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-semibold text-ink">{t}</p>
                  <p className="text-sm text-muted">{d}</p>
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
        </div>
      </section>

      {/* Stats + RERA */}
      <section className="bg-brand-600">
        <div className="container-x grid grid-cols-2 gap-6 py-12 text-white sm:gap-8 md:py-14 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold sm:text-4xl">{s.value}</p>
              <p className="text-brand-100">{s.label}</p>
            </div>
          ))}
          <div className="col-span-2 rounded-2xl bg-white/10 p-5 lg:col-span-1">
            <p className="text-sm text-brand-100">Registered with ORERA</p>
            <p className="mt-1 font-semibold">{site.rera}</p>
          </div>
        </div>
      </section>

      {/* Developers */}
      <section className="py-20">
        <p className="text-center text-sm font-semibold tracking-widest text-muted uppercase">
          Our trusted developer partners
        </p>
        <div className="relative mt-10 overflow-hidden mask-x-from-85%">
          <div className="animate-marquee flex w-max gap-4">
            {[...developers, ...developers].map((d, i) => (
              <span
                key={i}
                className="rounded-2xl border border-line px-10 py-6 text-lg font-bold whitespace-nowrap text-ink/60"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="Feedback from buyers"
            title="Families who found their home with us"
          />
          <div className="mt-10 grid gap-4 sm:gap-6 md:mt-14 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-line bg-white p-6 sm:p-8"
              >
                <Quote className="size-8 text-brand-200" />
                <blockquote className="mt-4 flex-1 leading-relaxed text-ink/80">
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
      <section className="container-x py-16 md:py-24">
        <div className="grid overflow-hidden rounded-3xl bg-brand-950 lg:grid-cols-2 lg:rounded-[2rem]">
          <div className="relative min-h-72">
            <Image
              src={img("1600585154340-be6161a56a0c")}
              alt=""
              fill
              sizes="50vw"
              className="object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-linear-to-t from-brand-950 to-transparent p-6 sm:p-10 lg:p-14">
              <div className="flex h-full flex-col justify-end">
                <p className="text-sm font-semibold tracking-widest text-brand-300 uppercase">
                  Contact us
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                  We&apos;d love to hear from you
                </h2>
                <p className="mt-3 text-white/70">
                  Tell us what you&apos;re looking for and an advisor will call
                  you back within the hour.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 sm:p-8 lg:p-14">
            <EnquiryForm
              subject="New enquiry from website (Home page)"
              submitLabel="Request a call back"
            />
          </div>
        </div>
      </section>
    </>
  );
}
