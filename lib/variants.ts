import { priceToRupees } from "./format";
type Option = { price: string; sqft: number; sqftMax?: number; floorPlans?: { sqft: number; sqftMax?: number; price: string | number }[] };

export function isSoldOut(v: { soldOut?: boolean; units?: number | null }): boolean {
  return v.soldOut === true || v.units === 0;
}

export function variantPrice(v: Option): string {
  const prices = [v.price, ...(v.floorPlans ?? []).map((plan) => String(plan.price))].filter((price) => priceToRupees(price) !== null);
  return prices.reduce((lowest, price) => (priceToRupees(price) ?? Infinity) < (priceToRupees(lowest) ?? Infinity) ? price : lowest, v.price);
}

export function variantMaxSqft(v: Option): number {
  return Math.max(v.sqft, v.sqftMax ?? 0, ...(v.floorPlans ?? []).map((plan) => plan.sqftMax ?? plan.sqft));
}

export function formatSizeRange(min: number, max = min): string {
  return `${min.toLocaleString("en-IN")}${max > min ? `–${max.toLocaleString("en-IN")}` : ""} ft²`;
}

export function variantSize(v: Option): string {
  return formatSizeRange(v.sqft, variantMaxSqft(v));
}

export function configurationLabel(v: Option & { name: string }): string {
  return `${v.name} · ${variantSize(v)}`;
}
