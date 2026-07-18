import type { Metadata } from "next";
import SettingsManager from "@/components/admin/SettingsManager";

export const metadata: Metadata = {
  title: "Admin · Settings",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return <SettingsManager />;
}
