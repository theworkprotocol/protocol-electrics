import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Job",
  description:
    "Book an electrical, solar, EV charger, or air conditioning job on the Sunshine Coast. Upload photos, get an instant AI estimate, and receive a confirmed fixed quote within 24 hours.",
  openGraph: {
    title: "Book a Job | Protocol Electrics",
    description:
      "Book an electrical, solar, EV charger, or air conditioning job on the Sunshine Coast. Upload photos, get an instant AI estimate, and receive a confirmed fixed quote within 24 hours.",
    url: "https://www.protocolelectrics.com.au/book",
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
