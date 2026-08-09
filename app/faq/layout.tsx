import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd, faqJsonLd } from "@/lib/schema";
import { faqData } from "./data";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions about electrical work, EV chargers, and air conditioning on the Sunshine Coast. Protocol Electrics answers the questions clients ask most.",
  openGraph: {
    title: "FAQ | Protocol Electrics",
    url: "https://www.protocolelectrics.com.au/faq",
  },
};

export default function FAQLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Server-rendered so agents see it without JS — the page itself is a client component. */}
      <JsonLd data={faqJsonLd(faqData.flatMap((c) => c.items))} />
      {children}
    </>
  );
}
