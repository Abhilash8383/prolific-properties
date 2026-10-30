import type { ListingType } from "./types";

export function priceToRupees(price: string | number): number | null {
  if (typeof price === "number") return Number.isFinite(price) && price >= 0 ? price : null;
  const match = price.trim().match(/^(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)\s*(lakhs?|lacs?|crores?|cr|l|c)?$/i);
  if (!match) return null;
  const amount = Number(match[1].replaceAll(",", ""));
  const unit = match[2]?.toLowerCase() ?? "";
  const multiplier = unit.startsWith("c") ? 1e7 : unit.startsWith("l") ? 1e5 : 1;
  const rupees = amount * multiplier;
  return Number.isFinite(rupees) && rupees >= 0 ? rupees : null;
}

export function formatPrice(p: { price: string | number; listingType: ListingType }) {
  const n = priceToRupees(p.price);
  if (n === null) return String(p.price).trim();
  const value =
    n >= 1e7
      ? `₹${+(n / 1e7).toFixed(2)} Cr`
      : n >= 1e5
        ? `₹${+(n / 1e5).toFixed(2)} Lakh`
        : `₹${n.toLocaleString("en-IN")}`;
  return p.listingType === "Rent" ? `${value}/mo` : value;
}

export const budgets = [
  { value: "0-10000000", label: "Under ₹1 Cr" },
  { value: "10000000-15000000", label: "₹1 Cr - ₹1.5 Cr" },
  { value: "15000000-25000000", label: "₹1.5 Cr - ₹2.5 Cr" },
  { value: "25000000-", label: "Above ₹2.5 Cr" },
];

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
