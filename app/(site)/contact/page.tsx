import type { Metadata } from "next";
import { ContactContent } from "@/components/contact/ContactContent";
import { getContentBlock } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact & Practice Onboarding — Wellness Tech Bio Distribution",
  description:
    "Request access to the Wellness Tech Bio Distribution catalog. Practice verification, account setup, and clinical support for licensed physicians.",
  openGraph: {
    title: "Contact — Wellness Tech Bio Distribution",
    description: "Onboard your practice or request a quote.",
  },
};

export default async function ContactPage() {
  const contact = await getContentBlock("contact.info", {});
  return <ContactContent contact={contact} />;
}
