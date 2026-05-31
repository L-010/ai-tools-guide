import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import * as cheerio from "cheerio";

const htmlFiles = await fg("dist/**/*.html");
const existing = new Set(htmlFiles.map((file) => "/" + file.replace(/^dist[\\/]/, "").replace(/index\.html$/, "").replace(/\\/g, "/")));
existing.add("/");
const failures: string[] = [];

for (const file of htmlFiles) {
  const $ = cheerio.load(fs.readFileSync(file, "utf8"));
  $("a[href]").each((_, el) => {
    const href = String($(el).attr("href"));
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) return;
    const pathname = href.split("#")[0].split("?")[0];
    if (!existing.has(pathname.endsWith("/") ? pathname : pathname + "/")) {
      failures.push(`${file}: broken internal link ${href}`);
    }
  });
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Link check passed for ${htmlFiles.length} HTML files.`);
