import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import VenturesExplorer from "@/components/VenturesExplorer";
import { getPublishedVentures, getVentureFacets } from "@/lib/ventures";

export const metadata: Metadata = {
  title: "Ventures — Open Plots & Villa Projects in Hyderabad",
  description:
    "Explore Sharanya Properties Hub' HMDA/DTCP-approved open plots and villa layouts across Hyderabad's ORR corridor. Filter by location, type, price and status.",
  alternates: { canonical: "/ventures" },
};

export const dynamic = "force-dynamic";

export default async function VenturesPage() {
  const ventures = await getPublishedVentures();
  const facets = getVentureFacets(ventures);
  return (
    <div className="wrap py-16 md:py-20">
      <SectionHeading
        eyebrow="Our ventures"
        title="Plotted communities across Hyderabad."
        intro="Approved layouts on the ORR growth corridor. Filter to find the location, plot type and status that fits your plan."
      />
      <div className="mt-12">
        <VenturesExplorer
          ventures={ventures}
          locations={facets.locations}
          types={facets.types}
          statuses={facets.statuses}
        />
      </div>
    </div>
  );
}
