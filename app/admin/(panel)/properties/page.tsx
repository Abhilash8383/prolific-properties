import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { ConfirmButton, Toggle } from "@/components/admin/client";
import { PageHeader, primaryButton } from "@/components/admin/fields";
import { adminProperties } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";
import { deleteProperty, togglePropertyField } from "../../actions";

export const instant = false;

export default async function AdminProperties() {
  const properties = await adminProperties();
  return (
    <>
      <PageHeader
        title="Properties"
        text={`${properties.length} listings. Unpublished listings are hidden from the website.`}
        action={
          <Link href="/admin/properties/new" className={primaryButton}>
            <Plus className="size-4" /> Add property
          </Link>
        }
      />
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {properties.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                      {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="48px" className="object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <Link href={`/admin/properties/${p.id}`} className="font-semibold text-ink hover:text-brand-700">
                        {p.title}
                      </Link>
                      <p className="text-xs text-muted">
                        #{p.ref} · {p.area}, {p.city}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">
                  {p.category} · {p.listingType}
                </td>
                <td className="px-4 py-3 font-medium whitespace-nowrap text-ink">{formatPrice(p)}</td>
                <td className="px-4 py-3">
                  <Toggle label="Published" checked={p.published} onChange={togglePropertyField.bind(null, p.id, "published")} />
                </td>
                <td className="px-4 py-3">
                  <Toggle label="Featured" checked={p.featured} onChange={togglePropertyField.bind(null, p.id, "featured")} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4 whitespace-nowrap">
                    {p.published && (
                      <Link href={`/properties/${p.slug}`} target="_blank" className="text-muted hover:text-ink" aria-label="View on site">
                        <ExternalLink className="size-4" />
                      </Link>
                    )}
                    <Link href={`/admin/properties/${p.id}`} className="text-sm font-medium text-brand-700 hover:underline">
                      Edit
                    </Link>
                    <ConfirmButton action={deleteProperty.bind(null, p.id)} confirm={`Delete "${p.title}"? This cannot be undone.`}>
                      Delete
                    </ConfirmButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!properties.length && <p className="p-8 text-center text-muted">No properties yet.</p>}
      </div>
    </>
  );
}
