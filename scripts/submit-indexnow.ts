import fs from "node:fs";
import path from "node:path";

const siteUrl = process.env.SITE_URL;
const key = process.env.INDEXNOW_KEY;
if (!siteUrl || !key) {
  console.log("IndexNow skipped: SITE_URL or INDEXNOW_KEY is not configured.");
  process.exit(0);
}

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync(path.join("dist", `${key}.txt`), key, "utf8");

const urlsPath = path.join("dist", "urls.txt");
if (!fs.existsSync(urlsPath)) {
  console.error("IndexNow failed: dist/urls.txt not found. Run npm run export:urls first.");
  process.exit(1);
}

const urls = fs.readFileSync(urlsPath, "utf8").split(/\r?\n/).filter(Boolean);
const payload = { host: new URL(siteUrl).host, key, keyLocation: `${siteUrl.replace(/\/$/, "")}/${key}.txt`, urlList: urls };
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload)
});

if (!response.ok) {
  console.error(`IndexNow failed: ${response.status} ${await response.text()}`);
  process.exit(1);
}
console.log(`IndexNow submitted ${urls.length} URLs.`);
