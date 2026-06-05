# AI 工具选型指南

Astro + TypeScript + Markdown + Tailwind 静态 SEO 内容站，用于通过 AI 工具选型、对比、教程和购买前提醒承接搜索流量，并引导用户主动进入小店查看可选方案。

## 本地运行
```bash
npm install
npm run dev
```

## 构建命令
```bash
npm run build
npm run preview
```

## Cloudflare Pages 部署
- Build command: `npm run build`
- Output directory: `dist`
- 必填环境变量：`SITE_URL`
- 可选环境变量：`INDEXNOW_KEY`、`BAIDU_SITE`、`BAIDU_TOKEN`

没有独立域名时，可以先使用 Cloudflare Pages 自动分配的免费二级域名，例如 `https://suiliuxiaomi.com`。第一次部署成功后，把 `SITE_URL` 设置为这个 `.pages.dev` 地址，再重新部署一次，确保 sitemap、canonical、robots.txt 都输出真实线上地址。

详细流程见 `CLOUDFLARE_DEPLOYMENT.md`。

## 如何新增文章
在 `src/content/posts/` 新增 Markdown 文件，并填写 title、description、slug、category、primaryKeyword、secondaryKeywords、intent、updatedAt、ctaText、faq。正文应包含场景推荐表、对比表、内部链接、购买前提醒和总结。

## 如何修改小店链接
修改 `src/data/site.ts` 中的 `shopUrl`。CTA 链接由 `src/utils/urls.ts` 统一生成。

## 如何提交搜索引擎
`npm run build` 已内置搜索引引擎通知（IndexNow + 百度 + sitemap ping）。配置相应环境变量后，构建完成即自动提交。

`git push` 后 GitHub Actions 会自动等待站点部署完成并执行搜索引引擎提交作为兜底。需在 GitHub 仓库配置以下 Secrets：

- `SITE_URL` — 站点地址（必填，如 `https://suiliuxiaomi.com`）
- `INDEXNOW_KEY` — IndexNow API key（可选）
- `BAIDU_SITE` / `BAIDU_TOKEN` — 百度推送凭证（可选）

百度、360、搜狗、神马可以等后续绑定独立域名后再重点处理。

## 如何查看转化点击
所有购买按钮会触发 `shop_cta_click`，参数包括 page_slug、cta_position、cta_text、destination_url。页面兼容 `window.dataLayer` 和 `window.aiToolsGuideTrack`。

## 自动化流程
`git push` 后全自动完成：构建 → SEO 检查 → Cloudflare Pages 部署 → 搜索引引擎通知（IndexNow / 百度 / sitemap ping）。详细配置见 `CLOUDFLARE_DEPLOYMENT.md`。

## 注意事项
本站不复制小店商品全集，不展示虚假价格、库存、评分或评价，不使用 Product/Offer/Review 结构化数据。所有购买入口都必须由用户主动点击。
