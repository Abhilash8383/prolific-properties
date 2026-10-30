import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { PRIVACY_INTRO, PRIVACY_SECTIONS, PRIVACY_UPDATED } from "@/lib/legal";
import { seoMetadata } from "@/lib/seo";

export const metadata: Metadata = seoMetadata({
  title: "Privacy Policy",
  description: "How Prolific Properties collects, uses, shares and protects personal information from website visitors and property enquiries.",
  path: "/privacy-policy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated={PRIVACY_UPDATED}
      intro={PRIVACY_INTRO}
      sections={PRIVACY_SECTIONS}
      relatedHref="/terms"
      relatedLabel="Read Terms & Conditions"
    />
  );
}
