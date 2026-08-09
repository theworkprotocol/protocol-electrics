/**
 * Structured data — one consistent graph for every page (agent-bookability-spec.md, Phase 1).
 *
 * Rules that live here:
 * - Suburb-level address ONLY (home-based business — the street address is never published).
 * - No price figures until the finalised price book is imported (data honesty: published
 *   prices must match the book, and the current book is placeholder).
 * - "Electrician" is the valid schema.org type; "ElectricalContractor" is not a real type.
 */

export const BUSINESS = {
  name: "Protocol Electrics",
  url: "https://www.protocolelectrics.com.au",
  telephone: "+61 428 653 509",
  email: "admin@protocolelectrics.com.au",
  suburb: "Mount Coolum",
  region: "QLD",
  postcode: "4573",
  // Mount Coolum locality centre — deliberately not the home address.
  geo: { latitude: -26.5686, longitude: 153.0908 },
  bookingUrl: "https://www.protocolelectrics.com.au/book",
  description:
    "QBCC licensed electrical contractor servicing the Sunshine Coast — residential electrical, EV charger installation, and air conditioning. By appointment; book online any time.",
  areaServed: [
    "Sunshine Coast",
    "Noosa",
    "Buderim",
    "Maroochydore",
    "Mooloolaba",
    "Caloundra",
    "Sippy Downs",
    "Coolum Beach",
    "Mount Coolum",
  ],
  credentials: ["QBCC Licensed Electrical Contractor", "ARCtick Licensed"],
} as const;

/** The LocalBusiness node used standalone (layout) and referenced by other nodes. */
export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Electrician",
    "@id": `${BUSINESS.url}/#business`,
    name: BUSINESS.name,
    url: BUSINESS.url,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    description: BUSINESS.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.suburb,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postcode,
      addressCountry: "AU",
    },
    geo: { "@type": "GeoCoordinates", ...BUSINESS.geo },
    areaServed: BUSINESS.areaServed.map((name) => ({ "@type": "Place", name })),
    priceRange: "$$",
    hasCredential: BUSINESS.credentials,
    potentialAction: {
      "@type": "ReserveAction",
      target: BUSINESS.bookingUrl,
      name: "Book an electrician",
    },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** Per-suburb Service node for /locations/[suburb]. */
export function suburbServiceJsonLd(suburbName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `Residential electrical services in ${suburbName}`,
    provider: { "@id": `${BUSINESS.url}/#business` },
    areaServed: { "@type": "Place", name: `${suburbName}, QLD` },
    url: BUSINESS.bookingUrl,
  };
}

/** Services catalog — names and descriptions only; prices arrive with the finalised book. */
export function servicesCatalogJsonLd(services: { title: string; description: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Electrical services",
    provider: { "@id": `${BUSINESS.url}/#business` },
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      priceCurrency: "AUD",
      itemOffered: { "@type": "Service", name: s.title, description: s.description },
    })),
  };
}

/** Server-rendered ld+json script — usable from any server component. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
