import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import Gallery from "@/components/Gallery";
import { getGalleryImages } from "@/lib/media";
import { galleryVideos } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Gallery — Project Layouts, Plans & Photos",
  description:
    "Browse layouts, master plans and photos from Sharanya Properties Hub' plotted developments and villa communities across Hyderabad.",
  alternates: { canonical: "/gallery" },
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await getGalleryImages();
  return (
    <div className="wrap py-16 md:py-20">
      <SectionHeading
        eyebrow="Gallery"
        title="Layouts, plans and the places themselves."
        intro="A closer look at our ventures — master plans, brochures and project imagery."
      />
      <div className="mt-12">
        <Gallery images={images} videos={galleryVideos} />
      </div>
    </div>
  );
}
