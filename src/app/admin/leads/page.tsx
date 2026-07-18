import type { Metadata } from "next";
import LeadsManager from "@/components/admin/LeadsManager";

export const metadata: Metadata = {
  title: "Admin · Leads",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function LeadsPage() {
  return <LeadsManager />;
}
