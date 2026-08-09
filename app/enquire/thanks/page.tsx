import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { RESPONSE_PROMISE } from "@/lib/email";

export const metadata: Metadata = {
  title: "Enquiry received",
  robots: { index: false },
};

/** Clear next-step copy, per spec: the customer (or agent) knows exactly what happens now. */
export default function ThanksPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#F5A623]/40 bg-[#F5A623]/10 text-2xl">
            ⚡
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#F0EDE8] mb-4">
            Enquiry received.
          </h1>
          <p className="text-[#6B6B6B] leading-relaxed mb-2">
            A confirmation email with everything you sent is on its way now. Blake will come back
            to you <span className="text-[#F5A623] font-medium">{RESPONSE_PROMISE}</span> with a
            written fixed-price quote — the quote is the invoice.
          </p>
          <p className="text-[#6B6B6B] leading-relaxed mb-10">
            Need us sooner? Call or text{" "}
            <a href="tel:0428653509" className="text-[#F5A623] hover:underline underline-offset-2">
              0428 653 509
            </a>
            .
          </p>
          <Link
            href="/"
            className="inline-block rounded-sm border border-white/10 px-6 py-3 text-sm text-[#F0EDE8] transition-colors hover:border-[#F5A623]/40 hover:text-[#F5A623]"
          >
            Back to the site
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
