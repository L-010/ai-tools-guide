import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import remarkContextualShopCta from "./src/remark/contextual-shop-cta";
import remarkAutoInternalLinks from "./src/remark/auto-internal-links";

export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [remarkAutoInternalLinks, remarkContextualShopCta]
  },
  output: "static",
  site: 'https://suiliuxiaomi.com',
  trailingSlash: "always"
});
