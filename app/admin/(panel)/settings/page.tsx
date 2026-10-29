import { AdminForm } from "@/components/admin/client";
import { Input, PageHeader, Panel, Textarea } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { saveSettings } from "../../actions";

export const instant = false;

export default async function AdminSettings() {
  await requireAdmin();
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Site settings" text="Contact details and content shown across the whole website." />
      <AdminForm action={saveSettings} submitLabel="Save settings">
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Contact information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Phone" name="phone" defaultValue={s.phone} />
              <Input label="WhatsApp number" name="whatsapp" defaultValue={s.whatsapp} hint="With country code, e.g. 919876543210" />
              <Input label="Email" name="email" type="email" defaultValue={s.email} />
              <Input label="HR / careers email" name="hrEmail" type="email" defaultValue={s.hrEmail} />
            </div>
            <Textarea label="Office address" name="address" rows={2} defaultValue={s.address} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Office hours" name="hours" defaultValue={s.hours} />
              <Input label="RERA registration" name="rera" defaultValue={s.rera} />
            </div>
          </Panel>

          <Panel title="Social media" text="Leave a field empty to hide that icon.">
            <Input label="Facebook URL" name="social.facebook" defaultValue={s.social.facebook} />
            <Input label="Instagram URL" name="social.instagram" defaultValue={s.social.instagram} />
            <Input label="LinkedIn URL" name="social.linkedin" defaultValue={s.social.linkedin} />
            <Input label="YouTube URL" name="social.youtube" defaultValue={s.social.youtube} />
          </Panel>

          <Panel title="Brand">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Company name" name="siteName" defaultValue={s.siteName} />
              <Input label="Tagline" name="tagline" defaultValue={s.tagline} />
            </div>
            <Textarea label="Short description" name="description" rows={3} defaultValue={s.description} hint="Used in the footer and for search engines" />
          </Panel>

          <Panel title="Home page hero">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Headline" name="hero.title" defaultValue={s.hero.title} />
              <Input label="Highlighted words" name="hero.highlight" defaultValue={s.hero.highlight} hint="Shown in blue after the headline" />
            </div>
            <Textarea label="Subtitle" name="hero.subtitle" rows={2} defaultValue={s.hero.subtitle} />
          </Panel>

          <Panel title="Numbers & partners">
            <Textarea
              label="Stats"
              name="stats"
              rows={4}
              defaultValue={s.stats.map((x) => `${x.value} | ${x.label}`).join("\n")}
              hint="One per line: value | label (e.g. 12+ | Years of experience). Shown on the About page."
            />
            <Textarea label="Developer partners" name="developers" rows={5} defaultValue={s.developers.join("\n")} hint="One name per line" />
          </Panel>

          <Panel title="About page: founder">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" name="founder.name" defaultValue={s.founder.name} />
              <Input label="Title" name="founder.title" defaultValue={s.founder.title} />
            </div>
            <Textarea label="Message" name="founder.message" rows={6} defaultValue={s.founder.message} />
          </Panel>
        </div>
      </AdminForm>
    </>
  );
}
