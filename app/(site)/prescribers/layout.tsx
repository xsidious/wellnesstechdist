import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Prescriber",
  description:
    "Licensed physicians: create a Wellness Tech Distribution account, verify NPI, and get approved for compounded therapies and marketplace ordering.",
  openGraph: {
    title: "Become a Prescriber — Wellness Tech Distribution",
    description: "Sign up with NPI verification. Pending approval until our team verifies credentials.",
  },
};

export default function PrescribersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
