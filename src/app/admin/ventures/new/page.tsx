import type { Metadata } from "next";
import VentureForm from "@/components/admin/VentureForm";

export const metadata: Metadata = {
  title: "Admin · New venture",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function NewVenturePage() {
  return <VentureForm mode="create" />;
}
