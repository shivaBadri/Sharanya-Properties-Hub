export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  project: string;
  quote: string;
}

/**
 * Placeholder testimonials — replace with real, consented customer reviews
 * before launch (fabricated reviews are an ASCI/consumer-law risk).
 */
export const testimonials: Testimonial[] = [
  {
    name: "Rajesh K.",
    location: "Hyderabad",
    rating: 5,
    project: "SR Eco Park",
    quote:
      "The clarity on titles and approvals made the decision easy. Registration was smooth and the layout is exactly as shown.",
  },
  {
    name: "Sowmya R.",
    location: "Bengaluru",
    rating: 5,
    project: "SR Serenity Heights",
    quote:
      "I was investing from another city, so transparency mattered most. Every question was answered clearly over WhatsApp before I visited.",
  },
  {
    name: "Imran S.",
    location: "Hyderabad",
    rating: 4,
    project: "SR Infinity Villas",
    quote:
      "The location near ORR Exit 14 sold me. Good connectivity and the clubhouse plans look genuinely well thought out.",
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "Are Sharanya Properties Hub layouts approved?",
    answer:
      "Our flagship layouts such as SR Serenity Heights are HMDA-approved with clear titles. Approval status for each venture is listed on its project page — ask us on WhatsApp for the specific approval documents of any project.",
  },
  {
    question: "Which areas do you develop in?",
    answer:
      "We focus on Hyderabad's high-growth ORR corridor — currently Nadergul, Majeedpur, Hasthinapuram and surrounding areas with strong connectivity to the Outer Ring Road, Rajiv Gandhi International Airport and the Adibatla IT/aerospace hub.",
  },
  {
    question: "What plot sizes are available?",
    answer:
      "Plot and villa sizes vary by project — for example, SR Eco Park offers 150–594 sq. yds and SR Infinity Villas offers 167–211 sq. yd villas. See each project page for its size range.",
  },
  {
    question: "Do you offer home-loan assistance?",
    answer:
      "Yes. Several of our layouts have tie-ups with leading banks for loan assistance. Share your requirement and we'll guide you on eligible options.",
  },
  {
    question: "How do I book a site visit?",
    answer:
      "Call or WhatsApp us on +91 94937 02929, or submit an enquiry on any project page. We'll arrange a convenient site visit and walk you through the layout, pricing and documentation.",
  },
  {
    question: "Is the price fixed or negotiable?",
    answer:
      "Pricing depends on plot size, location within the layout and current availability. Contact us for the latest per-sq-yd pricing and any ongoing offers for a specific venture.",
  },
];
