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

export default function BrandStrip() {
  return (
    <section className="relative border-y border-white/5 bg-[#0D1B2A]/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Reveal>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-6">
            Trusted brands we install
          </p>
        </Reveal>

        <div className="flex flex-wrap items-center gap-y-4">
          {brands.map((brand, i) => (
            <Reveal key={brand.name} delay={i * 60} direction="up">
              <div className="flex items-center">
                <span
                  className="uppercase tracking-widest text-sm font-semibold text-[#6B6B6B] hover:text-[#F0EDE8] transition-colors cursor-default"
                  title={brand.note}
                >
                  {brand.name}
                </span>
                {i < brands.length - 1 && (
                  <span
                    className="hidden sm:inline-block mx-5 w-px h-4 bg-white/10 shrink-0"
                    aria-hidden="true"
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
