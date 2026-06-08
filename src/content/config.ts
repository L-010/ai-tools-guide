import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string().optional(),
    category: z.string(),
    primaryKeyword: z.string(),
    secondaryKeywords: z.array(z.string()),
    intent: z.string(),
    updatedAt: z.string(),
    excerpt: z.string().optional(),
    datePublished: z.string().optional(),
    dateModified: z.string().optional(),
    tags: z.array(z.string()).optional(),
    tools: z.array(z.string()).optional(),
    audience: z.string().optional(),
    shopCategory: z.string().optional(),
    shopHref: z.string().optional(),
    ctaText: z.string().optional(),
    relatedSlugs: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    faq: z.array(z.object({ question: z.string(), answer: z.string() }))
  })
});

export const collections = { posts };
