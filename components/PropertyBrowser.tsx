"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { LayoutGrid, List, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import { inputClass } from "./ui";
import { budgets, priceToRupees } from "@/lib/format";
import { isSoldOut, variantMaxSqft, variantPrice } from "@/lib/variants";
import { CATEGORIES, STATUSES, type Property } from "@/lib/types";

const sorts = {
  newest: "Newest first",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "size-desc": "Size: Largest first",
};

export function PropertyBrowser({ properties }: { properties: Property[] }) {
  const cities = [...new Set(properties.map((p) => p.city))];
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const get = (k: string) => params.get(k) ?? "";
  function set(k: string, v: string) {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    router.replace(`${pathname}?${next}`, { scroll: false });
  }

  const q = get("q").toLowerCase();
  const activeCount = ["q", "type", "category", "city", "status", "beds", "budget"].filter((k) => params.get(k)).length;
  const [min, max] = get("budget").split("-").map(Number);
  const sort = (get("sort") || "newest") as keyof typeof sorts;

  const results = properties
    .filter((p) => {
      const variants = p.variants?.length ? p.variants : [p];
      return (
        (!q || [p.title, p.area, p.city, p.developer].some((s) => s.toLowerCase().includes(q))) &&
        (!get("type") || p.listingType === get("type")) &&
        (!get("category") || p.category === get("category")) &&
        (!get("city") || p.city === get("city")) &&
        variants.some((v) =>
          (!get("status") || v.status === get("status")) &&
          (!get("beds") || v.bedrooms >= Number(get("beds"))) &&
          (!get("budget") || ((price) => price !== null && price >= min && (!max || price <= max))(priceToRupees(variantPrice(v))))
        )
      );
    })
    .sort((a, b) => {
      if (sort === "price-asc" || sort === "price-desc") {
        const lowest = (p: Property) => {
          const variants = p.variants?.length ? p.variants : [p];
          const available = variants.filter((v) => !isSoldOut(v));
          return Math.min(...(available.length ? available : variants).map((v) => priceToRupees(variantPrice(v)) ?? Infinity));
        };
        const aPrice = lowest(a);
        const bPrice = lowest(b);
        if (!Number.isFinite(aPrice)) return Number.isFinite(bPrice) ? 1 : 0;
        if (!Number.isFinite(bPrice)) return -1;
        return sort === "price-asc" ? aPrice - bPrice : bPrice - aPrice;
      }
      return sort === "size-desc"
        ? Math.max(...(b.variants?.length ? b.variants : [b]).map(variantMaxSqft)) - Math.max(...(a.variants?.length ? a.variants : [a]).map(variantMaxSqft))
        : Number(b.placements.includes("pinned")) - Number(a.placements.includes("pinned")) || b.createdAt.localeCompare(a.createdAt);
    });

  const select = (k: string, label: string, options: (string | { value: string; label: string })[]) => (
    <label className="grid gap-1.5 text-sm font-medium text-ink">
      {label}
      <select value={get(k)} onChange={(e) => set(k, e.target.value)} className={inputClass}>
        <option value="">Any</option>
        {options.map((o) =>
          typeof o === "string" ? (
            <option key={o}>{o}</option>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
      </select>
    </label>
  );

  return (
    <div className="container-x grid gap-8 py-8 md:py-12 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside
        onClick={(e) => e.target === e.currentTarget && setShowFilters(false)}
        className={`${showFilters ? "fixed inset-0 z-60 flex justify-end bg-ink/40 backdrop-blur-sm" : "hidden"} lg:static lg:z-auto lg:block lg:bg-transparent lg:backdrop-blur-none`}
      >
        <div className="flex h-full w-full max-w-sm flex-col gap-5 overflow-y-auto bg-white p-5 lg:sticky lg:top-24 lg:h-auto lg:max-w-none lg:overflow-visible lg:rounded-2xl lg:border lg:border-line lg:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink">Advanced search</h2>
            <div className="flex items-center gap-3">
              <button onClick={() => router.replace(pathname, { scroll: false })} className="flex items-center gap-1 text-xs font-medium text-brand-700">
                <RotateCcw className="size-3" /> Reset
              </button>
              <button onClick={() => setShowFilters(false)} aria-label="Close filters" className="rounded-lg p-1 text-muted lg:hidden">
                <X className="size-5" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute top-3.5 left-3.5 size-4 text-muted" />
            <input
              key={get("q")}
              defaultValue={get("q")}
              onKeyDown={(e) => e.key === "Enter" && set("q", e.currentTarget.value)}
              onBlur={(e) => set("q", e.currentTarget.value)}
              placeholder="Project, area, developer"
              className={`${inputClass} pl-10`}
            />
          </div>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface p-1 text-sm font-medium">
            {["", "Sale", "Rent"].map((t) => (
              <button
                key={t}
                onClick={() => set("type", t)}
                className={`rounded-lg py-2 ${get("type") === t ? "bg-white text-brand-700 shadow-sm" : "text-muted"}`}
              >
                {t ? `For ${t}` : "All"}
              </button>
            ))}
          </div>
          {select("category", "Property type", [...CATEGORIES])}
          {select("city", "City", cities)}
          {select("budget", "Budget", budgets)}
          {select("status", "Possession status", [...STATUSES])}
          <div className="grid gap-1.5 text-sm font-medium text-ink">
            Bedrooms
            <div className="grid grid-cols-5 gap-1.5">
              {["", "1", "2", "3", "4"].map((b) => (
                <button
                  key={b}
                  onClick={() => set("beds", b)}
                  className={`rounded-lg border py-2 ${get("beds") === b ? "border-brand-600 bg-brand-600 text-white" : "border-line text-muted"}`}
                >
                  {b ? `${b}+` : "Any"}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowFilters(false)}
            className="sticky bottom-0 mt-auto rounded-xl bg-brand-600 py-3.5 font-semibold text-white shadow-lg lg:hidden"
          >
            Show {results.length} {results.length === 1 ? "property" : "properties"}
          </button>
        </div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted">
            <span className="font-semibold text-ink">{results.length}</span> properties found
          </p>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <button
              onClick={() => setShowFilters(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium sm:flex-none lg:hidden"
            >
              <SlidersHorizontal className="size-4" /> Filters
              {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-xs text-white">{activeCount}</span>}
            </button>
            <select value={sort} onChange={(e) => set("sort", e.target.value)} className={`${inputClass} flex-1 py-2.5 sm:w-auto sm:flex-none`}>
              {Object.entries(sorts).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <div className="hidden rounded-xl border border-line p-1 sm:flex">
              {(["grid", "list"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLayout(l)}
                  aria-label={`${l} view`}
                  className={`rounded-lg p-2 ${layout === l ? "bg-brand-600 text-white" : "text-muted"}`}
                >
                  {l === "grid" ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {results.length ? (
          <div className={`mt-6 grid gap-6 ${layout === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : ""}`}>
            {results.map((p) => (
              <PropertyCard key={p.slug} p={p} layout={layout} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-line py-20 text-center">
            <p className="text-lg font-semibold text-ink">No properties match your filters</p>
            <p className="mt-1 text-muted">Try widening your budget or clearing some filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
