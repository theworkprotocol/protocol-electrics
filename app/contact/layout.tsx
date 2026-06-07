import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get an Estimate",
  description:
    "Describe your electrical, solar, EV charger, or air conditioning job on the Sunshine Coast and get an AI-generated estimate instantly. Confirmed fixed quote within 24 hours.",
  openGraph: {
    title: "Get an Estimate | Protocol Electrics",
    description:
      "Describe your electrical, solar, EV charger, or air conditioning job on the Sunshine Coast and get an AI-generated estimate instantly. Confirmed fixed quote within 24 hours.",
    url: "https://www.protocolelectrics.com.au/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
