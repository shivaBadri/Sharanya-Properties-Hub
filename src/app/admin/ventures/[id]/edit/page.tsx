import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VentureForm from "@/components/admin/VentureForm";
import { getVentureById } from "@/lib/ventures";

export const metadata: Metadata = {
  title: "Admin · Edit venture",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function EditVenturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const venture = await getVentureById(id);
  if (!venture) notFound();
  return <VentureForm mode="edit" initial={venture} />;
}
