import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/ui";
import { serviceIcons } from "@/components/icons";
import { img, services } from "@/lib/site";

export const metadata: Metadata = { title: "Services" };

const steps = [
  ["Tell us what you need", "Share your budget, preferred locations and must-haves with an advisor."],
  ["Shortlist & visit", "We curate verified options and arrange guided site visits, in person or on video."],
  ["Negotiate & finance", "We get you the best price and handle your home loan from application to sanction."],
  ["Register & move in", "Our legal team handles documentation and registration until you get the keys."],
];

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Services" text="End-to-end expertise for buying, selling and investing in property." image={img("1600880292203-757bb62b4baf")} />

      <section className="container-x py-16 md:py-24">
        <SectionHeading center eyebrow="Our expertise" title="How we can help you" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 md:mt-14 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = serviceIcons[s.icon];
            return (
              <div key={s.title} className="group relative overflow-hidden rounded-3xl border border-line p-6 transition sm:p-8 hover:border-brand-600 hover:bg-brand-600">
                <span className="absolute top-6 right-8 text-5xl font-bold text-surface transition group-hover:text-white/10">0{i + 1}</span>
                <span className="relative grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon className="size-7" />
                </span>
                <h3 className="relative mt-6 text-xl font-semibold text-ink group-hover:text-white">{s.title}</h3>
                <p className="relative mt-3 leading-relaxed text-muted group-hover:text-white">{s.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <div className="container-x">
          <SectionHeading center eyebrow="Our process" title="Your journey, in four simple steps" />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 md:mt-14 lg:grid-cols-4">
            {steps.map(([t, d], i) => (
              <li key={t} className="rounded-2xl bg-white p-6 sm:p-7">
                <span className="grid size-10 place-items-center rounded-full bg-brand-600 font-bold text-white">{i + 1}</span>
                <h3 className="mt-5 font-semibold text-ink">{t}</h3>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center md:mt-14">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 font-semibold text-white hover:bg-brand-700">
              Talk to an expert <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
