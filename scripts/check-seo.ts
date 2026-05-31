import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import * as cheerio from "cheerio";

const forbidden = ["破解", "绕过", "共享账号", "低价卡密", "卡密秒发", "不封号", "保号", "灰产", "平台不让发", "薅羊毛"];
const htmlFiles = (await fg("dist/**/*.html")).filter((file) => !file.endsWith("404.html"));
const failures: string[] = [];
const seenH1 = new Map<string, string>();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const $ = cheerio.load(html);
  const title = $("title").text().trim();
  const desc = $('meta[name="description"]').attr("content")?.trim();
  const canonical = $('link[rel="canonical"]').attr("href")?.trim();
  const h1s = $("h1").map((_, el) => $(el).text().trim()).get().filter(Boolean);
  const pathname = "/" + file.replace(/^dist[\\/]/, "").replace(/index\.html$/, "").replace(/\\/g, "/");

  if (!title) failures.push(`${file}: missing title`);
  if (!desc) failures.push(`${file}: missing description`);
  if (!canonical) failures.push(`${file}: missing canonical`);
  if (h1s.length !== 1) failures.push(`${file}: expected one H1, found ${h1s.length}`);
  if (h1s[0]) {
    if (seenH1.has(h1s[0])) failures.push(`${file}: duplicate H1 with ${seenH1.get(h1s[0])}`);
    seenH1.set(h1s[0], file);
  }
  for (const term of forbidden) {
    if (html.includes(term)) failures.push(`${file}: forbidden term ${term}`);
  }
  if (!["/", "/ai-tools/", "/ai-selector/", "/shop/"].includes(pathname)) {
    const text = $("main").text();
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    if (chineseChars < 1200) failures.push(`${file}: fewer than 1200 Chinese chars (${chineseChars})`);
    const ctas = $("a[data-shop-cta]").length;
    if (ctas < 3) failures.push(`${file}: fewer than 3 CTA links (${ctas})`);
    const internalLinks = $("a[href^='/']").length;
    if (internalLinks < 5) failures.push(`${file}: fewer than 5 internal links (${internalLinks})`);
  }
}

const sitemapPath = path.join("dist", "sitemap.xml");
const robotsPath = path.join("dist", "robots.txt");
if (!fs.existsSync(sitemapPath)) failures.push("dist/sitemap.xml missing");
if (!fs.existsSync(robotsPath)) failures.push("dist/robots.txt missing");
if (fs.existsSync(robotsPath) && !fs.readFileSync(robotsPath, "utf8").includes("Sitemap:")) failures.push("robots.txt missing Sitemap directive");
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  const $sitemap = cheerio.load(sitemap, { xmlMode: true });
  const sitemapPaths = new Set(
    $sitemap("loc")
      .map((_, el) => {
        const loc = $sitemap(el).text();
        try {
          return new URL(loc).pathname;
        } catch {
          return loc;
        }
      })
      .get()
  );
  for (const file of htmlFiles) {
    const rel = "/" + file.replace(/^dist[\\/]/, "").replace(/index\.html$/, "").replace(/\\/g, "/");
    if (rel === "/404/") continue;
    if (!sitemapPaths.has(rel)) failures.push(`sitemap missing ${rel}`);
  }
}

await import("./check-links.ts");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`SEO check passed for ${htmlFiles.length} pages.`);
