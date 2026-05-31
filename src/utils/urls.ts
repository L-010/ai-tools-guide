import { SITE } from "@/data/site";

export function trimSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function withLeadingSlash(slug: string) {
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function ensureTrailingSlash(pathname: string) {
  if (pathname === "") return "/";
  if (/\.[a-z0-9]+$/i.test(pathname)) return pathname;
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function absoluteUrl(pathname: string) {
  return `${trimSlash(SITE.siteUrl)}${ensureTrailingSlash(withLeadingSlash(pathname))}`;
}

export function shopLink(pageSlug: string) {
  const params = new URLSearchParams({
    utm_source: "seo",
    utm_medium: "organic",
    utm_campaign: "ai_tools",
    utm_content: pageSlug
  });
  return `${SITE.shopUrl}?${params.toString()}`;
}
