import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your payment has been received. Protocol Electrics will be in touch to confirm everything.",
};

export default function PaySuccessPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full border border-emerald-400/30 bg-emerald-400/10 flex items-center justify-center mx-auto">
            <span className="text-emerald-400 text-2xl font-bold">✓</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#F0EDE8] mb-3">Payment received.</h1>
            <p className="text-[#6B6B6B] leading-relaxed">
              Thanks — you&apos;ll get a receipt to your email shortly. We&apos;ll be in touch to confirm all the details.
            </p>
          </div>
          <div className="card-gradient p-5 text-left space-y-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B]">What happens next</p>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              A confirmation email is on its way. If you have any questions in the meantime, call us on{" "}
              <a href="tel:0428653509" className="text-[#F5A623] hover:underline">0428 653 509</a>.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#F0EDE8] transition-colors"
          >
            ← Back to homepage
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
