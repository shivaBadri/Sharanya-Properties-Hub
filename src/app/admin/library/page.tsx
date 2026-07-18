import type { Metadata } from "next";
import LibraryManager from "@/components/admin/LibraryManager";

export const metadata: Metadata = {
  title: "Admin · Media Library",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function LibraryPage() {
  return <LibraryManager />;
}
