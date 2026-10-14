import type { Property } from "./types";

export function formatPrice(p: Pick<Property, "price" | "listingType">) {
  const n = p.price;
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
