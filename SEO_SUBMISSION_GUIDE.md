# SEO_SUBMISSION_GUIDE.md

## 站点验证
上线后分别在 Google Search Console、Bing Webmaster Tools、百度搜索资源平台、360 站长平台、搜狗资源平台、神马站长平台添加站点。推荐使用 HTML 文件验证或 DNS 验证；如平台要求上传验证文件，可放到 public/ 目录后重新部署。

## 提交 sitemap
部署完成并确认 SITE_URL 后，提交 `https://你的域名/sitemap.xml`。robots.txt 会输出 Sitemap 指令，搜索引擎也可以自动发现。

如果暂时没有独立域名，可以先使用 Cloudflare Pages 的免费二级域名，例如 `https://你的项目名.pages.dev/sitemap.xml`。第一阶段优先提交 Google Search Console 和 Bing Webmaster Tools；百度、360、搜狗、神马可以等后续绑定独立域名后再重点处理。

## 环境变量
- `SITE_URL`：正式站点域名，例如 `https://example.com`。
- 没有域名时，`SITE_URL` 填 Cloudflare Pages 分配的 `.pages.dev` 地址，例如 `https://ai-tools-guide.pages.dev`。
- `INDEXNOW_KEY`：IndexNow key，用于 Bing 和支持 IndexNow 的平台。
- `BAIDU_SITE`：百度资源站点地址。
- `BAIDU_TOKEN`：百度普通收录 API token。

## 提交脚本
- `npm run build`：构建并生成 URL 清单、运行 SEO 检查。
- `npm run submit:indexnow`：提交 `dist/urls.txt` 到 IndexNow。
- `npm run submit:baidu`：提交 `dist/urls.txt` 到百度普通收录 API。
- `npm run ping:sitemaps`：通知搜索引擎 sitemap 地址。
- `npm run postbuild:submit`：依次运行提交脚本。

## 重要提醒
提交不等于收录，收录不等于排名。搜索表现取决于内容质量、页面体验、站点信任、外部曝光和持续更新。

## 每周数据检查
每周查看展现、点击、CTR、Top pages、Top queries、CTA 点击、出站点击。优先优化有展现没点击的页面标题和描述，再优化有点击没转化的页面 CTA、对比表和首屏结论。
