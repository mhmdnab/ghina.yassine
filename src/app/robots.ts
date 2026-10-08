import type { MetadataRoute } from "next";
import { ALLOW_INDEXING, SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // Crawling stays allowed so crawlers can read the page's noindex tag on the demo.
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: ALLOW_INDEXING ? `${SITE_URL}/sitemap.xml` : undefined,
  };
}
