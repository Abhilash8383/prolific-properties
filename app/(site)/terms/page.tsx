import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      sections={[
        ["Information on this site", "Property details, prices, images and availability are provided by developers and owners and may change without notice. Please verify all details with our team before making any decision."],
        ["No offer or contract", "Nothing on this website constitutes a legal offer or contract. Bookings are governed solely by the agreement executed between the buyer and the developer or seller."],
        ["RERA", "We only list projects registered with the Odisha Real Estate Regulatory Authority where applicable. RERA numbers are shown on each project page."],
        ["Intellectual property", "All content, logos and design on this website belong to Prolific Properties or their respective owners and may not be reused without permission."],
      ]}
    />
  );
}
