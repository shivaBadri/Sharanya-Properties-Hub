import type { Metadata } from "next";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

export const metadata: Metadata = {
  title: "Admin · Testimonials",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function TestimonialsPage() {
  return <TestimonialsManager />;
}
