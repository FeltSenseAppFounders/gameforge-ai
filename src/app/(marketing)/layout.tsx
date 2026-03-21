import type { Metadata } from "next";
import { Navbar } from "@/features/landing-page/Navbar";
import { Footer } from "@/features/landing-page/Footer";

export const metadata: Metadata = {
  title: "FeltSense Clinic — AI-Powered Reception, Always On",
  description:
    "Smart AI receptionist for dental practices. Answer every call, book appointments, verify insurance, and collect payments automatically. YC W26.",
  keywords: [
    "dental AI receptionist",
    "dental practice automation",
    "AI phone answering",
    "dental appointment booking",
    "dental insurance verification",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://feltsenseclinic.com",
    siteName: "FeltSense Clinic",
    title: "FeltSense Clinic — AI-Powered Reception, Always On",
    description:
      "Never miss a patient call again. Smart AI receptionist for dental practices.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FeltSense Clinic — AI receptionist for dental practices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FeltSense Clinic — AI-Powered Reception, Always On",
    description:
      "Never miss a patient call again. Smart AI receptionist for dental practices.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FeltSense Clinic",
  applicationCategory: "BusinessApplication",
  description: "AI-powered receptionist for dental practices",
  offers: {
    "@type": "Offer",
    price: "299",
    priceCurrency: "USD",
  },
  operatingSystem: "Web",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
