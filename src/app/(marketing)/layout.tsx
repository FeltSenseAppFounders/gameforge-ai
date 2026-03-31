import type { Metadata } from "next";
import { Navbar } from "@/features/landing-page/Navbar";
import { Footer } from "@/features/landing-page/Footer";

export const metadata: Metadata = {
  title: "PlayFoundry AI — Create Real Games With AI",
  description:
    "Describe your game to MAX. Watch it come to life in your browser — playable in seconds. AI-powered game creation platform.",
  keywords: [
    "AI game creator",
    "make games with AI",
    "Phaser.js game generator",
    "browser game builder",
    "AI game development",
    "no-code game maker",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://playfoundry.ai",
    siteName: "PlayFoundry AI",
    title: "PlayFoundry AI — Create Real Games With AI",
    description:
      "Describe your game to MAX. Watch it come to life in your browser — playable in seconds.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PlayFoundry AI — Create Real Games With AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayFoundry AI — Create Real Games With AI",
    description:
      "Describe your game to MAX. Watch it come to life in your browser — playable in seconds.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PlayFoundry AI",
  applicationCategory: "GameApplication",
  description: "AI-powered game creation platform. Describe a game and get a playable browser game in seconds.",
  offers: {
    "@type": "Offer",
    price: "0",
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
