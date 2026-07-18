"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  src: string;
  caption: string;
  project?: string;
}
interface GalleryVideo {
  title: string;
  youtubeId: string;
}

type Tab = "images" | "videos";

export default function Gallery({ images, videos }: { images: GalleryImage[]; videos: GalleryVideo[] }) {
  const [tab, setTab] = useState<Tab>("images");
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, prev, next]);

  return (
    <div>
      {/* Tabs */}
      <div className="inline-flex rounded-full border border-line bg-white p-1">
        {(["images", "videos"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors",
              tab === t ? "bg-ink text-paper" : "text-slate-ink hover:text-ink"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "images" ? (
        images.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-line py-20 text-center text-sm text-slate">
            No images yet.
          </p>
        ) : (
          <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {images.map((img, i) => (
              <button
                key={`${img.src}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className="group relative block w-full overflow-hidden rounded-xl border border-line bg-paper-200"
                aria-label={`Open image: ${img.caption}`}
              >
                <Image
                  src={img.src}
                  alt={img.caption}
                  width={700}
                  height={900}
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {img.caption && (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 text-left text-xs font-medium text-paper opacity-0 transition-opacity group-hover:opacity-100">
                    {img.caption}
                  </span>
                )}
              </button>
            ))}
          </div>
        )
      ) : (
        <div className="mt-8">
          {videos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line py-20 text-center">
              <Film className="mx-auto h-8 w-8 text-slate" aria-hidden />
              <p className="mt-3 font-medium text-ink">No videos yet</p>
              <p className="mt-1 text-sm text-slate">Walkthrough and drone videos will appear here once added.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {videos.map((vid) => (
                <div key={vid.youtubeId} className="aspect-video overflow-hidden rounded-xl border border-line">
                  <iframe
                    title={vid.title}
                    src={`https://www.youtube-nocookie.com/embed/${vid.youtubeId}`}
                    loading="lazy"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {active !== null && images[active] && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={close}
        >
          <button type="button" onClick={close} className="absolute right-4 top-4 text-paper/80 hover:text-gold-soft" aria-label="Close">
            <X className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 text-paper/80 hover:text-gold-soft sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-9 w-9" />
          </button>
          <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[active].src}
              alt={images[active].caption}
              width={1400}
              height={1800}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-paper/70">{images[active].caption}</figcaption>
          </figure>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 text-paper/80 hover:text-gold-soft sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="h-9 w-9" />
          </button>
        </div>
      )}
    </div>
  );
}
