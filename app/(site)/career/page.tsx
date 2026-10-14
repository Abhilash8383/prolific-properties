import type { Metadata } from "next";
import { Briefcase, Mail, MapPin } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero, SectionHeading } from "@/components/ui";
import { img } from "@/lib/site";
import { getJobs, getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Career" };

export default async function CareerPage() {
  const [site, jobs] = await Promise.all([getSettings(), getJobs()]);
  return (
    <>
      <PageHero title="Career" text={`Build your career in real estate with ${site.siteName}.`} image={img("1556761175-5973dc0f32e7")} />

      <section className="container-x py-16 md:py-24">
        <SectionHeading
          center
          eyebrow="Opportunity"
          title={`Grow with ${site.siteName}`}
          text="Join a dynamic team where expertise and passion shape the future of property experiences. Whether you're an aspiring advisor, a seasoned professional or a tech enthusiast, we offer a platform to nurture your talent."
        />
        <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-[3fr_2fr] lg:gap-10">
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-ink">Now hiring</h3>
            {jobs.map((j) => (
              <div key={j.title} className="rounded-2xl border border-line p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h4 className="text-lg font-semibold text-ink">{j.title}</h4>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{j.type}</span>
                </div>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                  <span className="flex items-center gap-1"><Briefcase className="size-4" /> Sales</span>
                  <span className="flex items-center gap-1"><MapPin className="size-4" /> {j.location}</span>
                </p>
                <p className="mt-3 text-muted">{j.text}</p>
              </div>
            ))}
            <a href={`mailto:${site.hrEmail}`} className="flex items-center gap-4 rounded-2xl bg-brand-600 p-5 text-white sm:p-6">
              <span className="grid size-12 place-items-center rounded-xl bg-white/15">
                <Mail className="size-6" />
              </span>
              <span>
                <span className="block font-semibold">Email us your resume</span>
                <span className="break-all text-brand-100">{site.hrEmail}</span>
              </span>
            </a>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-5 sm:p-8">
            <h3 className="mb-5 text-xl font-semibold text-ink">Get a call back</h3>
            <EnquiryForm
              type="career"
              subject="Job application from website"
              submitLabel="Apply now"
              fields={[
                { name: "Full name", required: true },
                { name: "Mobile", type: "tel", required: true },
                { name: "Email", type: "email", required: true },
                { name: "Your city", required: true },
                { name: "Applying for", required: true, options: [...jobs.map((j) => j.title), "General application"] },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
