const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DATA_DIR = process.env.ANALYTICS_DATA_DIR || path.join(ROOT_DIR, "analytics-data");
const EVENTS_FILE = path.join(DATA_DIR, "events.jsonl");
const SALT_FILE = path.join(DATA_DIR, "salt");

const PORT = Number(process.env.PORT || 3000);
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-me";
const TRUST_PROXY = process.env.TRUST_PROXY === "1";
const ALLOWED_ORIGINS = new Set(
  (process.env.ANALYTICS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
}

function getSalt() {
  if (process.env.ANALYTICS_SALT) {
    return process.env.ANALYTICS_SALT;
  }

  ensureDataDir();
  if (!fs.existsSync(SALT_FILE)) {
    fs.writeFileSync(SALT_FILE, crypto.randomBytes(32).toString("hex"), { mode: 0o600 });
  }
  return fs.readFileSync(SALT_FILE, "utf8").trim();
}

const ANALYTICS_SALT = getSalt();

function send(res, status, body, contentType = "text/plain; charset=utf-8", extraHeaders = {}) {
  res.writeHead(status, {
    "Content-Type": contentType,
    "X-Content-Type-Options": "nosniff",
    ...extraHeaders,
  });
  res.end(body);
}

function sendJson(res, status, payload, extraHeaders = {}) {
  send(res, status, JSON.stringify(payload), "application/json; charset=utf-8", {
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
}

function corsHeaders(req) {
  const origin = req.headers.origin;
  if (!origin) return {};
  if (!ALLOWED_ORIGINS.has("*") && !ALLOWED_ORIGINS.has(origin)) return {};

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function isSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;

  const forwardedProto = TRUST_PROXY && req.headers["x-forwarded-proto"]
    ? String(req.headers["x-forwarded-proto"]).split(",")[0].trim()
    : "";
  const protocol = forwardedProto || "http";
  return origin === `${protocol}://${req.headers.host}`;
}

function handleAnalyticsOptions(req, res) {
  const headers = corsHeaders(req);
  if (!headers["Access-Control-Allow-Origin"]) {
    send(res, 403, "Origin not allowed");
    return;
  }
  send(res, 204, "", "text/plain; charset=utf-8", headers);
}

function readBody(req, maxBytes = 8192) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      data += chunk;
      if (Buffer.byteLength(data, "utf8") > maxBytes) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function getClientIp(req) {
  if (TRUST_PROXY && req.headers["x-forwarded-for"]) {
    return String(req.headers["x-forwarded-for"]).split(",")[0].trim();
  }
  return req.socket.remoteAddress || "";
}

function normalizeIp(ip) {
  if (ip.startsWith("::ffff:")) {
    return ip.slice(7);
  }
  return ip;
}

function ipPrefix(ip) {
  const normalized = normalizeIp(ip);
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(normalized)) {
    const parts = normalized.split(".");
    return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
  }

  if (normalized.includes(":")) {
    const parts = normalized.split(":").filter(Boolean).slice(0, 4);
    return `${parts.join(":")}::/64`;
  }

  return "unknown";
}

function hashIpPrefix(ip) {
  return crypto
    .createHash("sha256")
    .update(`${ANALYTICS_SALT}:${ipPrefix(ip)}`)
    .digest("hex")
    .slice(0, 16);
}

function clampText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, maxLength);
}

function normalizePath(value) {
  const clean = clampText(value, 300);
  if (!clean.startsWith("/")) return "/";
  try {
    const parsed = new URL(clean, "http://localhost");
    return parsed.pathname || "/";
  } catch {
    return clean.split("?")[0].split("#")[0] || "/";
  }
}

function normalizeReferrer(value) {
  const clean = clampText(value, 500);
  if (!clean) return "";
  try {
    const parsed = new URL(clean);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return "";
  }
}

function parseUserAgent(userAgent) {
  const ua = userAgent || "";
  let browser = "Other";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Chrome\//.test(ua) && !/Chromium\//.test(ua)) browser = "Chrome";
  else if (/Safari\//.test(ua) && /Version\//.test(ua)) browser = "Safari";

  let os = "Other";
  if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua) && !/Mobile\//.test(ua)) os = "macOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/(iPhone|iPad|iPod)/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";

  let device = "Desktop";
  if (/iPad|Tablet/.test(ua)) device = "Tablet";
  else if (/Mobi|Android|iPhone|iPod/.test(ua)) device = "Mobile";

  return { browser, os, device };
}

