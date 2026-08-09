import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import ParticleField from "./components/ParticleField";
import TiltEffect from "./components/TiltEffect";
import { businessJsonLd } from "@/lib/schema";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.protocolelectrics.com.au"),
  title: {
    default: "Protocol Electrics | Sunshine Coast Electrician",
    template: "%s | Protocol Electrics",
  },
  description:
    "Protocol Electrics is a QBCC licensed electrical contractor on the Sunshine Coast, QLD. Specialising in residential electrical, EV charger installation, and air conditioning. 10 years experience. No shortcuts.",
  keywords: [
    "Sunshine Coast electrician",
    "electrician Sunshine Coast",
    "EV charger installation Sunshine Coast",
    "air conditioning installation Sunshine Coast",
    "electrician Noosa",
    "electrician Buderim",
    "electrician Maroochydore",
    "QBCC electrician",
    "residential electrician Queensland",
    "Protocol Electrics",
  ],
  openGraph: {
    siteName: "Protocol Electrics",
    locale: "en_AU",
    type: "website",
  },
  verification: {
    google: "7dt_V_6aNEdOYgD6vOC5xh7o3xUXeFTSQEu5xh0ofWs",
  },
};

// One consistent business node site-wide — see lib/schema.tsx + agent-bookability-spec.md.
const jsonLd = businessJsonLd();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ParticleField />
        <TiltEffect />
        {children}
      </body>
    </html>
  );
}
