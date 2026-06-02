import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import * as cheerio from "cheerio";

const siteUrl = (process.env.SITE_URL || "https://suiliuxiaomi.com").replace(/\/$/, "");
const htmlFiles = await fg("dist/**/*.html");
const urls = htmlFiles.map((file) => {
  const rel = file.replace(/^dist[\\/]/, "").replace(/index\.html$/, "").replace(/404\.html$/, "404/");
  const pathname = "/" + rel.replace(/\\/g, "/");
  return siteUrl + (pathname.endsWith("/") ? pathname : pathname + "/");
}).filter((url) => !url.endsWith("/404/")).sort();

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync(path.join("dist", "urls.txt"), urls.join("\n") + "\n", "utf8");
fs.writeFileSync(path.join("dist", "urls.json"), JSON.stringify(urls, null, 2), "utf8");

let sitemapUrls: string[] = [];
const sitemapPath = path.join("dist", "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const $ = cheerio.load(fs.readFileSync(sitemapPath, "utf8"), { xmlMode: true });
  sitemapUrls = $("loc").map((_, el) => $(el).text()).get();
}

console.log(`Exported ${urls.length} URLs. Sitemap currently lists ${sitemapUrls.length} URLs.`);
