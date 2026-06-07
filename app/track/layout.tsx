import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Job",
  description:
    "Track the status of your electrical job booking with Protocol Electrics. Enter your PE reference number.",
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
