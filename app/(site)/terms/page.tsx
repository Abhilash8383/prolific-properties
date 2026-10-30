import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { TERMS_INTRO, TERMS_SECTIONS, TERMS_UPDATED } from "@/lib/legal";
import { seoMetadata } from "@/lib/seo";

export const metadata: Metadata = seoMetadata({
  title: "Terms & Conditions",
  description: "Terms for using the Prolific Properties website, property information, enquiries and related services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated={TERMS_UPDATED}
      intro={TERMS_INTRO}
      sections={TERMS_SECTIONS}
      relatedHref="/privacy-policy"
      relatedLabel="Read Privacy Policy"
    />
  );
}
