import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PageHeader, secondaryButton } from "@/components/admin/fields";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { adminProperty } from "@/lib/admin-data";

export const instant = false;

export default async function EditProperty({ params }: PageProps<"/admin/properties/[id]">) {
  const p = await adminProperty((await params).id);
  if (!p) notFound();
  return (
    <>
      <PageHeader
        title={p.title}
        text={`Property #${p.ref}`}
        action={
          p.published && (
            <Link href={`/properties/${p.slug}`} target="_blank" className={secondaryButton}>
              <ExternalLink className="size-4" /> View on site
            </Link>
          )
        }
      />
      <PropertyForm p={p} />
    </>
  );
}
