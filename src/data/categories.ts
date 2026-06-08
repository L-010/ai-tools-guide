import type { CollectionEntry } from "astro:content";

export type PostEntry = CollectionEntry<"posts">;
export type CategorySlug = "tool-selection" | "tool-comparison" | "scenario-guides";

export const categoryPages: Record<CategorySlug, {
  slug: CategorySlug;
  title: string;
  shortTitle: string;
  description: string;
  hero: string;
}> = {
  "tool-selection": {
    slug: "tool-selection",
    title: "AI 工具选择指南",
    shortTitle: "工具选择",
    description: "适合不知道先买哪个 AI 工具的用户，从用途、预算、频率和工具定位判断 ChatGPT、Claude、Gemini、Cursor、Perplexity 等工具怎么选。",
    hero: "先按真实用途和使用频率确定主力工具，再考虑是否补充搜索、写作或编程工具。"
  },
  "tool-comparison": {
    slug: "tool-comparison",
    title: "AI 工具对比指南",
    shortTitle: "工具对比",
    description: "集中整理 ChatGPT、Claude、Gemini、Cursor、GitHub Copilot、Perplexity 等工具的差异、适合人群和组合思路。",
    hero: "对比页帮助你看清工具差异，避免只按名气、单点功能或短期价格做决定。"
  },
  "scenario-guides": {
    slug: "scenario-guides",
    title: "AI 场景方案指南",
    shortTitle: "场景方案",
    description: "按论文、编程、办公、PPT、翻译、电商、自媒体、数据分析等场景整理 AI 工具组合和购买前提醒。",
    hero: "场景页从具体任务出发，帮你判断哪些工具值得优先尝试，哪些需求适合组合使用。"
  }
};

export const categoryList = Object.values(categoryPages);

const scenarioCategories = new Set(["场景需求"]);
const selectionCategories = new Set(["工具选择", "购买意图", "FAQ 长尾"]);

export function getPostCategorySlug(post: PostEntry): CategorySlug {
  if (post.data.category === "工具对比" || post.data.intent === "comparison") return "tool-comparison";
  if (scenarioCategories.has(post.data.category)) return "scenario-guides";
  if (selectionCategories.has(post.data.category)) return "tool-selection";
  return "tool-selection";
}

export function getPostDate(post: PostEntry) {
  return post.data.dateModified || post.data.updatedAt || post.data.datePublished || "";
}

export function getPostExcerpt(post: PostEntry) {
  return post.data.excerpt || post.data.description || `${post.data.title}的选型建议、适用场景和购买前提醒。`;
}

export function getPostTags(post: PostEntry) {
  const tags = post.data.tags || post.data.secondaryKeywords || [];
  return tags.slice(0, 3);
}

export function sortPostsByDate(posts: PostEntry[]) {
  return [...posts].sort((a, b) => getPostDate(b).localeCompare(getPostDate(a)));
}

export function filterPostsByCategory(posts: PostEntry[], categorySlug: CategorySlug) {
  return sortPostsByDate(posts.filter((post) => getPostCategorySlug(post) === categorySlug));
}

export function getFeaturedPosts(posts: PostEntry[], limit = 8) {
  const featured = posts.filter((post) => post.data.featured);
  const fallbackSlugs = [
    "ai-tools-how-to-choose",
    "chatgpt-vs-claude",
    "ai-tools-for-paper-writing",
    "cursor-vs-github-copilot",
    "first-ai-membership-guide",
    "perplexity-worth-it",
    "ai-tools-low-cost-plan",
    "ai-subscription-guide"
  ];
  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const fallback = fallbackSlugs.map((slug) => bySlug.get(slug)).filter((post): post is PostEntry => Boolean(post));
  const seen = new Set<string>();
  return [...featured, ...fallback, ...sortPostsByDate(posts)]
    .filter((post) => !seen.has(post.slug) && seen.add(post.slug))
    .slice(0, limit);
}

export function getNextReadingPosts(current: PostEntry, posts: PostEntry[]) {
  const currentCategory = getPostCategorySlug(current);
  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const explicit = (current.data.relatedSlugs || [])
    .map((slug) => bySlug.get(slug))
    .filter((post): post is PostEntry => post !== undefined)
    .filter((post) => post.slug !== current.slug);
  const sameCategory = filterPostsByCategory(posts, currentCategory).filter((post) => post.slug !== current.slug);
  const comparisonOrSelection = sortPostsByDate(posts).filter((post) => {
    const category = getPostCategorySlug(post);
    return post.slug !== current.slug && (category === "tool-comparison" || category === "tool-selection");
  });
  const buyingGuide = sortPostsByDate(posts).filter((post) => {
    return post.slug !== current.slug && (post.data.category === "购买意图" || post.data.intent === "buying");
  });
  const seen = new Set<string>();
  return [...explicit, ...sameCategory, ...comparisonOrSelection, ...buyingGuide]
    .filter((post) => !seen.has(post.slug) && seen.add(post.slug))
    .slice(0, 3);
}
