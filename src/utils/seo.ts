import { SITE } from "@/data/site";
import { absoluteUrl } from "@/utils/urls";

export type SeoProps = {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  type?: "website" | "article";
};

export function buildSeo({ title, description, pathname, image = SITE.defaultOgImage, type = "website" }: SeoProps) {
  const canonical = absoluteUrl(pathname);
  const ogImage = image.startsWith("http") ? image : absoluteUrl(image);
  return { title, description, canonical, ogImage, type, locale: SITE.locale, siteName: SITE.name };
}