function createEvent(req, payload) {
  const agent = parseUserAgent(req.headers["user-agent"] || "");
  return {
    ts: new Date().toISOString(),
    type: payload.type === "pageview" ? "pageview" : "event",
    path: normalizePath(payload.path),
    title: clampText(payload.title, 180),
    referrer: normalizeReferrer(payload.referrer),
    language: clampText(payload.language, 35),
    viewport: ["mobile", "tablet", "desktop", "wide"].includes(payload.viewport)
      ? payload.viewport
      : "unknown",
    ipPrefixHash: hashIpPrefix(getClientIp(req)),
    browser: agent.browser,
    os: agent.os,
    device: agent.device,
  };
}

function appendEvent(event) {
  ensureDataDir();
  fs.appendFileSync(EVENTS_FILE, `${JSON.stringify(event)}\n`, { mode: 0o600 });
}

async function handleAnalytics(req, res) {
  const headers = corsHeaders(req);
  if (req.headers.origin && !headers["Access-Control-Allow-Origin"] && !isSameOrigin(req)) {
    sendJson(res, 403, { error: "Origin not allowed" });
    return;
  }

  if (req.method === "OPTIONS") {
    handleAnalyticsOptions(req, res);
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" }, headers);
    return;
  }

  try {
    const body = await readBody(req);
    const payload = JSON.parse(body || "{}");
    appendEvent(createEvent(req, payload));
    sendJson(res, 204, {}, headers);
  } catch (error) {
    sendJson(res, 400, { error: "Invalid analytics payload" }, headers);
  }
}

function isAuthorized(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Basic ")) return false;

  let decoded = "";
  try {
    decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  } catch {
    return false;
  }

  const separator = decoded.indexOf(":");
  if (separator < 0) return false;
  const user = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);

  return timingSafeEqual(user, ADMIN_USER) && timingSafeEqual(password, ADMIN_PASSWORD);
}

function timingSafeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function requireAdmin(req, res) {
  if (isAuthorized(req)) return true;
  send(res, 401, "Authentication required", "text/plain; charset=utf-8", {
    "WWW-Authenticate": 'Basic realm="Analytics"',
  });
  return false;
}

