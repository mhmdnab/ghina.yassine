import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { site } from "@/lib/site";
import { ALLOW_INDEXING, SITE_URL } from "@/lib/site-url";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  // The headline (Fraunces) is the Largest Contentful Paint; let it have the bandwidth first.
  // Body text shows in a metric-matched fallback for a moment, so nothing shifts.
  preload: false,
});

const title = "Dr. Ghina Yassine | Gentle Dental Clinic in Achrafieh, Beirut";
const description = `Gentle, unhurried dental care for adults, nervous patients and children in Achrafieh, Beirut. Rated ${site.rating} from ${site.reviewCount} Google reviews. Book on WhatsApp.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: site.clinicName,
  category: "health",
  alternates: { canonical: "/" },
  robots: ALLOW_INDEXING ? undefined : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: site.clinicName,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
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
