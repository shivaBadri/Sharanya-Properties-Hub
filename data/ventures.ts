export type VentureType = "Open Plots" | "Villa Plots" | "Villas" | "Apartments";
export type VentureStatus = "Ongoing" | "Upcoming" | "Ready to Register" | "Sold Out";

export interface Connectivity {
  label: string;
  time: string;
}

export interface Venture {
  slug: string;
  name: string;
  location: string;
  city: string;
  type: VentureType;
  status: VentureStatus;
  priceLabel: string;
  tagline: string;
  summary: string;
  highlights: string[];
  amenities: string[];
  connectivity: Connectivity[];
  approvals: string[];
  extent?: string;
  plots?: string;
  sizeRange?: string;
  cover: string;
  gallery: string[];
  brochure?: string;
  layout?: string;
  mapQuery: string;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  /** true = brochure was image-only; verify/complete this record in the admin */
  needsContent?: boolean;
}

/**
 * Data seeded from the supplied brochures.
 * Where a brochure was image-only (no machine-readable text), records are marked
 * `needsContent: true` and pricing defaults to "Price on request" — replace with
 * verified figures before launch.
 */
export const ventures: Venture[] = [
  {
    slug: "serenity-heights",
    name: "SR Serenity Heights",
    location: "Nadergul",
    city: "Hyderabad",
    type: "Villa Plots",
    status: "Ongoing",
    priceLabel: "Price on request",
    tagline: "A signature gated layout at Nadergul",
    summary:
      "A meticulously planned, HMDA-approved gated community on the Badangpet–Adibatla main road, offering exclusive villa plots with clear titles, concealed infrastructure and lush landscaping.",
    highlights: [
      "HMDA-approved premium layout with clear titles",
      "Elegant 30 ft concrete roads",
      "Exclusive villa plots from 152 to 413 sq. yds",
      "Concealed underground infrastructure",
      "Two years of professional maintenance support",
      "Loan assistance from leading banks",
    ],
    amenities: [
      "Landscaped avenues & curated open spaces",
      "Children's play zone & lifestyle parks",
      "Underground electricity & drainage",
      "Manicured gardens",
      "Gated entry",
    ],
    connectivity: [
      { label: "ORR Raviryal Exit", time: "Minutes away" },
      { label: "Rajiv Gandhi Intl. Airport", time: "~30 mins" },
      { label: "Adibatla IT / TCS corridor", time: "Nearby" },
    ],
    approvals: ["HMDA Approved"],
    sizeRange: "152 – 413 Sq. Yds",
    cover: "/ventures/serenity-heights.jpg",
    gallery: ["/ventures/serenity-heights.jpg"],
    brochure: "/downloads/serenity-heights-brochure.pdf",
    mapQuery: "Nadergul, Hyderabad, Telangana",
    featured: true,
  },
  {
    slug: "sr-eco-park",
    name: "SR Eco Park",
    location: "Nadergul",
    city: "Hyderabad",
    type: "Open Plots",
    status: "Ongoing",
    priceLabel: "Price on request",
    tagline: "An oasis of peace at Nadergul",
    summary:
      "Premium residential plots set across 17.57 acres — a green, family-friendly community with groves, wellness zones and complete underground infrastructure to build homes, lives and legacies.",
    highlights: [
      "17.57 acres · 225 plots",
      "Plot sizes from 150 to 594 sq. yds",
      "40 ft and 30 ft CC roads",
      "Compound wall on all sides",
      "24×7 security & provision for Krishna water",
      "Underground sump, electricity & drainage",
    ],
    amenities: [
      "Grand entrance plaza",
      "Jogging track & EPDM kids' play court",
      "Cricket net & badminton court",
      "Meditation & yoga zones",
      "Mango grove & coconut grove",
      "Summer park, party lawn & seating alcoves",
    ],
    connectivity: [
      { label: "Outer Ring Road", time: "Close by" },
      { label: "Rajiv Gandhi Intl. Airport", time: "Short drive" },
      { label: "Adibatla / Hardware Park", time: "Nearby" },
    ],
    approvals: ["Approved layout"],
    extent: "17.57 Acres",
    plots: "225 Plots",
    sizeRange: "150 – 594 Sq. Yds",
    cover: "/ventures/sr-eco-park.jpg",
    gallery: ["/ventures/sr-eco-park.jpg"],
    brochure: "/downloads/sr-eco-park-brochure.pdf",
    mapQuery: "Nadergul, Hyderabad, Telangana",
    featured: true,
  },
  {
    slug: "sr-infinity-villas",
    name: "SR Infinity Villas",
    location: "Nadergul",
    city: "Hyderabad",
    type: "Villas",
    status: "Ongoing",
    priceLabel: "Price on request",
    tagline: "Private villas, club lifestyle",
    summary:
      "A gated enclave of 110 luxury 3 BHK villas across 7.57 acres, where private living and resort-style clubhouse amenities coexist — five minutes from ORR Exit 14.",
    highlights: [
      "7.57 acres · 110 luxury villas",
      "3 BHK, G+2 floors",
      "Villa sizes 167 / 183 / 211 sq. yds",
      "Clubhouse with lifestyle amenities",
      "Smooth internal roads & grand entrance",
    ],
    amenities: [
      "Clubhouse",
      "Pickleball & multi-purpose court",
      "Outdoor gym",
      "Home theatre",
      "Landscaped surroundings",
    ],
    connectivity: [
      { label: "ORR Exit 14", time: "5 mins" },
      { label: "Rajiv Gandhi Intl. Airport", time: "15 mins" },
      { label: "Adibatla (TCS) IT Park", time: "Nearby" },
      { label: "Aga Khan Academy", time: "Nearby" },
    ],
    approvals: ["Gated villa community"],
    extent: "7.57 Acres",
    plots: "110 Villas",
    sizeRange: "167 – 211 Sq. Yds",
    cover: "/ventures/sr-infinity-villas.jpg",
    gallery: ["/ventures/sr-infinity-villas.jpg"],
    brochure: "/downloads/sr-infinity-villas-brochure.pdf",
    mapQuery: "Nadergul, Hyderabad, Telangana",
    featured: true,
  },
  {
    slug: "aero-villas-nadergul",
    name: "Aero Villas",
    location: "Nadergul",
    city: "Hyderabad",
    type: "Villas",
    status: "Ongoing",
    priceLabel: "Price on request",
    tagline: "Premium villas in the airport corridor",
    summary:
      "A premium villa community at Nadergul, positioned along Hyderabad's fast-growing aerospace and airport corridor with quick access to the Outer Ring Road.",
    highlights: [
      "Villa community at Nadergul",
      "Airport-corridor location",
      "Quick ORR connectivity",
    ],
    amenities: ["Gated community", "Landscaped avenues", "Modern villa design"],
    connectivity: [
      { label: "Outer Ring Road", time: "Close by" },
      { label: "Rajiv Gandhi Intl. Airport", time: "Short drive" },
      { label: "TATA Aerospace / Adibatla", time: "Nearby" },
    ],
    approvals: ["Details on request"],
    cover: "/ventures/aero-villas-nadergul.jpg",
    gallery: ["/ventures/aero-villas-nadergul.jpg"],
    brochure: "/downloads/aero-villas-nadergul-brochure.pdf",
    mapQuery: "Nadergul, Hyderabad, Telangana",
    featured: false,
    needsContent: true,
  },
  {
    slug: "sree-city",
    name: "Sree City",
    location: "Hyderabad",
    city: "Hyderabad",
    type: "Open Plots",
    status: "Ongoing",
    priceLabel: "Price on request",
    tagline: "Open plots on a 300  ft road",
    summary:
      "A plotted development laid out along a 300 ft road, planned for connectivity and long-term appreciation. Full specifications are being finalised.",
    highlights: [
      "Plotted layout on a 300 ft road",
      "Planned for connectivity & appreciation",
    ],
    amenities: ["Wide internal roads", "Planned open spaces"],
    connectivity: [{ label: "300 ft main road frontage", time: "Direct" }],
    approvals: ["Details on request"],
    cover: "/ventures/sree-city.jpg",
    gallery: ["/ventures/sree-city.jpg"],
    brochure: "/downloads/sree-city-brochure.pdf",
    layout: "/downloads/sree-city-layout.pdf",
    mapQuery: "Hyderabad, Telangana",
    featured: false,
    needsContent: true,
  },
  {
    slug: "rock-town-majeedpur",
    name: "Rock Town",
    location: "Majeedpur",
    city: "Hyderabad",
    type: "Open Plots",
    status: "Ongoing",
    priceLabel: "Price on request",
    tagline: "Open plots at Majeedpur",
    summary:
      "An open-plot layout at Majeedpur with a planned road network. Detailed specifications and pricing are available on request.",
    highlights: ["Open-plot layout at Majeedpur", "Planned road network"],
    amenities: ["Layout roads", "Planned infrastructure"],
    connectivity: [{ label: "Majeedpur", time: "Location on request" }],
    approvals: ["Details on request"],
    cover: "/ventures/rock-town-majeedpur.jpg",
    gallery: ["/ventures/rock-town-majeedpur.jpg"],
    layout: "/downloads/rock-town-majeedpur-layout.pdf",
    mapQuery: "Majeedpur, Hyderabad, Telangana",
    featured: false,
    needsContent: true,
  },
  {
    slug: "saffron-skyline",
    name: "Saffron Skyline",
    location: "Hasthinapuram",
    city: "Hyderabad",
    type: "Apartments",
    status: "Upcoming",
    priceLabel: "Price on request",
    tagline: "Rising near Hasthinapuram",
    summary:
      "A premium development near Hasthinapuram with airport-corridor access via a 30 ft wide approach road. Full details are being finalised — register your interest to be notified.",
    highlights: [
      "Premium development near Hasthinapuram",
      "30 ft wide approach road",
      "Airport-corridor access",
    ],
    amenities: ["Planned lifestyle amenities"],
    connectivity: [
      { label: "Hasthinapuram", time: "Nearby" },
      { label: "Rajiv Gandhi Intl. Airport", time: "Corridor access" },
    ],
    approvals: ["Details on request"],
    cover: "/ventures/saffron-skyline.jpg",
    gallery: ["/ventures/saffron-skyline.jpg"],
    brochure: "/downloads/saffron-skyline-brochure.pdf",
    mapQuery: "Hasthinapuram, Hyderabad, Telangana",
    featured: false,
    needsContent: true,
  },
];

export function getVenture(slug: string): Venture | undefined {
  return ventures.find((v) => v.slug === slug);
}

export const ventureTypes: VentureType[] = ["Open Plots", "Villa Plots", "Villas", "Apartments"];
export const ventureStatuses: VentureStatus[] = ["Ongoing", "Upcoming", "Ready to Register", "Sold Out"];
export const ventureLocations = Array.from(new Set(ventures.map((v) => v.location))).sort();
