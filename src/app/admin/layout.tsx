import Image from "next/image";

// Attractive, readable backdrop shared by every /admin page (login + CMS).
// Kept light + faint so dark text and white cards stay legible over it.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-paper">
        <Image src="/ventures/sr-eco-park.jpg" alt="" fill sizes="100vw" className="object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-paper/50 to-ink/10" />
        <div className="absolute inset-0 plot-grid-fine opacity-70" />
      </div>
      {children}
    </div>
  );
}
