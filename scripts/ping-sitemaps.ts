export {};

const siteUrl = process.env.SITE_URL;
if (!siteUrl) {
  console.log("Sitemap ping skipped: SITE_URL is not configured.");
  process.exit(0);
}
const sitemap = `${siteUrl.replace(/\/$/, "")}/sitemap.xml`;
const endpoints = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemap)}`
];
for (const endpoint of endpoints) {
  try {
    const response = await fetch(endpoint);
    console.log(`${endpoint} -> ${response.status}`);
  } catch (error) {
    console.error(`Ping failed for ${endpoint}:`, error);
  }
}
