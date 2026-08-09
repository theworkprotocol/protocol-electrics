// FAQ content — shared by the page (render) and the layout (FAQPage JSON-LD).
export type FAQItem = { q: string; a: string };
export type FAQCategory = { label: string; icon: string; items: FAQItem[] };

export const faqData: FAQCategory[] = [
  {
    label: "Electrical",
    icon: "⚡",
    items: [
      {
        q: "What is a Form 4 Certificate of Test?",
        a: "A Form 4 is Queensland's Certificate of Test — the compliance document a licensed electrician must complete and sign after completing electrical installation work. It confirms the work meets AS/NZS 3000 wiring rules and Queensland electrical safety regulations. We issue a Form 4 for every job we complete, and you should always ask for one if your previous electrician didn't provide one.",
      },
      {
        q: "How often should I test my safety switches?",
        a: "Every three months. Press the 'Test' button on each RCD (safety switch) in your switchboard. The circuit should trip immediately. If it doesn't trip, or if the button is stiff and hasn't been pressed in years, call us — a faulty RCD provides no protection. Queensland law requires landlords to ensure RCDs are tested at the start of each tenancy.",
      },
      {
        q: "Can you do after-hours emergency callouts?",
        a: "Yes. If you have a loss of power, a burning smell from your switchboard, or any situation that poses an immediate safety risk, call us directly — don't wait until business hours. We'll give you a fixed price over the phone before we head out, so you know exactly where you stand.",
      },
    ],
  },
  {
    label: "EV Charging",
    icon: "🔌",
    items: [
      {
        q: "What's the best home EV charger?",
        a: "It depends on your vehicle. Tesla owners generally get the best experience with the Tesla Wall Connector — it integrates with the car's scheduling and load management features. For non-Tesla EVs (and some Tesla owners who want flexibility), the Zappi by myenergi is excellent: it offers smart scheduling so you charge when power is cheapest. We'll recommend the right unit for your car and tariff.",
      },
      {
        q: "Do I need 3-phase power for an EV charger?",
        a: "Not always. Most home EV chargers work on single-phase 32A circuits, delivering 7–8 kW — enough to fully charge most EVs overnight. 3-phase is worth considering if you have a vehicle capable of 11–22 kW AC charging (e.g. some European models), or if you want to install two chargers without overloading a single phase. We'll assess your existing supply and advise what's actually needed.",
      },
      {
        q: "How long does EV charger installation take?",
        a: "A straightforward single charger installation — garage wall mount, new circuit from the switchboard, and commissioning — typically takes half a day. More complex jobs involving cable runs through roof spaces, sub-board installation, or 3-phase upgrades may take a full day. We provide a firm timeframe before we start.",
      },
    ],
  },
  {
    label: "Air Conditioning",
    icon: "❄️",
    items: [
      {
        q: "What size AC do I need?",
        a: "AC capacity (in kW) depends on room size, ceiling height, insulation, window area and orientation, and local climate. A rule-of-thumb guess is almost always wrong — an undersized unit runs constantly and never reaches temperature; an oversized unit short-cycles, wears out faster, and fails to dehumidify. We calculate the correct capacity using a proper heat-load assessment before recommending any system.",
      },
      {
        q: "What's ARCtick and why does it matter?",
        a: "ARCtick is the Australian Refrigeration Council's licensing scheme for anyone who handles refrigerants. Under Australian law, refrigerant handling — including installation, commissioning, and decommissioning of air conditioning systems — must be performed by an ARCtick-licensed technician. Always ask for the licence number. We hold current ARCtick licences for all AC work we perform.",
      },
      {
        q: "Split system vs ducted — which is right for me?",
        a: "Split systems are ideal for single rooms or open-plan spaces: lower upfront cost, easy to install in existing homes, and independent temperature control per unit. Ducted systems condition the whole home from a central unit with concealed ductwork — better aesthetics and whole-home zoning, but higher cost and best suited to new builds or major renovations where duct runs can be planned in. For most existing homes needing 1–3 rooms cooled, split systems win on value. For 4+ rooms or new builds, ducted is worth the investment.",
      },
    ],
  },
  {
    label: "Pricing & Bookings",
    icon: "📋",
    items: [
      {
        q: "How do you price jobs?",
        a: "Every job is quoted as a fixed price — no hourly rates, no open-ended bills. We assess your job (using your description, photos, or a site visit for larger work), then send a written fixed-price quote within 24 hours. The price on the quote is the price on the invoice. No hidden fees, no surprises when the job runs longer than expected — that risk is ours, not yours.",
      },
      {
        q: "What areas do you service?",
        a: "We service residential homes across the full Sunshine Coast — from Noosa and Noosaville in the north down to Caloundra in the south, including Buderim, Maroochydore, Mooloolaba, Sippy Downs, Coolum, and surrounds. For larger residential projects we'll travel further — contact us to discuss.",
      },
      {
        q: "How do I get a quote?",
        a: "Use the instant estimate tool on our website for a ballpark figure within seconds, or submit the contact form for a detailed quote. We aim to have a formal written quote back to you within 24 hours of receiving your enquiry. For urgent work, call us directly and we'll prioritise your job.",
      },
    ],
  },
];
