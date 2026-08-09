import type { Metadata } from "next";
import { FaqContent, DEFAULT_FAQ_CATEGORIES } from "@/components/faq/FaqContent";
import { getContentBlock } from "@/lib/content";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Wellness Tech Bio Distribution",
  description:
    "Find answers about account setup, product catalog, ordering, training, affiliate programs and compliance for Wellness Tech Bio Distribution.",
  openGraph: {
    title: "FAQ — Wellness Tech Bio Distribution",
    description: "Answers to common questions for practitioners and partners.",
  },
};

export default async function FaqPage() {
  const block = await getContentBlock("faq.items", {
    categories: DEFAULT_FAQ_CATEGORIES,
  });
  const categories =
    block.categories && block.categories.length > 0
      ? block.categories
      : DEFAULT_FAQ_CATEGORIES;

  return <FaqContent categories={categories} />;
}
