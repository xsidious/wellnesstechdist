import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Program",
  description:
    "Join the Wellness Tech Bio Distribution affiliate network. Connect clinics with 100+ compounded Rx products. Competitive commissions and territory protection.",
  openGraph: {
    title: "Affiliate Program — Wellness Tech Bio Distribution",
    description: "Earn alongside the premier compounded Rx resource.",
  },
};

export default function AffiliatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