function loadEvents(limit = 10000) {
  if (!fs.existsSync(EVENTS_FILE)) return [];
  const lines = fs.readFileSync(EVENTS_FILE, "utf8").trim().split("\n").filter(Boolean);
  return lines
    .slice(-limit)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function countBy(events, key) {
  const counts = new Map();
  for (const event of events) {
    const value = event[key] || "Unknown";
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([label, count]) => ({ label, count }));
}

function summarizeEvents(events) {
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const unique = new Set(events.map((event) => event.ipPrefixHash).filter(Boolean));
  const last24h = events.filter((event) => Date.parse(event.ts) >= dayAgo);

  return {
    total: events.length,
    last24h: last24h.length,
    approximateVisitors: unique.size,
    pages: countBy(events, "path"),
    referrers: countBy(events.filter((event) => event.referrer), "referrer"),
    browsers: countBy(events, "browser"),
    systems: countBy(events, "os"),
    devices: countBy(events, "device"),
    recent: events.slice(-50).reverse(),
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTable(rows) {
  if (!rows.length) return '<p class="empty">No data yet.</p>';
  return `<table><tbody>${rows
    .map(
      (row) =>
        `<tr><td>${escapeHtml(row.label)}</td><td class="num">${row.count}</td></tr>`
    )
    .join("")}</tbody></table>`;
}

function renderAdminPage(summary) {
  const recentRows = summary.recent
    .map(
      (event) => `<tr>
        <td>${escapeHtml(new Date(event.ts).toLocaleString())}</td>
        <td>${escapeHtml(event.path)}</td>
        <td>${escapeHtml(event.referrer || "-")}</td>
        <td>${escapeHtml(event.device)} / ${escapeHtml(event.browser)} / ${escapeHtml(event.os)}</td>
        <td>${escapeHtml(event.viewport)}</td>
        <td>${escapeHtml(event.ipPrefixHash)}</td>
      </tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Visitor Analytics</title>
  <style>
    :root { color-scheme: light dark; --line: #d7dde5; --muted: #627084; --bg: #f6f8fb; --panel: #fff; --text: #16202f; }
    @media (prefers-color-scheme: dark) {
      :root { --line: #354052; --muted: #a6b0bf; --bg: #10151f; --panel: #171e2b; --text: #edf2f7; }
    }
    body { margin: 0; background: var(--bg); color: var(--text); font: 14px/1.5 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    main { max-width: 1180px; margin: 0 auto; padding: 28px 18px 48px; }
    h1 { font-size: 28px; margin: 0 0 20px; }
    h2 { font-size: 16px; margin: 0 0 12px; }
    .stats, .grid { display: grid; gap: 14px; }
    .stats { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 18px; }
    .grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    .panel { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 16px; overflow: auto; }
    .metric { font-size: 30px; font-weight: 700; }
    .label, .empty { color: var(--muted); }
    table { border-collapse: collapse; width: 100%; }
    td, th { border-top: 1px solid var(--line); padding: 8px 6px; text-align: left; vertical-align: top; }
    tr:first-child td { border-top: 0; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .recent { margin-top: 14px; }
    .recent table { min-width: 900px; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  </style>
</head>
<body>
  <main>
    <h1>Visitor Analytics</h1>
    <section class="stats">
      <div class="panel"><div class="metric">${summary.total}</div><div class="label">Total page views</div></div>
      <div class="panel"><div class="metric">${summary.last24h}</div><div class="label">Views in last 24 hours</div></div>
      <div class="panel"><div class="metric">${summary.approximateVisitors}</div><div class="label">Approximate visitor groups</div></div>
    </section>
    <section class="grid">
      <div class="panel"><h2>Top Pages</h2>${renderTable(summary.pages)}</div>
      <div class="panel"><h2>Referrers</h2>${renderTable(summary.referrers)}</div>
      <div class="panel"><h2>Devices</h2>${renderTable(summary.devices)}</div>
      <div class="panel"><h2>Browsers</h2>${renderTable(summary.browsers)}</div>
      <div class="panel"><h2>Systems</h2>${renderTable(summary.systems)}</div>
    </section>
    <section class="panel recent">
      <h2>Recent Page Views</h2>
      <table>
        <thead><tr><th>Time</th><th>Path</th><th>Referrer</th><th>Device</th><th>Viewport</th><th>IP prefix hash</th></tr></thead>
        <tbody>${recentRows || '<tr><td colspan="6" class="empty">No data yet.</td></tr>'}</tbody>
      </table>
    </section>
  </main>
</body>
</html>`;
}

function handleAdmin(req, res) {
  if (!requireAdmin(req, res)) return;
  const summary = summarizeEvents(loadEvents());
  send(res, 200, renderAdminPage(summary), "text/html; charset=utf-8", {
    "Cache-Control": "no-store",
  });
}

function handleStatic(req, res, url) {
  const pathname = decodeURIComponent(url.pathname);
  const requested = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, requested));
  const relativePath = path.relative(PUBLIC_DIR, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    send(res, 403, "Forbidden");
    return;
  }

  let target = filePath;
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    target = path.join(target, "index.html");
  }

  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    const notFound = path.join(PUBLIC_DIR, "404.html");
    if (fs.existsSync(notFound)) {
      send(res, 404, fs.readFileSync(notFound), "text/html; charset=utf-8");
      return;
    }
    send(res, 404, "Not found");
    return;
  }

  const ext = path.extname(target).toLowerCase();
  send(res, 200, fs.readFileSync(target), MIME_TYPES[ext] || "application/octet-stream");
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/healthz") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (url.pathname === "/api/analytics") {
    handleAnalytics(req, res);
    return;
  }

  if (url.pathname === "/admin/analytics") {
    handleAdmin(req, res);
    return;
  }

  handleStatic(req, res, url);
});

ensureDataDir();
server.listen(PORT, () => {
  if (ADMIN_PASSWORD === "change-me") {
    console.warn("ADMIN_PASSWORD is not set. Set it before exposing the server publicly.");
  }
  console.log(`Portfolio server listening on http://localhost:${PORT}`);
  console.log(`Analytics dashboard: http://localhost:${PORT}/admin/analytics`);
});
