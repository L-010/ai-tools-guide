import { getCollection } from "astro:content";
import { SITE } from "@/data/site";
import { absoluteUrl } from "@/utils/urls";

export async function GET() {
  const posts = await getCollection("posts");
  const staticPages = ["/", "/ai-tools/", "/ai-selector/", "/shop/"];
  const urls = [
    ...staticPages.map((path) => ({ loc: absoluteUrl(path), lastmod: new Date().toISOString().slice(0, 10) })),
    ...posts.map((post) => ({ loc: absoluteUrl(post.slug), lastmod: post.data.updatedAt }))
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url.loc}</loc><lastmod>${url.lastmod}</lastmod></url>`).join("\n")}
</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
