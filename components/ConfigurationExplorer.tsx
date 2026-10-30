"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  Baby,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  Droplets,
  Dumbbell,
  Fence,
  Flame,
  Gamepad2,
  Leaf,
  ParkingCircle,
  Ruler,
  Shield,
  Sofa,
  Sparkles,
  Trees,
  Waves,
  Wifi,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { isSoldOut, variantPrice, variantSize } from "@/lib/variants";
import type { FeatureGroup, ListingType, PropertyVariant, Status } from "@/lib/types";

export type ConfigurationOption = Pick<PropertyVariant, "name" | "price" | "basePrice" | "sqft" | "sqftMax" | "floorPlans" | "features" | "description" | "soldOut"> & {
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  units?: number | null;
  status: Status;
  availableFrom?: string;
};

const GROUP_ICONS: Record<FeatureGroup, LucideIcon> = {
  Interior: Sofa,
  Outdoor: Trees,
  Utilities: Zap,
  Other: Sparkles,
};

function amenityIcon(label: string, group: string): LucideIcon {
  const t = label.toLowerCase();
  if (/pool|swim/.test(t)) return Waves;
  if (/gym|fitness/.test(t)) return Dumbbell;
  if (/club/.test(t)) return Building2;
  if (/game|indoor game/.test(t)) return Gamepad2;
  if (/jog|track|garden|park|landscap|green/.test(t)) return Trees;
  if (/kid|play|child/.test(t)) return Baby;
  if (/power|backup|electric/.test(t)) return Zap;
  if (/water|rain|harvest|treatment|plumbing/.test(t)) return Droplets;
  if (/lift|elevat/.test(t)) return ArrowUpDown;
  if (/gat(e|ed)|secur|cctv|guard/.test(t)) return Shield;
  if (/park(ing)?|car/.test(t)) return ParkingCircle;
  if (/wifi|internet|broadband/.test(t)) return Wifi;
  if (/ac|air.?cond|hvac/.test(t)) return Wind;
  if (/gas|kitchen|stove/.test(t)) return Flame;
  if (/fence|compound|boundary/.test(t)) return Fence;
  if (/plant|tree|lawn/.test(t)) return Leaf;
  return GROUP_ICONS[(group as FeatureGroup)] ?? Sparkles;
}

export function ConfigurationExplorer({ options, listingType }: { options: ConfigurationOption[]; listingType: ListingType }) {
  const [selected, setSelected] = useState(0);
  const option = options[selected];
  if (!option) return null;
  const soldOut = isSoldOut(option);

  const facts = [
    { Icon: Ruler, text: variantSize(option) },
    option.bedrooms ? { Icon: BedDouble, text: `${option.bedrooms} bed${option.bedrooms === 1 ? "" : "s"}` } : null,
    option.bathrooms ? { Icon: Bath, text: `${option.bathrooms} bath${option.bathrooms === 1 ? "" : "s"}` } : null,
    option.parking ? { Icon: Car, text: `${option.parking} parking` } : null,
    option.availableFrom ? { Icon: CalendarDays, text: `Available ${option.availableFrom}` } : null,
  ].filter((fact): fact is { Icon: LucideIcon; text: string } => fact !== null);

  const groups = Object.entries(option.features ?? {}).filter(([, items]) => items.length) as [FeatureGroup, string[]][];
  const multi = options.length > 1;

  return (
    <section id="homes" className="scroll-mt-28 rounded-3xl border border-line bg-white p-5 md:p-7">
      <div>
        <p className="text-xs font-semibold tracking-widest text-brand-700 uppercase">Homes & prices</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">{multi ? "Home types" : option.name}</h2>
        {multi && <p className="mt-1 text-sm text-muted">Pick a home type to see size, price and amenities.</p>}
      </div>

      {multi && (
        <div role="tablist" aria-label="Home types" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {options.map((item, index) => {
            const active = selected === index;
            return (
              <button
                key={`${item.name}-${index}`}
                id={`home-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="home-panel"
                onClick={() => setSelected(index)}
                onKeyDown={(event) => {
                  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                  event.preventDefault();
                  const next = (index + (event.key === "ArrowRight" ? 1 : -1) + options.length) % options.length;
                  setSelected(next);
                  document.getElementById(`home-tab-${next}`)?.focus();
                }}
                className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition duration-200 ${
                  active
                    ? "border-brand-600 bg-brand-50 shadow-sm shadow-brand-900/5"
                    : "border-line bg-white hover:border-brand-300"
                }`}
              >
                <span className={`block text-sm ${active ? "font-semibold text-brand-700" : "font-medium text-ink"}`}>{item.name}</span>
                <span className={`mt-0.5 block text-xs ${active ? "text-brand-700/80" : "text-muted"}`}>
                  {isSoldOut(item) ? "Sold out" : formatPrice({ price: variantPrice(item), listingType })}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div
        key={selected}
        id="home-panel"
        role="tabpanel"
        aria-labelledby={multi ? `home-tab-${selected}` : undefined}
        className="reveal-in mt-6 space-y-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {multi && <h3 className="text-xl font-bold text-ink">{option.name}</h3>}
            <p className={`${multi ? "mt-1" : ""} text-sm text-muted`}>{option.status}</p>
            {soldOut && <span className="mt-2 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">Sold out</span>}
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-medium text-muted">{soldOut ? "Last listed price" : listingType === "Rent" ? "Rent from" : "Price from"}</p>
            <p className="mt-1 text-2xl font-bold text-brand-700">{formatPrice({ price: variantPrice(option), listingType })}</p>
            {option.basePrice && (
              <p className="mt-1 text-xs text-muted">Base rate: {formatPrice({ price: option.basePrice, listingType })}</p>
            )}
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {facts.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-2.5 rounded-2xl bg-surface px-3.5 py-3 text-sm text-ink">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white text-brand-700 shadow-sm shadow-brand-900/5">
                <Icon className="size-4" />
              </span>
              <span className="font-medium">{text}</span>
            </li>
          ))}
        </ul>

        {option.description.trim() && !/^Show this property on\b/i.test(option.description.trim()) && (
          <p className="text-sm leading-relaxed text-muted md:text-base">{option.description}</p>
        )}

        {!!option.floorPlans?.length && (
          <div>
            <h4 className="text-sm font-semibold text-ink">Floor plans</h4>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Plan</th>
                    <th className="px-4 py-3 font-medium">Size</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {option.floorPlans.map((plan, index) => (
                    <tr key={`${plan.name}-${index}`} className="border-t border-line">
                      <td className="px-4 py-3 font-medium text-ink">{plan.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted">{plan.sqft.toLocaleString("en-IN")} ft²</td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-ink">
                        {formatPrice({ price: plan.price, listingType })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {groups.length > 0 && (
          <div className="border-t border-line pt-6">
            <h4 className="text-sm font-semibold text-ink">Amenities & features</h4>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {groups.map(([group, items]) => {
                const GroupIcon = GROUP_ICONS[group] ?? Sparkles;
                return (
                  <div key={group}>
                    <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
                      <GroupIcon className="size-3.5 text-brand-700" />
                      {group}
                    </p>
                    <ul className="mt-3 grid gap-2">
                      {items.map((item) => {
                        const ItemIcon = amenityIcon(item, group);
                        return (
                          <li key={item} className="flex items-center gap-2.5 text-sm text-ink">
                            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                              <ItemIcon className="size-3.5" />
                            </span>
                            {item}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
