import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Reveal } from "../../components/Reveal";

const suburbs = [
  {
    slug: "noosa",
    name: "Noosa",
    region: "Noosa Heads & Noosaville",
    description: "Servicing Noosa Heads, Noosaville, Tewantin, and surrounds.",
    headline: "Electrician in Noosa",
    services: [
      { icon: "☀️", label: "Solar & battery storage" },
      { icon: "🔌", label: "EV charger installation" },
      { icon: "⚡", label: "Switchboard upgrades" },
      { icon: "❄️", label: "Air conditioning" },
      { icon: "🔧", label: "Fault finding & maintenance" },
    ],
    localNote:
      "From Noosa Heads to Tewantin, we handle residential electrical work across the Noosa area with the same standard we bring to every job.",
  },
  {
    slug: "buderim",
    name: "Buderim",
    region: "Buderim & Mountain Creek",
    description: "Servicing Buderim, Mountain Creek, Mooloolah Valley, and surrounds.",
    headline: "Electrician in Buderim",
    services: [
      { icon: "☀️", label: "Solar installation & battery" },
      { icon: "⚡", label: "Switchboard upgrades" },
      { icon: "⚡", label: "Safety switch installation" },
      { icon: "❄️", label: "Air conditioning" },
      { icon: "🔌", label: "EV charger installation" },
    ],
    localNote:
      "Buderim's north-facing rooftops make it one of the best areas on the Coast for solar. We've completed multiple installs in the area and know the local grid well.",
  },
  {
    slug: "maroochydore",
    name: "Maroochydore",
    region: "Maroochydore & Alexandra Headland",
    description: "Servicing Maroochydore, Alexandra Headland, Kuluin, and surrounds.",
    headline: "Electrician in Maroochydore",
    services: [
      { icon: "⚡", label: "Electrical contracting" },
      { icon: "⚡", label: "Switchboard upgrades" },
      { icon: "☀️", label: "Solar & battery" },
      { icon: "❄️", label: "Air conditioning" },
      { icon: "🔧", label: "Safety compliance" },
    ],
    localNote:
      "Close to the CBD and trade supply, Maroochydore jobs are fast to turn around. We're regularly in the area and can often accommodate same-week bookings.",
  },
  {
    slug: "mooloolaba",
    name: "Mooloolaba",
    region: "Mooloolaba & Kawana",
    description: "Servicing Mooloolaba, Bokarina, Wurtulla, Birtinya, and surrounds.",
    headline: "Electrician in Mooloolaba",
    services: [
      { icon: "🔌", label: "EV charger installation" },
      { icon: "☀️", label: "Solar & battery" },
      { icon: "❄️", label: "Air conditioning" },
      { icon: "🔧", label: "Rental property maintenance" },
      { icon: "🔧", label: "Fault finding" },
    ],
    localNote:
      "We handle a number of rental property maintenance contracts in Mooloolaba. Landlords and property managers get written inspection reports and same-day sign-off where possible.",
  },
  {
    slug: "sippy-downs",
    name: "Sippy Downs",
    region: "Sippy Downs & Palmview",
    description: "Servicing Sippy Downs, Palmview, Caloundra West, and surrounds.",
    headline: "Electrician in Sippy Downs",
    services: [
      { icon: "⚡", label: "New build electrical" },
      { icon: "❄️", label: "Air conditioning" },
      { icon: "☀️", label: "Solar & battery" },
      { icon: "🔌", label: "EV charger installation" },
      { icon: "⚡", label: "Switchboard upgrades" },
    ],
    localNote:
      "Sippy Downs and Palmview are growing fast. We work with new builds and renovations in the area, and know the local estate layouts and supply requirements.",
  },
  {
    slug: "coolum-beach",
    name: "Coolum Beach",
    region: "Coolum Beach & Peregian",
    description: "Servicing Coolum Beach, Peregian Beach, Yaroomba, and surrounds.",
    headline: "Electrician in Coolum Beach",
    services: [
      { icon: "☀️", label: "Solar installation & battery" },
      { icon: "⚡", label: "Switchboard upgrades" },
      { icon: "❄️", label: "Air conditioning" },
      { icon: "🔌", label: "EV charger installation" },
      { icon: "⚡", label: "Safety switch installation" },
    ],
    localNote:
      "Coolum's coastal homes often have older wiring that needs upgrading before solar can be installed. We assess everything before quoting and never recommend work that isn't needed.",
  },
];

const credentials = [
  { label: "Licence", value: "QBCC Licensed Contractor" },
  { label: "Solar", value: "CEC Accredited Installer" },
  { label: "AC", value: "ARCtick Licensed" },
  { label: "Experience", value: "10 Years in the Trade" },
  { label: "Based", value: "Sunshine Coast, QLD" },
];

