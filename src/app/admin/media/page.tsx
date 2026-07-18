import type { Metadata } from "next";
import MediaManager from "@/components/admin/MediaManager";

export const metadata: Metadata = {
  title: "Admin · Gallery",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function MediaPage() {
  return <MediaManager />;
}
