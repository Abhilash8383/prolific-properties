import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, Building2, MapPin, Ruler } from "lucide-react";
import { formatPrice, priceToRupees } from "@/lib/format";
import { variantPrice, variantSize } from "@/lib/variants";
import type { Property } from "@/lib/types";

export function PropertyCard({ p, layout = "grid" }: { p: Property; layout?: "grid" | "list" }) {
  const list = layout === "list";
  const variants = p.variants?.length ? p.variants : [p];
  const lowest = variants.reduce((best, v) => (priceToRupees(variantPrice(v)) ?? Infinity) < (priceToRupees(variantPrice(best)) ?? Infinity) ? v : best, variants[0]);
  const statuses = new Set(variants.map((v) => v.status));
  return (
    <Link
      href={`/properties/${p.slug}`}
      className={`group flex overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/10 ${
        list ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <div className={`relative overflow-hidden bg-surface ${list ? "aspect-4/3 sm:aspect-auto sm:w-80 sm:shrink-0" : "aspect-4/3"}`}>
        {p.images[0] && (
        <Image
          src={p.images[0]}
          alt={p.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink">{statuses.size > 1 ? "Multiple statuses" : p.status}</span>
        {(p.placements.includes("homeFeatured") || p.placements.includes("pinned")) && (
          <span className="absolute top-3 right-3 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">Featured</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <MapPin className="size-3.5 shrink-0" /> <span className="truncate">{p.area}, {p.city}</span>
        </p>
        <h3 className="mt-2 text-lg font-semibold text-ink group-hover:text-brand-700">{p.title}</h3>
        <p className="text-sm text-muted">
          For {p.listingType} · {p.category} · {p.configurations}
        </p>
        {list && <p className="mt-3 line-clamp-2 text-sm text-muted">{p.summary}</p>}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4 text-sm whitespace-nowrap text-muted">
          {lowest.bedrooms > 0 && (
            <>
              <span className="flex items-center gap-1.5">
                <BedDouble className="size-4 text-brand-600" /> {lowest.bedrooms} Beds
              </span>
              <span className="flex items-center gap-1.5">
                <Bath className="size-4 text-brand-600" /> {lowest.bathrooms} Baths
              </span>
            </>
          )}
          <span className="flex items-center gap-1.5">
            <Ruler className="size-4 text-brand-600" /> {variantSize(lowest)}
          </span>
          {typeof lowest.units === "number" && <span className="flex items-center gap-1.5"><Building2 className="size-4 text-brand-600" /> {lowest.units} {lowest.units === 1 ? "unit" : "units"} available</span>}
        </div>
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <p className="text-xs text-muted">{p.listingType === "Rent" ? "Rent" : "Starting from"}</p>
            <p className="text-xl font-bold text-ink">{formatPrice({ price: variantPrice(lowest), listingType: p.listingType })}</p>
          </div>
          <span className="grid size-10 place-items-center rounded-full bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
