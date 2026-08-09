import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Wellness Tech Bio Distribution — Compounded Rx Resource for Practitioners",
    template: "%s — Wellness Tech Bio Distribution",
  },
  description:
    "503A & 503B compounded GLP-1s, peptides, NAD+ and hormone therapy resource for licensed physicians, medical practices, and accredited sales affiliates.",
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
