import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { ConfirmButton } from "@/components/admin/client";
import { PageHeader } from "@/components/admin/fields";
import { adminEnquiries } from "@/lib/admin-data";
import { ENQUIRY_STATUSES } from "@/lib/types";
import { deleteEnquiry, setEnquiryStatus } from "../../actions";

const badge = { new: "bg-brand-50 text-brand-700", contacted: "bg-amber-50 text-amber-700", closed: "bg-surface text-muted" };

export const instant = false;

export default async function AdminEnquiries({ searchParams }: PageProps<"/admin/enquiries">) {
  const { status } = await searchParams;
  const filter = typeof status === "string" && (ENQUIRY_STATUSES as readonly string[]).includes(status) ? status : undefined;
  const enquiries = await adminEnquiries(filter);

  return (
    <>
      <PageHeader title="Enquiries" text="Leads submitted through contact, property, tour and career forms." />
      <div className="mb-4 flex flex-wrap gap-2">
        {[undefined, ...ENQUIRY_STATUSES].map((s) => (
          <Link
            key={s ?? "all"}
            href={s ? `?status=${s}` : "?"}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${filter === s ? "bg-brand-600 text-white" : "bg-white text-muted ring-1 ring-line"}`}
          >
            {s ?? "All"}
          </Link>
        ))}
      </div>
      <div className="grid gap-4">
        {enquiries.map((e) => (
          <div key={e.id} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-ink">{e.name}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${badge[e.status]}`}>{e.status}</span>
                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-muted capitalize">{e.type}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{e.subject}</p>
              </div>
              <p className="text-xs text-muted">{new Date(e.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <a href={`tel:${e.phone}`} className="flex items-center gap-1.5 text-brand-700">
                <Phone className="size-4" /> {e.phone}
              </a>
              {e.email && (
                <a href={`mailto:${e.email}`} className="flex items-center gap-1.5 break-all text-brand-700">
                  <Mail className="size-4" /> {e.email}
                </a>
              )}
            </div>
            {(e.message || Object.keys(e.details).length > 0) && (
              <div className="mt-3 rounded-xl bg-surface p-3 text-sm text-ink/80">
                {Object.entries(e.details).map(([k, v]) => (
                  <p key={k}>
                    <span className="text-muted">{k}:</span> {v}
                  </p>
                ))}
                {e.message && <p className="mt-1 whitespace-pre-line">{e.message}</p>}
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {ENQUIRY_STATUSES.filter((s) => s !== e.status).map((s) => (
                <ConfirmButton
                  key={s}
                  action={setEnquiryStatus.bind(null, e.id, s)}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink capitalize hover:border-brand-300"
                >
                  Mark {s}
                </ConfirmButton>
              ))}
              <ConfirmButton action={deleteEnquiry.bind(null, e.id)} confirm="Delete this enquiry?" className="ml-auto text-xs font-medium text-red-600 hover:underline">
                Delete
              </ConfirmButton>
            </div>
          </div>
        ))}
        {!enquiries.length && <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">No enquiries here.</p>}
      </div>
    </>
  );
}
