import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "503A & 503B Compliance",
  description:
    "Understanding the difference between 503A patient-specific compounding and 503B FDA-registered outsourcing. Reference for licensed practitioners.",
  openGraph: {
    title: "503A & 503B — Wellness Tech Bio Distribution",
    description: "Compounded Rx compliance reference.",
  },
};

export default function ComplianceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
