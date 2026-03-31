import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const pricedown = localFont({
  src: "../../public/fonts/pricedown.woff",
  variable: "--font-pricedown",
  display: "swap",
  weight: "900",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlayFoundry AI — Create Real Games With AI",
  description:
    "Describe your game to MAX. Watch it come to life in your browser — playable in seconds. AI-powered game creation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pricedown.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-body text-neutral-300 bg-surface-dark antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
