import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/ui";
import { socials } from "@/components/icons";
import { img } from "@/lib/site";
import { getSettings } from "@/lib/data";
import { seoMetadata } from "@/lib/seo";

export const metadata: Metadata = seoMetadata({ title: "Contact a Property Advisor in Bhubaneswar", description: "Contact Prolific Properties in Saheed Nagar, Bhubaneswar for property enquiries, site visits and local home buying guidance.", path: "/contact" });

export default async function ContactPage() {
  const site = await getSettings();
  const cards = [
    { Icon: Phone, title: "Call us", value: site.phone, href: `tel:${site.phone}` },
    { Icon: Mail, title: "Email us", value: site.email, href: `mailto:${site.email}` },
    { Icon: MapPin, title: "Visit us", value: site.address },
    { Icon: Clock, title: "Office hours", value: site.hours },
  ];
  return (
    <>
      <PageHero title="Contact Us" text="Have a question about a home? Our property advisors are here to help." image={img("1600585154340-be6161a56a0c")} />

      <section className="container-x grid gap-8 py-12 md:py-24 lg:grid-cols-2 lg:gap-10">
        <div className="min-w-0">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {cards.map(({ Icon, title, value, href }) => {
              const content = <>
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-muted sm:mt-4">{title}</span>
                  <span className="mt-1 block font-semibold break-words text-ink">{value}</span>
                </span>
              </>;
              const className = "flex items-start gap-4 rounded-2xl border border-line p-4 sm:block sm:p-6";
              return href ? (
                <a key={title} href={href} className={`${className} transition hover:border-brand-300`}>{content}</a>
              ) : (
                <div key={title} className={className}>{content}</div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {socials.filter(({ key }) => site.social[key]).map(({ key, label, Icon }) => (
              <a
                key={key}
                href={site.social[key]}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-brand-300 hover:text-brand-700"
              >
                <Icon className="size-4" /> {label}
              </a>
            ))}
          </div>
          <iframe
            title="Office location"
            src={`https://www.google.com/maps?q=${encodeURIComponent(site.address)}&z=15&output=embed`}
            className="mt-6 h-64 w-full rounded-2xl border-0 sm:h-72"
            loading="lazy"
          />
        </div>
        <div className="min-w-0 rounded-3xl bg-surface p-5 sm:p-8 md:p-10">
          <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase">Contact us</p>
          <h2 className="mt-3 mb-6 text-2xl font-bold text-ink sm:mb-8 sm:text-3xl">We&apos;d love to hear from you</h2>
          <EnquiryForm
            subject="New enquiry from website (Contact page)"
            fields={[
              { name: "Full name", required: true },
              { name: "Mobile", type: "tel", required: true },
              { name: "Email", type: "email", required: true },
              { name: "I want to", options: ["Buy a property", "Rent a property", "Investment advice", "Something else"] },
              { name: "Message", textarea: true },
            ]}
          />
        </div>
      </section>
    </>
  );
}
