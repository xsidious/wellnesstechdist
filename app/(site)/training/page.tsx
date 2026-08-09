import type { Metadata } from "next";
import { TrainingContent } from "@/components/training/TrainingContent";

export const metadata: Metadata = {
  title: "Practitioner Training — Icoone, Exosomes & Peptides — Wellness Tech Bio Distribution",
  description:
    "Fee-based online and live training for licensed practitioners. Master Icoone body & face treatments, exosome aesthetic protocols, and peptide therapeutics.",
  openGraph: {
    title: "Practitioner Training — Wellness Tech Bio Distribution",
    description: "Fee-based CE-style training in Icoone, Exosomes and Peptides for licensed practitioners.",
  },
};

export default function TrainingPage() {
  return <TrainingContent />;
}
