import type { Metadata } from "next";
import { DownloadsSection } from "@/components/home/DownloadsSection";
import { ResourcesSection } from "@/components/home/ResourcesSection";
import { RegistrationSection } from "@/components/home/RegistrationSection";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeProofStrip } from "@/components/home/HomeProofStrip";
import { HomePathsSection } from "@/components/home/HomePathsSection";
import { HomeValueSection } from "@/components/home/HomeValueSection";
import { HomeVerticalsSection } from "@/components/home/HomeVerticalsSection";
import { HomeCategoriesSection } from "@/components/home/HomeCategoriesSection";
import { HomeProcessSection } from "@/components/home/HomeProcessSection";
import { HomeDifferentiatorSection } from "@/components/home/HomeDifferentiatorSection";
import { HomeAudienceSection } from "@/components/home/HomeAudienceSection";
import { HomeCtaBand } from "@/components/home/HomeCtaBand";

export const metadata: Metadata = {
  title: "Wellness Tech Bio Distribution — Compounded Rx Resource for Practitioners",
  description:
    "503A & 503B compounded GLP-1s, peptides, NAD+ and hormone therapies for licensed physicians, clinics, and accredited sales affiliates.",
  openGraph: {
    title: "Wellness Tech Bio Distribution",
    description: "100+ compounded Rx products. Physician-supervised. Practitioner-only.",
  },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeProofStrip />
      <HomePathsSection />
      <HomeValueSection />
      <HomeVerticalsSection />
      <HomeCategoriesSection />
      <HomeAudienceSection />
      <HomeProcessSection />
      <HomeDifferentiatorSection />
      <DownloadsSection />
      <ResourcesSection />
      <RegistrationSection />
      <HomeCtaBand />
    </>
  );
}
