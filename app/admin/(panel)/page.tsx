import Link from "next/link";
import { ArrowRight, Building2, Eye, FileText, Inbox, Plus } from "lucide-react";
import { PageHeader, primaryButton } from "@/components/admin/fields";
import { adminCounts, adminEnquiries } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";

export const instant = false;

export default async function Dashboard() {
  const [counts, enquiries] = await Promise.all([adminCounts(), adminEnquiries()]);
  const cards = [
    { label: "Properties", value: counts.properties, Icon: Building2, href: "/admin/properties" },
    { label: "Live on site", value: counts.published, Icon: Eye, href: "/admin/properties" },
    { label: "New enquiries", value: counts.newEnquiries, Icon: Inbox, href: "/admin/enquiries?status=new" },
    { label: "Blog posts", value: counts.posts, Icon: FileText, href: "/admin/blog" },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        text="Overview of your website content and leads."
        action={
          <Link href="/admin/properties/new" className={primaryButton}>
            <Plus className="size-4" /> Add property
          </Link>
        }
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, Icon, href }) => (
          <Link key={label} href={href} className="rounded-2xl border border-line bg-white p-5 transition hover:border-brand-300">
            <Icon className="size-5 text-brand-600" />
            <p className="mt-4 text-3xl font-bold text-ink">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>
      <section className="mt-8 rounded-2xl border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line p-5">
          <h2 className="font-semibold text-ink">Latest enquiries</h2>
          <Link href="/admin/enquiries" className="flex items-center gap-1 text-sm font-medium text-brand-700">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        {enquiries.length ? (
          <ul className="divide-y divide-line">
            {enquiries.slice(0, 6).map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 p-5 text-sm">
                <div className="min-w-0">
                  <p className="font-medium text-ink">
                    {e.name} · <a href={`tel:${e.phone}`} className="text-brand-700">{e.phone}</a>
                  </p>
                  <p className="truncate text-muted">{e.subject}</p>
                </div>
                <span className="text-xs text-muted">{formatDate(e.createdAt)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-5 text-sm text-muted">No enquiries yet. Leads from website forms will appear here.</p>
        )}
      </section>
    </>
  );
}
