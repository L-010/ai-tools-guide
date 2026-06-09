import { shopLink } from "../utils/urls";

type MarkdownNode = {
  type: string;
  value?: string;
  children?: MarkdownNode[];
};

type AstroVFile = {
  data: {
    astro?: {
      frontmatter?: Record<string, unknown>;
    };
  };
};

const CORE_MARKER = "<!-- contextual-shop-cta -->";
const CONSIDERATION_MARKER = "<!-- consideration-shop-cta -->";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function transformNodes(nodes: MarkdownNode[], htmlByMarker: Map<string, string>) {
  for (const node of nodes) {
    if (node.type === "html" && node.value) {
      const html = htmlByMarker.get(node.value.trim());
      if (html) node.value = html;
    }
    if (node.children) transformNodes(node.children, htmlByMarker);
  }
}

export default function remarkContextualShopCta() {
  return (tree: MarkdownNode, file: AstroVFile) => {
    const frontmatter = file.data.astro?.frontmatter || {};
    const pageSlug = String(frontmatter.slug || "");
    const title = String(frontmatter.title || "当前文章");
    const shopHref = typeof frontmatter.shopHref === "string" ? frontmatter.shopHref : undefined;
    const shopCategory = typeof frontmatter.shopCategory === "string" ? frontmatter.shopCategory : undefined;
    const scene = shopCategory || String(frontmatter.intent || "article");
    const href = shopLink(pageSlug, shopHref, shopCategory);
    const coreText = `围绕“${title}”查看匹配方案`;
    const considerationText = `核对${shopCategory || "当前场景"}购买前可选方案`;
    const coreHtml = `<aside class="contextual-shop-cta" aria-label="相关方案入口"><p>已经明确主要需求？可以按当前场景继续查看可选方案。</p><a href="${escapeHtml(href)}" target="_blank" rel="nofollow sponsored noopener" data-shop-cta data-page-slug="${escapeHtml(pageSlug)}" data-cta-position="contextual" data-placement="after-core-judgment" data-scene="${escapeHtml(scene)}">${escapeHtml(coreText)}</a></aside>`;
    const considerationHtml = `<aside class="contextual-shop-cta" aria-label="购买前方案入口"><p>如果上面的适用条件和注意事项都能接受，再查看对应分类中的当前可选方案。</p><a href="${escapeHtml(href)}" target="_blank" rel="nofollow sponsored noopener" data-shop-cta data-page-slug="${escapeHtml(pageSlug)}" data-cta-position="contextual" data-placement="after-purchase-considerations" data-scene="${escapeHtml(scene)}">${escapeHtml(considerationText)}</a></aside>`;

    if (tree.children) {
      transformNodes(tree.children, new Map([
        [CORE_MARKER, coreHtml],
        [CONSIDERATION_MARKER, considerationHtml]
      ]));
    }
  };
}
