import type { CollectionEntry } from "astro:content";

export type PostEntry = CollectionEntry<"posts">;
export type CategorySlug = "tool-selection" | "tool-comparison" | "scenario-guides";

export const categoryPages: Record<CategorySlug, {
  slug: CategorySlug;
  title: string;
  shortTitle: string;
  description: string;
  hero: string;
  topSlugs: string[];
}> = {
  "tool-selection": {
    slug: "tool-selection",
    title: "AI 工具选择指南",
    shortTitle: "工具选择",
    description: "适合不知道先买哪个 AI 工具的用户，从用途、预算、频率和工具定位判断 ChatGPT、Claude、Gemini、Cursor、Perplexity 等工具怎么选。",
    hero: "先按真实用途和使用频率确定主力工具，再考虑是否补充搜索、写作或编程工具。",
    topSlugs: ["ai-tools-how-to-choose", "first-ai-membership-guide", "ai-subscription-guide", "ai-membership-which-is-best"]
  },
  "tool-comparison": {
    slug: "tool-comparison",
    title: "AI 工具对比指南",
    shortTitle: "工具对比",
    description: "集中整理 ChatGPT、Claude、Gemini、Cursor、GitHub Copilot、Perplexity 等工具的差异、适合人群和组合思路。",
    hero: "对比页帮助你看清工具差异，避免只按名气、单点功能或短期价格做决定。",
    topSlugs: ["chatgpt-vs-claude", "cursor-vs-github-copilot", "perplexity-vs-chatgpt", "chatgpt-plus-vs-free"]
  },
  "scenario-guides": {
    slug: "scenario-guides",
    title: "AI 场景方案指南",
    shortTitle: "场景方案",
    description: "按论文、编程、办公、PPT、翻译、电商、自媒体、数据分析等场景整理 AI 工具组合和购买前提醒。",
    hero: "场景页从具体任务出发，帮你判断哪些工具值得优先尝试，哪些需求适合组合使用。",
    topSlugs: ["ai-tools-for-paper-writing", "ai-tools-for-coding", "ai-tools-for-office", "ai-tools-for-students"]
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

export type CategoryPostRanking = {
  post: PostEntry;
  recommendationScore: number;
  heatScore: number;
  dateScore: number;
};

export function rankCategoryPosts(posts: PostEntry[], categorySlug: CategorySlug): CategoryPostRanking[] {
  const category = categoryPages[categorySlug];
  const categoryPosts = posts.filter((post) => getPostCategorySlug(post) === categorySlug);
  const relatedMentions = new Map<string, number>();
  for (const post of posts) {
    for (const relatedSlug of post.data.relatedSlugs || []) {
      relatedMentions.set(relatedSlug, (relatedMentions.get(relatedSlug) || 0) + 1);
    }
  }

  return categoryPosts
    .map((post) => {
      const editorialIndex = category.topSlugs.indexOf(post.slug);
      const editorialScore = editorialIndex >= 0 ? (category.topSlugs.length - editorialIndex) * 25 : 0;
      const heatScore = relatedMentions.get(post.slug) || 0;
      const recommendationScore = editorialScore + (post.data.featured ? 40 : 0) + heatScore * 5;
      const dateScore = Date.parse(`${getPostDate(post)}T00:00:00Z`) || 0;
      return { post, recommendationScore, heatScore, dateScore };
    })
    .sort((a, b) => {
      if (b.recommendationScore !== a.recommendationScore) return b.recommendationScore - a.recommendationScore;
      if (b.dateScore !== a.dateScore) return b.dateScore - a.dateScore;
      return a.post.data.title.localeCompare(b.post.data.title, "zh-CN");
    });
}

export function getCategoryTopRelatedPosts(posts: PostEntry[], categorySlug: CategorySlug, limit = 4) {
  const category = categoryPages[categorySlug];
  const categoryPosts = posts.filter((post) => getPostCategorySlug(post) === categorySlug);
  const bySlug = new Map(categoryPosts.map((post) => [post.slug, post]));
  const rankedItems = rankCategoryPosts(posts, categorySlug);
  const rankBySlug = new Map(rankedItems.map((item) => [item.post.slug, item.recommendationScore]));
  const ranked = rankedItems.map((item) => item.post);
  const topPosts = category.topSlugs.map((slug) => bySlug.get(slug)).filter((post): post is PostEntry => Boolean(post));
  const related = posts
    .flatMap((post) => post.data.relatedSlugs || [])
    .map((slug) => bySlug.get(slug))
    .filter((post): post is PostEntry => Boolean(post))
    .sort((a, b) => (rankBySlug.get(b.slug) || 0) - (rankBySlug.get(a.slug) || 0));
  const seen = new Set<string>();
  return [...related, ...topPosts, ...ranked]
    .filter((post) => !seen.has(post.slug) && seen.add(post.slug))
    .slice(0, limit);
}

export function getFeaturedPosts(posts: PostEntry[], limit = 8) {
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
  const editorialRank = new Map(fallbackSlugs.map((slug, index) => [slug, index]));
  const featured = posts
    .filter((post) => post.data.featured)
    .sort((a, b) => {
      const dateOrder = getPostDate(b).localeCompare(getPostDate(a));
      if (dateOrder !== 0) return dateOrder;
      return (editorialRank.get(a.slug) ?? Number.MAX_SAFE_INTEGER) - (editorialRank.get(b.slug) ?? Number.MAX_SAFE_INTEGER);
    });
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
  if (current.data.relatedSlugs?.length) {
    const seen = new Set<string>();
    return current.data.relatedSlugs
      .map((slug) => bySlug.get(slug))
      .filter((post): post is PostEntry => post !== undefined)
      .filter((post) => post.slug !== current.slug && !seen.has(post.slug) && seen.add(post.slug))
      .slice(0, 3);
  }
  const sameCategory = filterPostsByCategory(posts, currentCategory).filter((post) => post.slug !== current.slug);
  const comparisonOrSelection = sortPostsByDate(posts).filter((post) => {
    const category = getPostCategorySlug(post);
    return post.slug !== current.slug && (category === "tool-comparison" || category === "tool-selection");
  });
  const buyingGuide = sortPostsByDate(posts).filter((post) => {
    return post.slug !== current.slug && (post.data.category === "购买意图" || post.data.intent === "buying");
  });
  const seen = new Set<string>();
  return [...sameCategory, ...comparisonOrSelection, ...buyingGuide]
    .filter((post) => !seen.has(post.slug) && seen.add(post.slug))
    .slice(0, 3);
}
