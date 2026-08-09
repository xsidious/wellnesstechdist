import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Wellness Tech Distribution — Compounded Therapies & Clinical Platform",
    template: "%s — Wellness Tech Distribution",
  },
  description:
    "Wellness Tech Distribution partners with licensed physicians and medical practices to deliver compounded peptide therapies, GLP-1 products, Korean exosomes, aesthetic devices, and an end-to-end B2B clinical platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
