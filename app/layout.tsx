import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Protocol Electrics | Premium Electrical Contracting",
  description:
    "High-end electrical contracting, solar installation, EV charger installation, and maintenance across Australia. Precision work for demanding projects.",
  keywords: ["electrician Queensland", "electrical contractor QLD", "solar installation Brisbane", "EV charger installation Queensland", "air conditioning installation QLD", "QBCC electrician", "Protocol Electrics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
