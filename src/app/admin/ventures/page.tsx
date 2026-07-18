import type { Metadata } from "next";
import VenturesManager from "@/components/admin/VenturesManager";

export const metadata: Metadata = {
  title: "Admin · Ventures",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function VenturesPage() {
  return <VenturesManager />;
}
