import { SITE } from "@/data/site";
import { absoluteUrl } from "@/utils/urls";

export function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl("/sitemap.xml")}`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
