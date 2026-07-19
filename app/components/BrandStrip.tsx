import { Reveal } from "./Reveal";

const brands = [
  { name: "Tesla", note: "Powerwall / EV" },
  { name: "SolarEdge", note: "Solar Inverters" },
  { name: "Fronius", note: "Solar Inverters" },
  { name: "Daikin", note: "Air Conditioning" },
  { name: "Enphase", note: "Microinverters" },
  { name: "Clipsal", note: "Switchboards" },
  { name: "Zappi", note: "EV Charging" },
];

function BrandRow() {
  return (
    <>
      {brands.map((brand) => (
        <span key={brand.name} className="flex items-center shrink-0">
          <span
            className="uppercase tracking-widest text-sm font-semibold text-[#6B6B6B] hover:text-[#F0EDE8] transition-colors cursor-default"
            title={brand.note}
          >
            {brand.name}
          </span>
          <span className="mx-8 w-1 h-1 rounded-full bg-[#F5A623]/30 shrink-0" aria-hidden="true" />
        </span>
      ))}
    </>
  );
}

export default function BrandStrip() {
  return (
    <section className="relative border-y border-white/5 bg-[#0D1B2A]/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Reveal>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-6">
            Trusted brands we install
          </p>
        </Reveal>

        <div className="marquee" aria-label="Brands we install">
          <div className="marquee-track items-center">
            <BrandRow />
            <BrandRow />
          </div>
        </div>
      </div>
    </section>
  );
}
