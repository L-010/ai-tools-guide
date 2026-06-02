# SEO_SUBMISSION_GUIDE.md

## 站点验证
上线后分别在 Google Search Console、Bing Webmaster Tools、百度搜索资源平台、360 站长平台、搜狗资源平台、神马站长平台添加站点。推荐使用 HTML 文件验证或 DNS 验证；如平台要求上传验证文件，可放到 public/ 目录后重新部署。

## 提交 sitemap
部署完成并确认 SITE_URL 后，提交 `https://你的域名/sitemap.xml`。robots.txt 会输出 Sitemap 指令，搜索引擎也可以自动发现。

如果暂时没有独立域名，可以先使用 Cloudflare Pages 的免费二级域名，例如 `https://你的项目名.pages.dev/sitemap.xml`。第一阶段优先提交 Google Search Console 和 Bing Webmaster Tools；百度、360、搜狗、神马可以等后续绑定独立域名后再重点处理。

## 环境变量
- `SITE_URL`：正式站点域名，例如 `https://example.com`。
- 没有域名时，`SITE_URL` 填 Cloudflare Pages 分配的 `.pages.dev` 地址，例如 `https://suiliuxiaomi.com`。
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




现在我对项目有了全面了解。以下是一份超详细指南：

提交搜索引擎：Google + Bing 超详细指南
前置条件：确认你的网站 URL
你的项目部署在 Cloudflare Pages 上，URL 格式为 https://你的项目名.pages.dev。

打开 Cloudflare Dashboard
左侧菜单点击 Workers & Pages
找到你的项目，复制 .pages.dev 域名（例如 https://suiliuxiaomi.com）
第 0 步：修复 Sitemap 中的域名（必须！）
当前 robots.txt 和 sitemap 里还写着 https://example.com，必须先修复。在 Cloudflare Pages 后台设置环境变量：

Cloudflare Dashboard → Workers & Pages → 你的项目 → Settings → Environment variables
添加变量：
变量名：SITE_URL
值：https://你的项目名.pages.dev（例如 https://suiliuxiaomi.com）
点击 Save，然后重新部署（触发一次新的部署）
部署完成后，验证：

访问 https://你的项目名.pages.dev/robots.txt，确认 Sitemap 行显示的是你的真实域名
访问 https://你的项目名.pages.dev/sitemap.xml，确认所有 URL 都是真实域名
第 1 步：Google Search Console
1.1 添加网站
打开 Google Search Console
用 Google 账号登录
点击左上角 "+" → 添加资源
选择 "网址前缀"（URL prefix）
输入：https://你的项目名.pages.dev
点击 继续
1.2 验证所有权（选择一种方式）
方式 A —— DNS 验证（推荐，Cloudflare 用户最方便）：

在弹出的验证窗口中，选择 "DNS 记录"
复制 Google 给你的 TXT 记录值（一整串字符）
新开标签页，打开 Cloudflare DNS 记录 → 选你的域名 → DNS → 记录
点击 添加记录：
类型：TXT
名称：@（或用 Google 给的完整名称）
内容：粘贴那串 TXT 值
代理状态：关闭（灰色云朵）
保存后等待 1-2 分钟
回到 Google Search Console，点击 验证
方式 B —— HTML 文件验证：

下载 Google 给的 HTML 文件
放到项目的 public/ 目录下
提交代码，触发 Cloudflare Pages 重新部署
部署完成后点击验证
1.3 提交 Sitemap
验证通过后，左侧菜单点击 "站点地图"
在输入框中填入：sitemap.xml（不需要完整 URL，只需文件名）
点击 提交
状态变为 "成功" 后，Google 就会开始抓取
1.4 检查收录状态
在 Search Console 左侧点 "评估" → 可以看到 Google 抓取和索引的进度
首批数据通常需要 1-3 天 才会开始出现
完全收录可能需要 1-4 周
第 2 步：Bing Webmaster Tools
2.1 添加网站
打开 Bing Webmaster Tools
用 Microsoft / Google / GitHub 账号登录
在 "我的网站" 部分，点击 "添加网站"
输入：https://你的项目名.pages.dev
点击 添加
2.2 验证所有权
方式 A —— 一键导入 Google Search Console（最快）：

