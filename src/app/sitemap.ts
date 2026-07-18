import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getPublishedVentures } from "@/lib/ventures";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const routes = ["", "/about", "/ventures", "/gallery", "/downloads", "/testimonials", "/faq", "/contact"];

  const staticPages: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${site.url}${r}`,
    lastModified: now,
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.7,
  }));

  const ventures = await getPublishedVentures();
  const venturePages: MetadataRoute.Sitemap = ventures.map((v) => ({
    url: `${site.url}/ventures/${v.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...venturePages];
}
