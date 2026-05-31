import fs from "node:fs";
import path from "node:path";

const site = process.env.BAIDU_SITE;
const token = process.env.BAIDU_TOKEN;
if (!site || !token) {
  console.log("Baidu submission skipped: BAIDU_SITE or BAIDU_TOKEN is not configured.");
  process.exit(0);
}

const urlsPath = path.join("dist", "urls.txt");
if (!fs.existsSync(urlsPath)) {
  console.error("Baidu submission failed: dist/urls.txt not found. Run npm run export:urls first.");
  process.exit(1);
}

const urls = fs.readFileSync(urlsPath, "utf8").split(/\r?\n/).filter(Boolean);
const endpoint = `https://data.zz.baidu.com/urls?site=${encodeURIComponent(site)}&token=${encodeURIComponent(token)}`;
const response = await fetch(endpoint, {
  method: "POST",
  headers: { "Content-Type": "text/plain" },
  body: urls.join("\n")
});
const text = await response.text();
if (!response.ok) {
  console.error(`Baidu submission failed: ${response.status} ${text}`);
  process.exit(1);
}
console.log(`Baidu response: ${text}`);
