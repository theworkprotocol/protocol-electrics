import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions about solar installation, electrical work, EV chargers, and air conditioning on the Sunshine Coast. Protocol Electrics answers the questions clients ask most.",
  openGraph: {
    title: "FAQ | Protocol Electrics",
    url: "https://www.protocolelectrics.com.au/faq",
  },
};

export default function FAQLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
