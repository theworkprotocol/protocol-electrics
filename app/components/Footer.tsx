import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-auto overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#F5A623]/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#F5A623]" />
              <span className="text-sm font-semibold tracking-[0.15em] uppercase text-[#F0EDE8]">
                Protocol <span className="text-[#F5A623]">Electrics</span>
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-xs">
              Premium residential electrical contracting on the Sunshine Coast. Solar, EV, AC, and maintenance — done to a standard worth recommending.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <span className="text-xs text-[#6B6B6B]">QBCC Licensed</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="text-xs text-[#6B6B6B]">CEC Accredited</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="text-xs text-[#6B6B6B]">ARCtick</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-5">Services</p>
            <ul className="space-y-3">
              {["Electrical Contracting", "Solar Installation", "EV Charger Installation", "Maintenance", "Air Conditioning"].map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-xs text-[#6B6B6B] hover:text-[#F5A623] transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-5">Company</p>
            <ul className="space-y-3">
              {[
                { label: "About", href: "/about" },
                { label: "Projects", href: "/projects" },
                { label: "Contact", href: "/contact" },
                { label: "Get an Estimate", href: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-xs text-[#6B6B6B] hover:text-[#F5A623] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2">
              <a href="tel:0428653509" className="flex items-center gap-2 text-xs text-[#6B6B6B] hover:text-[#F5A623] transition-colors">
                <span className="text-[#F5A623]/60">📞</span> 0428 653 509
              </a>
              <a href="mailto:admin@protocolelectrics.com.au" className="flex items-center gap-2 text-xs text-[#6B6B6B] hover:text-[#F5A623] transition-colors">
                <span className="text-[#F5A623]/60">✉</span> admin@protocolelectrics.com.au
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#6B6B6B]/60">
            © {new Date().getFullYear()} Protocol Electrics · Sunshine Coast, QLD
          </p>
          <p className="text-xs text-[#6B6B6B]/40 tracking-widest uppercase">Built for precision.</p>
        </div>
      </div>
    </footer>
  );
}
