const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";
const BATCH_INTERVAL_MS = 2000;
const MAX_BATCH_SIZE = 20;
const MAX_QUEUE_SIZE = 5000;
const DISCORD_MESSAGE_CHAR_LIMIT = 1900;
const FETCH_TIMEOUT_MS = 5000;
const MAX_SEND_RETRIES = 2;

let logQueue = [];
let sending = false;

const hasFetch = typeof fetch === "function";

function safeStringify(obj) {
  try {
    const str = JSON.stringify(obj, (_, v) =>
      typeof v === "bigint" ? String(v) : v
    );
    return str === "{}" ? "" : str;
  } catch {
    try {
      return String(obj);
    } catch {
      return "[unserializable]";
    }
  }
}

function short(str, max = 600) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max - 3) + "..." : str;
}

function formatPart(label, content, maxLength) {
  if (!content) return "";
  return `${label}: \`${short(content, maxLength)}\``;
}

function formatLogItem(l) {
  const time = l.time;
  const method = l.method || "-";
  const route = l.route || l.path || "-";
  const ip = l.ip || "-";
  const ua = l.ua || "-";

  const params = formatPart("🔢 Params", safeStringify(l.params || {}), 300);
  const query = formatPart("❓ Query", safeStringify(l.query || {}), 300);
  const body = formatPart("🗂 Body", safeStringify(l.body || {}), 800);

  return [
    `🔔 **[${time}] ${method} ${route}**`,
    `🛰 IP: \`${ip}\` • 🧭 UA: \`${short(ua, 120)}\``,
    params,
    query,
    body,
  ].filter(Boolean).join("\n");
}

async function fetchWithTimeout(url, opts = {}, timeout = FETCH_TIMEOUT_MS) {
  if (!hasFetch) throw new Error("fetch not available in this runtime");
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function trySendToDiscord(body) {
  for (let attempt = 0; attempt <= MAX_SEND_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 429) {
        const json = await res.json().catch(() => ({}));
        return { ok: false, rateLimited: true, retryAfter: (json.retry_after || 1) * 1000 };
      }
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        return { ok: false, reason: `status_${res.status}`, text: txt };
      }
      return { ok: true };
    } catch (err) {
      if (attempt === MAX_SEND_RETRIES) return { ok: false, reason: "network", error: String(err) };
      await new Promise(r => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  return { ok: false, reason: "unknown" };
}

export async function sendToDiscord(content) {
  if (!WEBHOOK_URL) return { ok: false, reason: "no_webhook" };
  if (!hasFetch) return { ok: false, reason: "no_fetch_available" };
  return trySendToDiscord({ content });
}

function splitIntoChunks(batch) {
  const chunks = [];
  let current = "";
  for (const item of batch) {
    const block = formatLogItem(item);
    const candidate = current ? `${current}\n\n${block}` : block;
    if (candidate.length > DISCORD_MESSAGE_CHAR_LIMIT) {
      if (current) {
        chunks.push(current);
        current = block;
      } else {
        chunks.push(block.slice(0, DISCORD_MESSAGE_CHAR_LIMIT - 3) + "...");
        current = "";
      }
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function flushBatch(batch) {
  if (!batch || batch.length === 0) return { ok: true };
  const chunks = splitIntoChunks(batch);

  for (const chunk of chunks) {
    const res = await sendToDiscord(chunk);
    if (!res.ok && res.rateLimited) return { ok: false, retryAfter: res.retryAfter };
    if (!res.ok) return { ok: false, reason: res.reason || res.text || "unknown" };
  }
  return { ok: true };
}

async function sendLogsLoop() {
  if (sending || logQueue.length === 0) return;
  sending = true;

  const batch = logQueue.splice(0, Math.min(MAX_BATCH_SIZE, logQueue.length));
  const res = await flushBatch(batch);

  if (!res.ok) {
    logQueue.unshift(...batch);
    if (res.retryAfter) {
      setTimeout(() => {
        sending = false;
        sendLogsLoop();
      }, res.retryAfter + 200);
      return;
    }
  }

  sending = false;
}

setInterval(() => {
  if (logQueue.length > 0) sendLogsLoop();
}, BATCH_INTERVAL_MS);

function extractRequestData(req) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || req.socket?.remoteAddress || "-";
  const ua = req.headers["user-agent"] || "-";
  return {
    method: req.method,
    route: req.originalUrl || req.url,
    path: req.path,
    params: req.params,
    query: req.query,
    body: req.body,
    ip,
    ua,
    time: new Date().toISOString(),
  };
}

export function discordLogMiddleware(req, res, next) {
  try {
    const item = extractRequestData(req);
    if (logQueue.length >= MAX_QUEUE_SIZE) logQueue.shift();
    logQueue.push(item);
  } catch (e) {
    console.error("[discordLogger] enqueue failed", String(e));
  }
  next();
}

export async function logToDiscord(item) {
  try {
    const content = `⚠️ **Rate Limit Exceeded**\n[${item.time}] ${item.method} ${item.path}\nIP: ${item.ip}\nUA: ${item.ua}`;
    const res = await sendToDiscord(content);
    if (!res.ok) console.warn("[discordLogger] logToDiscord failed", res);
  } catch (e) {
    console.error("[discordLogger] logToDiscord exception", String(e));
  }
}

export function _inspectQueue() {
  return {
    length: logQueue.length,
    sending,
    webhookPresent: !!WEBHOOK_URL,
    fetchPresent: hasFetch,
  };
}