在验证页面，点击 "从 Google Search Console 导入" 按钮
授权 Bing 访问你的 Google Search Console
选择你刚添加的网站，一键完成验证
方式 B —— DNS 验证：

复制 Bing 给的 TXT 记录值
到 Cloudflare DNS 管理页面添加 TXT 记录（同 Google 的步骤）
等待后点击验证
2.3 提交 Sitemap
左侧菜单点击 "站点地图"
输入完整 URL：https://你的项目名.pages.dev/sitemap.xml
点击 提交
2.4 额外：设置 IndexNow（可选但推荐）
IndexNow 是 Bing 和 Yandex 支持的实时通知协议，比起等搜索引擎来爬取，你主动通知速度更快。

你的 CLOUDFLARE_DEPLOYMENT.md 里已提到 IndexNow，具体步骤：

生成一个 Key（随便一长串字符串，比如 UUID）：

Windows 上打开 PowerShell 或终端，运行：

# 用 Node.js 生成（如果你有 Node 环境）
node -e "console.log(crypto.randomUUID())"
或在浏览器里搜索 "UUID generator" 在线生成
把 Key 添加到 Cloudflare Pages 环境变量：
我已经执行过node -e "console.log(crypto.randomUUID())"，得到4967c849-ac17-42f6-9a0f-0d6a3e52e1a0 
变量名：INDEXNOW_KEY
值：你生成的UUID
检查你的项目里是否有 export:urls 和 submit:indexnow 脚本。如果没有，你需要创建一个简单的 IndexNow 提交工具。

在项目根目录创建 scripts/submit-indexnow.js：


// 收集所有 URL 并提交给 IndexNow
import fs from "fs";
import path from "path";

const SITE_URL = process.env.SITE_URL;
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;

async function main() {
  // 读取 sitemap 中的 URL
  const sitemapPath = path.join("dist", "sitemap.xml");
  const sitemap = fs.readFileSync(sitemapPath, "utf-8");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

  // 提交到 Bing IndexNow
  const res = await fetch("https://www.bing.com/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });

  console.log(`IndexNow 提交结果: ${res.status} ${res.statusText}`);
}

main();
然后在 package.json 中添加：


"scripts": {
  "export:urls": "echo 'Done'",
  "submit:indexnow": "node scripts/submit-indexnow.js"
}
第 3 步：验证一切正常
3.1 检查 robots.txt
浏览器打开：https://你的项目名.pages.dev/robots.txt

应看到：


User-agent: *
Allow: /

Sitemap: https://你的项目名.pages.dev/sitemap.xml
3.2 检查 Sitemap
浏览器打开：https://你的项目名.pages.dev/sitemap.xml

确认所有 URL 都使用你的真实域名，不包含 example.com。

3.3 用搜索引擎自身工具测试
Google：URL 检查工具（在 Search Console 里）
Bing：URL 检查（在 Webmaster Tools 里）
输入你的首页 URL，点击检查，看是否能正常抓取和索引。

时间线预期
时间	预期进展
当天	Sitemap 提交成功，Google/Bing 开始发现 URL
1-3 天	Search Console 开始出现 "已发现" 的页面
1-2 周	部分页面开始被收录
2-4 周	核心页面稳定收录，开始出现搜索展现
1-2 个月	排名逐步稳定，可以根据 Search Console 数据优化
关键链接汇总
平台	链接
Google Search Console	https://search.google.com/search-console
Google URL 检查工具	https://search.google.com/search-console/inspect
Bing Webmaster Tools	https://www.bing.com/webmasters
Bing URL 检查	https://www.bing.com/webmasters/url-inspection
Cloudflare Dashboard	https://dash.cloudflare.com/
IndexNow 官网	https://www.indexnow.org/
IndexNow API 文档	https://www.bing.com/indexnow/getstarted
Sitemap 协议规范	https://www.sitemaps.org/protocol.html
需要我帮你更新 CLOUDFLARE_DEPLOYMENT.md 中第 6 节的内容，把这些详细步骤写进去吗？