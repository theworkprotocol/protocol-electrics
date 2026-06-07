"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password.");
        setLoading(false);
        return;
      }
      router.push(from);
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      {/* Background */}
      <div className="dot-grid absolute inset-0 opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,_rgba(13,27,42,0.8)_0%,_transparent_70%)]" />
      <div className="animate-pulse-glow absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#F5A623]/4 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="relative w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-[#F5A623]" />
            <span className="absolute inset-0 rounded-full bg-[#F5A623] animate-ping opacity-30" />
          </div>
          <span className="text-sm font-semibold tracking-[0.15em] uppercase text-[#F0EDE8]">
            Protocol <span className="text-[#F5A623]">Electrics</span>
          </span>
        </div>

        <div className="card-gradient p-8 rounded-sm">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#F5A623] mb-1.5">Admin Access</p>
            <h1 className="text-xl font-bold text-[#F0EDE8]">Sign in to dashboard</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                className="w-full bg-[#0D1B2A]/60 border border-white/8 focus:border-[#F5A623]/40 text-[#F0EDE8] text-sm px-4 py-3 rounded-sm outline-none transition-all placeholder:text-[#6B6B6B]/40"
              />
              {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="btn-glow relative w-full py-3 bg-[#F5A623] text-[#0A0A0A] font-bold text-sm tracking-wide hover:bg-[#FFD580] disabled:opacity-50 transition-colors rounded-sm z-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border border-[#0A0A0A]/40 border-t-transparent animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#6B6B6B]/40 mt-6 tracking-widest uppercase">
          Protocol Electrics · Admin
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
