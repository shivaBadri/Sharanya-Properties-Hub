"use client";

import { Phone, MessageCircle } from "lucide-react";
import { site, whatsappLink, telLink } from "@/data/site";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:right-6">
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform duration-200 hover:scale-105 focus-visible:scale-105"
        style={{ height: 52, width: 52 }}
      >
        <MessageCircle className="h-6 w-6" aria-hidden />
      </a>
      <a
        href={telLink()}
        aria-label={`Call ${site.phoneDisplay}`}
        className="group flex items-center justify-center rounded-full bg-ink text-paper shadow-lift transition-transform duration-200 hover:scale-105 focus-visible:scale-105"
        style={{ height: 52, width: 52 }}
      >
        <Phone className="h-5 w-5" aria-hidden />
      </a>
    </div>
  );
}
