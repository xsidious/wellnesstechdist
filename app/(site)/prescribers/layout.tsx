import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Prescriber",
  description:
    "Licensed physicians: request prescriber access to Wellness Tech Bio Distribution's 503A & 503B compounded GLP-1, peptides, NAD+ and hormone therapy network.",
  openGraph: {
    title: "Become a Prescriber — Wellness Tech Bio Distribution",
    description: "Start your prescriber onboarding. Verified physicians only.",
  },
};

export default function PrescribersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
