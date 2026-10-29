import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { seoMetadata } from "@/lib/seo";

export const metadata: Metadata = seoMetadata({ title: "Privacy Policy", description: "How Prolific Properties handles information submitted through our website and property enquiry forms.", path: "/privacy-policy" });

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      sections={[
        ["What we collect", "When you submit an enquiry we collect your name, phone number, email and message so our advisors can respond to you."],
        ["How we use it", "Your details are used only to contact you about properties and services you've asked about. We never sell your personal information."],
        ["Communication", "By submitting a form you agree to be contacted via call, SMS, email or WhatsApp. You can opt out at any time by letting us know."],
        ["Your rights", "You can ask us to access, correct or delete your personal data by emailing our team."],
      ]}
    />
  );
}
