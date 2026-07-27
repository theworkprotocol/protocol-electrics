"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";

const GLYPHS = "!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function DecodeText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  function scramble() {
    if (timer.current) clearInterval(timer.current);
    let frame = 0;
    timer.current = setInterval(() => {
      frame += 1;
      const settled = Math.ceil(frame / 2);
      setDisplay(
        text
          .split("")
          .map((ch, i) =>
            ch === " " || i < settled ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]
          )
          .join("")
      );
      if (settled >= text.length && timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }, 28);
  }

  return (
    <span onMouseEnter={scramble} className="inline-block" style={{ minWidth: `${text.length * 0.62}em` }}>
      {display}
    </span>
  );
}

const links = [
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Areas" },
  { href: "/projects", label: "Projects" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glass bar */}
      <div className="border-b border-white/5 bg-black/55 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-[#F5A623] group-hover:scale-150 transition-transform duration-300" />
              <span className="absolute inset-0 rounded-full bg-[#F5A623] animate-ping opacity-30" />
            </div>
            <span className="text-sm font-semibold tracking-[0.15em] uppercase text-[#F0EDE8]">
              Protocol <span className="text-[#F5A623]">Electrics</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm tracking-wide transition-colors relative group ${
                  pathname === l.href ? "text-[#F0EDE8]" : "text-[#6B6B6B] hover:text-[#F0EDE8]"
                }`}
              >
                <DecodeText text={l.label} />
                <span className={`absolute -bottom-0.5 left-0 h-px bg-[#F5A623] transition-all duration-300 ${
                  pathname === l.href ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            ))}
            <Link
              href="/book"
              className="btn-glow relative text-sm font-semibold px-5 py-2 bg-[#F5A623] text-[#0A0A0A] hover:bg-[#FFD580] transition-colors rounded-sm tracking-wide z-0"
            >
              Book a Job
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className={`block h-px w-5 bg-[#F0EDE8] transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-px w-5 bg-[#F0EDE8] transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-px w-5 bg-[#F0EDE8] transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden border-b border-white/5 bg-[#0A0A0A]/95 backdrop-blur-xl transition-all duration-300 ${
        open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}>
        <div className="px-6 py-5 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-sm tracking-wide transition-colors ${
                pathname === l.href ? "text-[#F5A623]" : "text-[#6B6B6B] hover:text-[#F0EDE8]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="text-sm font-semibold px-5 py-3 bg-[#F5A623] text-[#0A0A0A] text-center rounded-sm tracking-wide"
          >
            Book a Job
          </Link>
        </div>
      </div>
    </header>
  );
}
