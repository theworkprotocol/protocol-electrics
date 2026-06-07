"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/assistant", label: "AI Assistant", icon: "◈" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="relative w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-[#F5A623]" />
            <span className="absolute inset-0 rounded-full bg-[#F5A623] animate-ping opacity-30" />
          </div>
          <div>
            <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[#F0EDE8] block leading-tight">
              Protocol <span className="text-[#F5A623]">Electrics</span>
            </span>
            <span className="text-[10px] text-[#6B6B6B] tracking-widest uppercase">Admin</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all ${
                active
                  ? "bg-[#F5A623]/10 text-[#F5A623] font-medium"
                  : "text-[#6B6B6B] hover:text-[#F0EDE8] hover:bg-white/3"
              }`}
            >
              <span className="text-xs opacity-70">{item.icon}</span>
              {item.label}
              {active && <span className="ml-auto w-1 h-1 rounded-full bg-[#F5A623]" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-white/5 pt-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs text-[#6B6B6B] hover:text-[#F0EDE8] hover:bg-white/3 transition-all"
        >
          <span className="opacity-70">↗</span>
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs text-[#6B6B6B] hover:text-red-400 hover:bg-red-400/5 transition-all text-left"
        >
          <span className="opacity-70">→</span>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070709] flex">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-white/5 flex-col">
        <SidebarContent />
      </aside>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile sidebar (slide-in) ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0A0A0A] border-r border-white/8 z-50 flex flex-col transition-transform duration-300 ease-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col gap-1.5 p-1.5"
            aria-label="Open menu"
          >
            <span className="block h-px w-5 bg-[#F0EDE8]" />
            <span className="block h-px w-5 bg-[#F0EDE8]" />
            <span className="block h-px w-3 bg-[#F0EDE8]" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#F0EDE8]">
              Protocol <span className="text-[#F5A623]">Electrics</span>
            </span>
          </div>

          <div className="w-8" /> {/* spacer */}
        </div>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
