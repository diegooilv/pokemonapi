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

function formatLog(l) {
  const time = l.time;
  const method = l.method || "-";
  const route = l.route || l.path || "-";
  const ip = l.ip || "-";
  const ua = l.ua || "-";
  const params = short(safeStringify(l.params || {}), 300);
  const query = short(safeStringify(l.query || {}), 300);
  const body = short(safeStringify(l.body || {}), 800);
  const parts = [
    `🔔 **[${time}] ${method} ${route}**`,
    `🛰 IP: \`${ip}\` • 🧭 UA: \`${short(ua, 120)}\``,
    params ? `🔢 Params: \`${params}\`` : "",
    query ? `❓ Query: \`${query}\`` : "",
    body ? `🗂 Body: \`${body}\`` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return parts;
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

async function sendToDiscord(content) {
  console.debug(
    "[discordLogger] sendToDiscord called, webhook present?",
    !!WEBHOOK_URL
  );
  if (!WEBHOOK_URL) return { ok: false, reason: "no_webhook" };
  if (!hasFetch) return { ok: false, reason: "no_fetch_available" };

  const body = { content };
  for (let attempt = 0; attempt <= MAX_SEND_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 429) {
        const json = await res.json().catch(() => ({}));
        const retryAfter = (json.retry_after || 1) * 1000;
        console.warn(
          "[discordLogger] webhook rate limited, retryAfter=",
          retryAfter
        );
        return { ok: false, rateLimited: true, retryAfter };
      }
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error(
          `[discordLogger] webhook returned status ${res.status}`,
          txt
        );
        return { ok: false, reason: `status_${res.status}`, text: txt };
      }
      return { ok: true };
    } catch (err) {
      console.error(
        "[discordLogger] send attempt failed",
        attempt,
        String(err)
      );
      if (attempt === MAX_SEND_RETRIES)
        return { ok: false, reason: "network", error: String(err) };
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  return { ok: false, reason: "unknown" };
}

async function flushBatch(batch) {
  if (!batch || batch.length === 0) return { ok: true };
  const blocks = [];
  let current = "";
  for (const item of batch) {
    const block = formatLog(item);
    const candidate = current ? `${current}\n\n${block}` : block;
    if (candidate.length > DISCORD_MESSAGE_CHAR_LIMIT) {
      if (current) {
        blocks.push(current);
        current = block;
      } else {
        blocks.push(block.slice(0, DISCORD_MESSAGE_CHAR_LIMIT - 3) + "...");
        current = "";
      }
    } else {
      current = candidate;
    }
  }
  if (current) blocks.push(current);

  for (const chunk of blocks) {
    const res = await sendToDiscord(chunk);
    if (!res.ok && res.rateLimited) {
      return { ok: false, retryAfter: res.retryAfter };
    }
    if (!res.ok) {
      return { ok: false, reason: res.reason || res.text || "unknown" };
    }
  }
  return { ok: true };
}

async function sendLogsLoop() {
  if (sending) return;
  if (logQueue.length === 0) return;
  sending = true;
  const batch = logQueue.splice(0, Math.min(MAX_BATCH_SIZE, logQueue.length));
  console.debug("[discordLogger] attempting flushBatch, size=", batch.length);
  const res = await flushBatch(batch);
  if (!res.ok) {
    console.warn("[discordLogger] flushBatch failed", res);
    if (res.retryAfter) {
      logQueue.unshift(...batch);
      setTimeout(() => {
        sending = false;
        sendLogsLoop();
      }, res.retryAfter + 200);
      return;
    } else {
      logQueue.unshift(...batch);
    }
  }
  sending = false;
}

setInterval(() => {
  if (logQueue.length > 0) sendLogsLoop();
}, BATCH_INTERVAL_MS);

// Middleware principal — push na fila, sem bloquear
export function discordLogMiddleware(req, res, next) {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      "-";
    const ua = req.headers["user-agent"] || "-";
    const item = {
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
    if (logQueue.length >= MAX_QUEUE_SIZE) logQueue.shift();
    logQueue.push(item);
    console.debug("[discordLogger] enqueued log, queueLen=", logQueue.length);
  } catch (e) {
    console.error("[discordLogger] enqueue failed", String(e));
  }
  next();
}

// Função utilitária para ser usada por outros middlewares
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
