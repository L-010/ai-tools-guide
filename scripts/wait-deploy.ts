const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const PROJECT_NAME = process.env.CLOUDFLARE_PROJECT_NAME;

if (!API_TOKEN || !ACCOUNT_ID || !PROJECT_NAME) {
  console.log("Cloudflare deploy check skipped: missing CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, or CLOUDFLARE_PROJECT_NAME.");
  process.exit(0);
}

const API_BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`;
const POLL_INTERVAL_MS = 15_000;
const TIMEOUT_MS = 300_000;
const start = Date.now();

while (Date.now() - start < TIMEOUT_MS) {
  const res = await fetch(`${API_BASE}/deployments?per_page=1`, {
    headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" }
  });

  if (!res.ok) {
    console.error(`Cloudflare API error: ${res.status} ${await res.text()}`);
    process.exit(1);
  }

  const json = await res.json() as { result: { id: string; status: string; url: string }[]; success: boolean };
  const latest = json.result?.[0];

  if (!latest) {
    console.log("Waiting for deployment to appear...");
  } else {
    console.log(`Latest deployment: ${latest.id} status=${latest.status}`);
    if (latest.status === "success") {
      console.log(`Deploy succeeded: ${latest.url}`);
      process.exit(0);
    }
    if (latest.status === "failed" || latest.status === "cancelled") {
      console.error(`Deploy ${latest.status}: ${latest.url}`);
      process.exit(1);
    }
  }

  await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
}

console.error("Timeout waiting for Cloudflare Pages deployment.");
process.exit(1);
