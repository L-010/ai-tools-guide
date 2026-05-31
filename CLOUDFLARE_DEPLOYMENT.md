# Cloudflare Pages 无域名上线流程

这套流程适合当前阶段：先用 Cloudflare Pages 免费二级域名上线，验证收录、点击和导流效果；等数据跑起来后，再决定是否购买独立域名。

## 1. 本地确认

在项目根目录运行：

```bash
npm install
npm run build
```

构建通过后，说明 Astro 页面、40 篇文章、sitemap、robots、SEO 检查和链接检查都正常。

## 2. 准备代码仓库

Cloudflare Pages 最常见的方式是连接 GitHub 仓库：

1. 在 GitHub 新建一个仓库，例如 `ai-tools-guide`。
2. 把当前项目提交并推送到这个仓库。
3. 不要提交 `node_modules/`、`.astro/`、`dist/`，这些已经在 `.gitignore` 中忽略。

如果你不想先接 GitHub，也可以在 Cloudflare Pages 使用 Direct Upload，但后续更新不如 GitHub 自动部署方便。

## 3. 创建 Cloudflare Pages 项目

1. 登录 Cloudflare。
2. 进入 `Workers & Pages`。
3. 选择 `Create application`。
4. 选择 `Pages`。
5. 连接你的 GitHub 仓库。
6. 选择本项目仓库。

构建配置填写：

- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: 留空，除非项目不在仓库根目录

## 4. 第一次部署

第一次可以先不设置 `SITE_URL`，让 Cloudflare 完成初始部署。

部署完成后，Cloudflare 会给你一个免费地址，通常类似：

```text
https://ai-tools-guide.pages.dev
```

这个地址就是你没有域名时的临时正式站。

## 5. 设置 SITE_URL 并重新部署

进入 Cloudflare Pages 项目：

1. 打开 `Settings`。
2. 打开 `Environment variables`。
3. 添加变量：

```text
SITE_URL=https://你的项目名.pages.dev
```

注意：

- 不要在末尾加 `/`。
- 不要继续使用 `https://example.com`。
- 生产环境和预览环境都可以设置，但至少生产环境必须设置。

保存后，进入 `Deployments`，点击 `Retry deployment` 或推送一次新提交触发重新部署。

重新部署后检查：

- `https://ai-tools-guide-88z.pages.dev/sitemap.xml`
- `https://ai-tools-guide-88z.pages.dev/robots.txt`
- 任意文章页源码中的 canonical

这些地址都应该指向 `.pages.dev`，不能再出现 `example.com`。

## 6. 提交搜索引擎：先做 Google 和 Bing

没有独立域名时，建议优先做 Google 和 Bing：

1. Google Search Console 添加 URL 前缀资源：`https://你的项目名.pages.dev`
2. Bing Webmaster Tools 添加同一个站点。
3. 提交 sitemap：`https://你的项目名.pages.dev/sitemap.xml`

百度、360、搜狗、神马对免费二级域名的支持和效果可能不稳定，可以先放后。等后续购买独立域名后，再集中做国内搜索平台验证。

## 7. 可选：IndexNow

如果要用 IndexNow：

1. 准备一个 `INDEXNOW_KEY`。
2. 在 Cloudflare Pages 环境变量中添加：

```text
INDEXNOW_KEY=你的key
```

3. 本地或部署后运行：

```bash
npm run export:urls
npm run submit:indexnow
```

如果没有 key，可以先跳过。sitemap 提交已经足够启动第一阶段。

## 8. 上线后每周工作

第 1 周：

- 确认页面能打开。
- 确认 sitemap 被 Google/Bing 读取。
- 看是否开始出现已发现、已抓取或已收录页面。

第 2-4 周：

- 找有展现没点击的页面，改 title 和 description。
- 找有点击但小店出站少的页面，改首屏结论、对比表和 CTA 文案。
- 优先优化 `/ai-subscription-guide/`、`/chatgpt-vs-claude/`、`/ai-tools-how-to-choose/`、`/shop/`。

第 2 个月：

- 根据真实搜索词扩展文章。
- 把有展现的页面做得更细。
- 考虑购买独立域名并绑定 Cloudflare Pages。

## 9. 关键提醒

- `.pages.dev` 可以先用来验证项目，不影响你开始做 SEO。
- 后续绑定独立域名时，记得把 `SITE_URL` 改成新域名。
- 提交 sitemap 不等于马上收录，收录也不等于马上排名。
- 这个站的目标是先解决用户选型问题，再自然引导用户点击进入小店。
