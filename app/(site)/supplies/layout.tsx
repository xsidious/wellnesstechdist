import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aesthetic & Medical Supplies",
  description:
    "Distribution of aesthetic and medical supplies for clinics, med spas and physician practices — devices, consumables, injectables ancillaries and clinic essentials.",
  openGraph: {
    title: "Aesthetic & Medical Supplies — Wellness Tech Bio Distribution",
    description: "Wholesale aesthetic and medical supply distribution for licensed practices.",
  },
};

export default function SuppliesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
