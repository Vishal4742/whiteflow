import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

// The public pages worth finding; everything else is per merchant, per payment, or behind sign-in.
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/docs", "/pricing", "/mcp", "/capital", "/proofs", "/about", "/contact", "/status", "/privacy", "/terms"].map((path) => ({ url: `${SITE}${path}` }));
}
