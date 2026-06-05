const SITE_URL = process.env.SITE_URL;

if (!SITE_URL) {
  console.log("Deploy check skipped: SITE_URL is not configured.");
  process.exit(0);
}

const POLL_INTERVAL_MS = 15_000;
const TIMEOUT_MS = 300_000;
const start = Date.now();

// Fetch the deployed homepage. Cloudflare Pages returns 200 once deployment is live.
while (Date.now() - start < TIMEOUT_MS) {
  try {
    const res = await fetch(SITE_URL, { method: "HEAD", redirect: "follow" });
    if (res.ok) {
      console.log(`Site is live: ${SITE_URL} (status: ${res.status})`);
      process.exit(0);
    }
    console.log(`Site not ready: status=${res.status}, retrying in ${POLL_INTERVAL_MS / 1000}s...`);
  } catch {
    console.log(`Site not reachable, retrying in ${POLL_INTERVAL_MS / 1000}s...`);
  }
  await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
}

console.error("Timeout waiting for site to become live.");
process.exit(1);
