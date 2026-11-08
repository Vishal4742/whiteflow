import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

// The dashboard and the API are private. Pay, checkout and receipt pages stay crawlable so crawlers see their noindex.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/merchant"] }, sitemap: `${SITE}/sitemap.xml` };
}
