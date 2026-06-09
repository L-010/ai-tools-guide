type MarkdownNode = {
  type: string;
  value?: string;
  url?: string;
  children?: MarkdownNode[];
};

type AstroVFile = {
  path?: string;
  data: {
    astro?: {
      frontmatter?: Record<string, unknown>;
    };
  };
};

const MAX_LINKS = 3;
const SKIPPED_PARENTS = new Set(["heading", "link", "linkReference", "code", "inlineCode", "html"]);
const LINK_RULES = [
  ["GitHub Copilot", "/github-copilot-worth-it/"],
  ["Gemini Advanced", "/gemini-advanced-worth-it/"],
  ["ChatGPT Plus", "/chatgpt-plus-worth-it/"],
  ["Claude Pro", "/claude-pro-worth-it/"],
  ["Cursor Pro", "/cursor-pro-worth-it/"],
  ["工具选择", "/tool-selection/"],
  ["工具对比", "/tool-comparison/"],
  ["场景方案", "/scenario-guides/"],
  ["跨境电商", "/ai-tools-for-cross-border/"],
  ["数据分析", "/ai-tools-for-data-analysis/"],
  ["文献综述", "/ai-tools-for-literature-review/"],
  ["论文写作", "/ai-tools-for-paper-writing/"],
  ["自媒体", "/ai-tools-for-self-media/"],
  ["Perplexity", "/perplexity-worth-it/"],
  ["ChatGPT", "/chatgpt-plus-worth-it/"],
  ["Claude", "/claude-pro-worth-it/"],
  ["Gemini", "/gemini-advanced-worth-it/"],
  ["Cursor", "/cursor-pro-worth-it/"],
  ["写代码", "/ai-tools-for-coding/"],
  ["编程", "/ai-tools-for-programmers/"],
  ["做 PPT", "/ai-tools-for-ppt/"],
  ["PPT", "/ai-tools-for-ppt/"],
  ["翻译", "/ai-tools-for-translation/"],
  ["办公", "/ai-tools-for-office/"],
  ["学生", "/ai-tools-for-students/"],
  ["电商", "/ai-tools-for-ecommerce/"]
] as const;

function collectExistingLinks(node: MarkdownNode, links: Set<string>) {
  if (node.type === "link" && node.url) links.add(node.url);
  node.children?.forEach((child) => collectExistingLinks(child, links));
}

function splitText(value: string, term: string, url: string): MarkdownNode[] | null {
  const index = value.indexOf(term);
  if (index < 0) return null;

  const nodes: MarkdownNode[] = [];
  if (index > 0) nodes.push({ type: "text", value: value.slice(0, index) });
  nodes.push({ type: "link", url, children: [{ type: "text", value: term }] });
  if (index + term.length < value.length) {
    nodes.push({ type: "text", value: value.slice(index + term.length) });
  }
  return nodes;
}

export default function remarkAutoInternalLinks() {
  return (tree: MarkdownNode, file: AstroVFile) => {
    const frontmatter = file.data.astro?.frontmatter || {};
    const slug = String(frontmatter.slug || file.path?.split(/[\\/]/).pop()?.replace(/\.mdx?$/, "") || "");
    const selfUrl = `/${slug}/`;
    const existingLinks = new Set<string>();
    const usedTerms = new Set<string>();
    const usedTargets = new Set<string>();
    let linkCount = 0;

    collectExistingLinks(tree, existingLinks);

    function transform(parent: MarkdownNode) {
      if (!parent.children || SKIPPED_PARENTS.has(parent.type) || linkCount >= MAX_LINKS) return;

      for (let index = 0; index < parent.children.length && linkCount < MAX_LINKS; index += 1) {
        const child = parent.children[index];
        if (child.type === "text" && child.value) {
          const rule = LINK_RULES.find(([term, url]) =>
            child.value?.includes(term) &&
            !usedTerms.has(term) &&
            !usedTargets.has(url) &&
            !existingLinks.has(url) &&
            url !== selfUrl
          );

          if (rule) {
            const [term, url] = rule;
            const replacement = splitText(child.value, term, url);
            if (replacement) {
              parent.children.splice(index, 1, ...replacement);
              usedTerms.add(term);
              usedTargets.add(url);
              linkCount += 1;
              index += replacement.length - 1;
              continue;
            }
          }
        }
        transform(child);
      }
    }

    transform(tree);
  };
}
