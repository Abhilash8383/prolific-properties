"use client";

import { useState } from "react";
import { Bath, BedDouble, CalendarDays, Car, Check, Ruler } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { configurationLabel, variantPrice, variantSize } from "@/lib/variants";
import type { ListingType, PropertyVariant, Status } from "@/lib/types";

export type ConfigurationOption = Pick<PropertyVariant, "name" | "price" | "basePrice" | "sqft" | "sqftMax" | "floorPlans" | "features" | "description"> & {
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  units?: number | null;
  status: Status;
  availableFrom?: string;
};

export function ConfigurationExplorer({ options, listingType }: { options: ConfigurationOption[]; listingType: ListingType }) {
  const [selected, setSelected] = useState(0);
  const option = options[selected];
  if (!option) return null;
  const facts = [
    option.bedrooms ? { Icon: BedDouble, text: `${option.bedrooms} bedrooms` } : null,
    option.bathrooms ? { Icon: Bath, text: `${option.bathrooms} bathrooms` } : null,
    option.parking ? { Icon: Car, text: `${option.parking} parking` } : null,
    option.availableFrom ? { Icon: CalendarDays, text: `Available ${option.availableFrom}` } : null,
  ].filter((fact): fact is { Icon: typeof Bath; text: string } => fact !== null);
  const groups = Object.entries(option.features ?? {}).filter(([, items]) => items.length);

  return (
    <section id="homes" className="scroll-mt-28 rounded-3xl border border-line bg-white p-5 md:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-brand-700 uppercase">Homes & prices</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Choose a configuration</h2>
          <p className="mt-1 text-sm text-muted">Select an option to see its size, price and features.</p>
        </div>
        <span className="text-xs text-muted">{options.length} {options.length === 1 ? "option" : "options"}</span>
      </div>

      <div role="tablist" aria-label="Home configurations" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto border-b border-line pb-3">
        {options.map((item, index) => (
          <button
            key={`${item.name}-${index}`}
            id={`configuration-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={selected === index}
            aria-controls="configuration-panel"
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
              event.preventDefault();
              const next = (index + (event.key === "ArrowRight" ? 1 : -1) + options.length) % options.length;
              setSelected(next);
              document.getElementById(`configuration-tab-${next}`)?.focus();
            }}
            className={`shrink-0 rounded-xl border px-4 py-2.5 text-left text-sm transition ${selected === index ? "border-brand-600 bg-brand-50 font-semibold text-brand-700" : "border-line text-ink hover:border-brand-300"}`}
          >
            <span className="block">{item.name}</span>
            {options.filter((other) => other.name === item.name).length > 1 && <span className="mt-0.5 block text-xs font-normal opacity-80">{variantSize(item)}</span>}
          </button>
        ))}
      </div>

      <div id="configuration-panel" role="tabpanel" aria-labelledby={`configuration-tab-${selected}`} className="pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-ink">{option.name}</h3>
            <p className="mt-1 text-sm text-muted">{option.status}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-medium text-muted">{listingType === "Rent" ? "Rent from" : "Price from"}</p>
            <p className="mt-1 text-2xl font-bold text-brand-700">{formatPrice({ price: variantPrice(option), listingType })}</p>
            {option.basePrice && <p className="mt-1 text-xs text-muted">Base rate: {formatPrice({ price: option.basePrice, listingType })}</p>}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-xl bg-surface px-3 py-2 font-semibold text-ink"><Ruler className="size-4 text-brand-700" /> {variantSize(option)}</span>
          {facts.map(({ Icon, text }) => <span key={text} className="inline-flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-ink"><Icon className="size-4 text-brand-700" /> {text}</span>)}
        </div>

        {option.description && <details className="mt-5 rounded-xl bg-surface px-4 py-3 text-sm"><summary className="cursor-pointer font-semibold text-brand-700">Layout details</summary><p className="mt-3 leading-relaxed text-muted">{option.description}</p></details>}

        {!!option.floorPlans?.length && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-ink">Available floor plans</h4>
            <div className="mt-3 overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface text-muted"><tr><th className="px-4 py-3 font-medium">Plan</th><th className="px-4 py-3 font-medium">Size</th><th className="px-4 py-3 font-medium">Price</th></tr></thead>
                <tbody>{option.floorPlans.map((plan, index) => <tr key={`${plan.name}-${index}`} className="border-t border-line"><td className="px-4 py-3 font-medium text-ink">{plan.name}</td><td className="px-4 py-3 whitespace-nowrap text-muted">{plan.sqft.toLocaleString("en-IN")} ft²</td><td className="px-4 py-3 whitespace-nowrap font-semibold text-ink">{formatPrice({ price: plan.price, listingType })}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        )}

        {groups.length > 0 && (
          <details className="mt-6 border-t border-line pt-5">
            <summary className="cursor-pointer text-sm font-semibold text-brand-700">Show features & amenities</summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {groups.map(([group, items]) => <div key={group}><p className="text-xs font-semibold uppercase tracking-wide text-muted">{group}</p><ul className="mt-2 grid gap-1.5">{items.map((item) => <li key={item} className="flex items-start gap-2 text-sm text-ink"><Check className="mt-0.5 size-3.5 shrink-0 text-brand-700" /> {item}</li>)}</ul></div>)}
            </div>
          </details>
        )}
        <a href="#enquire" onClick={() => {
          const input = document.querySelector<HTMLSelectElement>('select[name="Configuration"]');
          if (input) input.value = configurationLabel(option);
        }} className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">Ask about this configuration</a>
      </div>
    </section>
  );
}
