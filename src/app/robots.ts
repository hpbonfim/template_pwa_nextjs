// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
import type { MetadataRoute } from "next";

import { CONFIG } from "@/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/"]
    },
    sitemap: `${CONFIG.APP_URL}/sitemap.xml`
  };
}
