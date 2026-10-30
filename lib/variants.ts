import { priceToRupees } from "./format";
type Option = { price: string; sqft: number; sqftMax?: number; floorPlans?: { sqft: number; price: string | number }[] };

export function variantPrice(v: Option): string {
  const prices = [v.price, ...(v.floorPlans ?? []).map((plan) => String(plan.price))].filter((price) => priceToRupees(price) !== null);
  return prices.reduce((lowest, price) => (priceToRupees(price) ?? Infinity) < (priceToRupees(lowest) ?? Infinity) ? price : lowest, v.price);
}

export function variantMaxSqft(v: Option): number {
  return Math.max(v.sqft, v.sqftMax ?? 0, ...(v.floorPlans ?? []).map((plan) => plan.sqft));
}

export function variantSize(v: Option): string {
  const max = variantMaxSqft(v);
  return `${v.sqft.toLocaleString("en-IN")}${max > v.sqft ? `–${max.toLocaleString("en-IN")}` : ""} ft²`;
}

export function configurationLabel(v: Option & { name: string }): string {
  return `${v.name} · ${variantSize(v)}`;
}
