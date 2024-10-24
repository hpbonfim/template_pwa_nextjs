// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
import type { MetadataRoute } from "next";

import { CONFIG } from "@/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: CONFIG.APP_URL,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1
    }
  ];
}
