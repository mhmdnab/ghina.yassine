import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

// Basic metadata for now; full SEO, Open Graph and JSON-LD come in Phase 3.
export const metadata: Metadata = {
  title: "Dr. Ghina Yassine | Gentle Dental Clinic in Achrafieh, Beirut",
  description:
    "Gentle, unhurried dental care for adults, nervous patients and children in Achrafieh, Beirut. Rated 4.9 on Google. Book on WhatsApp.",
};

export const viewport: Viewport = {
  themeColor: "#fbf7f1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
