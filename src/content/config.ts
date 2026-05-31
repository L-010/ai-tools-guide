import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string().optional(),
    category: z.string(),
    primaryKeyword: z.string(),
    secondaryKeywords: z.array(z.string()),
    intent: z.string(),
    updatedAt: z.string(),
    ctaText: z.string(),
    faq: z.array(z.object({ question: z.string(), answer: z.string() }))
  })
});

export const collections = { posts };
