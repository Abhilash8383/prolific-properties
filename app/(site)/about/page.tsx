import type { Metadata } from "next";
import Image from "next/image";
import { Eye, FileCheck2, Home, Scale, Target } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/ui";
import { img } from "@/lib/site";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "About Us" };

const promises = [
  { Icon: Home, title: "Easy home buying", text: "We make owning a home simple with expert guidance at every step of the process." },
  { Icon: Scale, title: "Legal assistance", text: "Our in-house legal experts ensure complete transparency and security in every transaction." },
  { Icon: FileCheck2, title: "Smooth documentation", text: "A stress-free experience with end-to-end support for all paperwork and approvals." },
];

export default async function AboutPage() {
  const site = await getSettings();
  const { stats, developers } = site;
  return (
    <>
      <PageHero title="About Us" text="We promise to make real estate simple for you." image={img("1486406146926-c627a92ad1ab")} />

      <section className="container-x grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-14">
        <div>
          <SectionHeading eyebrow={`Discover ${site.siteName}`} title="Easy, simple and reliable home buying" />
          <div className="mt-6 space-y-4 leading-relaxed text-muted">
            <p>
              {site.siteName} exists to make your home buying experience easy, simple and reliable. We&apos;re here to lend a helping hand as you
              embark on the journey to your dream home in Odisha.
            </p>
            <p>
              With a market presence spanning over a decade and more than a thousand homes delivered to happy families, we&apos;ve grown from a
              team of two into a team of over twenty, and we&apos;re still growing. Whether it&apos;s a commercial space, an office or a home for
              yourself, we&apos;ve got you covered.
            </p>
            <p>
              Buying or selling a home is one of the most significant decisions you&apos;ll ever make. That&apos;s why we&apos;re dedicated to exceptional
              service, expert guidance and personal attention every step of the way.
            </p>
          </div>
        </div>
        <div className="relative aspect-4/3 overflow-hidden rounded-3xl lg:rounded-[2rem]">
          <Image src={img("1556761175-5973dc0f32e7")} alt="Our team" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="bg-brand-600">
        <div className="container-x grid grid-cols-2 gap-6 py-12 text-white sm:gap-8 md:py-14 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold sm:text-4xl">{s.value}</p>
              <p className="text-brand-100">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        <SectionHeading center eyebrow="Our promise to you" title="What sets us apart" />
        <div className="mt-10 grid gap-4 sm:gap-6 md:mt-14 md:grid-cols-3">
          {promises.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-line p-6 sm:p-8">
              <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-14">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl lg:aspect-4/5 lg:max-w-none lg:rounded-[2rem]">
            <Image src={img("1560250097-0b93528c311a")} alt="Founder" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <div>
            <SectionHeading eyebrow="Meet the founder" title="A message from our Director" />
            <div className="mt-6 space-y-4 leading-relaxed whitespace-pre-line text-muted">{site.founder.message}</div>
            <p className="mt-6 font-semibold text-ink">{site.founder.name}</p>
            <p className="text-sm text-muted">{site.founder.title}</p>
            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
              <div className="rounded-2xl bg-white p-6">
                <Eye className="size-6 text-brand-600" />
                <h3 className="mt-3 font-semibold text-ink">Vision</h3>
                <p className="mt-1 text-sm text-muted">
                  To be the premier partner for premium residential spaces, redefining how people find and own their homes.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6">
                <Target className="size-6 text-brand-600" />
                <h3 className="mt-3 font-semibold text-ink">Mission</h3>
                <p className="mt-1 text-sm text-muted">To provide the best home-buying solutions to every customer, with honesty and care.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        <SectionHeading center eyebrow="Our trusted partners" title="Featured developers" />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:mt-12 md:grid-cols-4">
          {developers.map((d) => (
            <div key={d} className="grid h-20 place-items-center rounded-2xl border border-line px-2 text-center font-bold text-ink/60 sm:h-24 sm:text-lg">
              {d}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
