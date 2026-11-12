import type { NextConfig } from "next";

import { GUIDE_ASSETS } from "./src/content/guide";

const nextConfig: NextConfig = {
  /*
   * The free guide (decision-log #76). Served inline, so the email's link
   * opens it in the browser, under its clean name, so saving it gives
   * "The Small Business Guide to AI.pdf" (the card's own download names
   * it the same way). Kept out of search results: the guide is what a
   * visitor gets for their name and email.
   */
  async headers() {
    return [
      {
        source: GUIDE_ASSETS.pdf,
        headers: [
          {
            key: "Content-Disposition",
            value: `inline; filename="${GUIDE_ASSETS.downloadName}"`,
          },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },
};

export default nextConfig;