export async function generateStaticParams() {
  return suburbs.map((s) => ({ suburb: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ suburb: string }>;
}): Promise<Metadata> {
  const { suburb: slugParam } = await params;
  const suburb = suburbs.find((s) => s.slug === slugParam);
  if (!suburb) return {};
  return {
    title: `Electrician ${suburb.name}`,
    description: `Licensed electrician servicing ${suburb.region}. Solar, EV chargers, switchboards, air conditioning, and maintenance. Protocol Electrics — QBCC licensed, CEC accredited.`,
    openGraph: {
      title: `Electrician ${suburb.name} | Protocol Electrics`,
      description: `Licensed electrician servicing ${suburb.region}. Solar, EV chargers, switchboards, air conditioning, and maintenance.`,
      url: `https://www.protocolelectrics.com.au/locations/${suburb.slug}`,
    },
  };
}

export default async function SuburbPage({
  params,
}: {
  params: Promise<{ suburb: string }>;
}) {
  const { suburb: slugParam } = await params;
  const suburb = suburbs.find((s) => s.slug === slugParam);

  if (!suburb) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center min-h-screen">
          <p className="text-[#6B6B6B]">Location not found.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* ── Header ── */}
        <section className="relative border-b border-white/5 overflow-hidden">
          <div className="dot-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_-20%,_rgba(13,27,42,0.95)_0%,_#0A0A0A_65%)]" />
          <div className="animate-pulse-glow absolute top-0 right-0 w-[500px] h-[400px] bg-[#F5A623]/3 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 py-24">
            <div className="inline-flex items-center gap-2 badge-shimmer rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
              <span className="text-xs font-medium tracking-widest uppercase text-[#F5A623]">
                {suburb.region}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl mb-4">
              <span className="text-[#F0EDE8]">Licensed</span>
              <br />
              <span className="text-gradient">{suburb.headline.replace("Electrician in ", "")}</span>
              <br />
              <span className="text-[#F0EDE8] text-3xl md:text-4xl font-semibold">electrician.</span>
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-xl">{suburb.description}</p>
          </div>
        </section>

        {/* ── Services grid ── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-8 h-px bg-[#F5A623]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#F5A623]">
              Services in {suburb.name}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {suburb.services.map((s, i) => (
              <Reveal key={s.label} delay={i * 70}>
                <div className="card-gradient group p-8 h-full">
                  <div className="w-11 h-11 rounded-sm border border-white/8 flex items-center justify-center text-xl mb-5 group-hover:border-[#F5A623]/30 transition-colors">
                    {s.icon}
                  </div>
                  <h3 className="text-base font-semibold text-[#F0EDE8] group-hover:text-gradient transition-all">
                    {s.label}
                  </h3>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Local note + Credentials ── */}
        <section className="border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0D1B2A]/30" />
          <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-start">
            <Reveal className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-[#F5A623]" />
                <span className="text-xs font-semibold tracking-widest uppercase text-[#F5A623]">
                  Working in {suburb.name}
                </span>
              </div>
              <p className="text-[#F0EDE8] text-lg leading-relaxed">{suburb.localNote}</p>
              <p className="text-[#6B6B6B] leading-relaxed">
                Every job comes with a written quote upfront and is signed off with a Form 4 Certificate of Test. No surprises, no callbacks.
              </p>
            </Reveal>

            <Reveal delay={120} className="border border-white/5 divide-y divide-white/5 rounded-sm overflow-hidden">
              {credentials.map((c, i) => (
                <div
                  key={i}
                  className="px-6 py-5 flex items-center justify-between gap-4 hover:bg-white/2 transition-colors"
                >
                  <span className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B]">
                    {c.label}
                  </span>
                  <span className="text-sm text-[#F0EDE8] text-right font-medium">{c.value}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative overflow-hidden border-t border-white/5">
          <div className="animate-pulse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#F5A623]/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-[#F0EDE8] mb-3">
                Need an electrician in {suburb.name}?
              </h2>
              <p className="text-[#6B6B6B] text-sm max-w-md">
                Get a written quote within 24 hours. QBCC licensed, fully insured, and based right here on the Sunshine Coast.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/contact"
                className="btn-glow relative inline-flex items-center gap-3 px-8 py-4 bg-[#F5A623] text-[#0A0A0A] font-semibold text-sm tracking-wide hover:bg-[#FFD580] transition-colors rounded-sm z-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]/40" />
                Get a Quote
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center gap-3 px-8 py-4 border border-white/10 text-[#F0EDE8] font-semibold text-sm tracking-wide hover:border-[#F5A623]/30 hover:text-[#F5A623] transition-colors rounded-sm"
              >
                Instant Estimator
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
