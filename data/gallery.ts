export interface GalleryImage {
  src: string;
  caption: string;
  project: string;
}

export const galleryImages: GalleryImage[] = [
  { src: "/ventures/serenity-heights.jpg", caption: "SR Serenity Heights — gated layout, Nadergul", project: "SR Serenity Heights" },
  { src: "/gallery/serenity-heights-2.jpg", caption: "Serenity Heights — location & highlights", project: "SR Serenity Heights" },
  { src: "/ventures/sr-eco-park.jpg", caption: "SR Eco Park — an oasis of peace", project: "SR Eco Park" },
  { src: "/gallery/sr-eco-park-2.jpg", caption: "SR Eco Park — premium residential plots", project: "SR Eco Park" },
  { src: "/gallery/sr-eco-park-3.jpg", caption: "SR Eco Park — features", project: "SR Eco Park" },
  { src: "/gallery/sr-eco-park-4.jpg", caption: "SR Eco Park — master plan", project: "SR Eco Park" },
  { src: "/ventures/sr-infinity-villas.jpg", caption: "SR Infinity Villas — private villas, club lifestyle", project: "SR Infinity Villas" },
  { src: "/gallery/sr-infinity-villas-2.jpg", caption: "SR Infinity Villas — amenities", project: "SR Infinity Villas" },
  { src: "/gallery/sr-infinity-villas-3.jpg", caption: "SR Infinity Villas — clubhouse living", project: "SR Infinity Villas" },
  { src: "/gallery/sr-infinity-villas-8.jpg", caption: "SR Infinity Villas — villa floor plan", project: "SR Infinity Villas" },
  { src: "/ventures/aero-villas-nadergul.jpg", caption: "Aero Villas — Nadergul", project: "Aero Villas" },
  { src: "/gallery/aero-villas-2.jpg", caption: "Aero Villas — overview", project: "Aero Villas" },
  { src: "/gallery/aero-villas-3.jpg", caption: "Aero Villas — layout", project: "Aero Villas" },
  { src: "/ventures/sree-city.jpg", caption: "Sree City — plotted development", project: "Sree City" },
  { src: "/gallery/sree-city-2.jpg", caption: "Sree City — layout detail", project: "Sree City" },
  { src: "/gallery/sree-city-3.jpg", caption: "Sree City — plan", project: "Sree City" },
  { src: "/ventures/rock-town-majeedpur.jpg", caption: "Rock Town — Majeedpur layout", project: "Rock Town" },
  { src: "/ventures/saffron-skyline.jpg", caption: "Saffron Skyline — near Hasthinapuram", project: "Saffron Skyline" },
];

export interface GalleryVideo {
  title: string;
  youtubeId: string;
}

/** Add YouTube IDs of walkthrough / drone videos here to populate the Videos tab. */
export const galleryVideos: GalleryVideo[] = [];
