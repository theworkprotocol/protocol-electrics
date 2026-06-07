import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  description: "Your payment was cancelled. No charge was made.",
};

export default function PayCancelledPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mx-auto">
            <span className="text-[#6B6B6B] text-2xl">×</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#F0EDE8] mb-3">Payment cancelled.</h1>
            <p className="text-[#6B6B6B] leading-relaxed">
              No charge was made. If you ran into an issue or have questions, get in touch.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn-glow relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#F5A623] text-[#0A0A0A] font-semibold text-sm tracking-wide hover:bg-[#FFD580] transition-colors rounded-sm z-0"
            >
              Get in Touch
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/10 text-[#6B6B6B] hover:text-[#F0EDE8] hover:border-white/20 font-semibold text-sm tracking-wide transition-colors rounded-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
