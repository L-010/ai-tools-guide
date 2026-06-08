import { SITE } from "@/data/site";
import { absoluteUrl } from "@/utils/urls";

type Crumb = { name: string; url: string };
type Faq = { question: string; answer: string };

export function websiteSchema() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.siteUrl,
      inLanguage: SITE.locale,
      description: SITE.description
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: SITE.siteUrl
    }
  ];
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
}

export function faqSchema(faq: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  faq: Faq[];
  crumbs: Crumb[];
}) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: input.title,
      description: input.description,
      url: absoluteUrl(input.slug),
      dateModified: input.dateModified,
      datePublished: input.datePublished,
      author: { "@type": "Organization", name: SITE.name },
      publisher: { "@type": "Organization", name: SITE.name },
      inLanguage: SITE.locale
    },
    breadcrumbSchema(input.crumbs),
    faqSchema(input.faq)
  ];
}

export function webPageSchema(input: { title: string; description: string; pathname: string; faq: Faq[]; crumbs: Crumb[] }) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: input.title,
      description: input.description,
      url: absoluteUrl(input.pathname),
      inLanguage: SITE.locale
    },
    breadcrumbSchema(input.crumbs),
    faqSchema(input.faq)
  ];
}
