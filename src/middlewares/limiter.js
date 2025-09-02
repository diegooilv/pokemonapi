// limiter.js
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { logToDiscord } from "./discordLogger.js";

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 min
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX) || 50;

const apiLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  keyGenerator: ipKeyGenerator, // usa IP por padrão
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  handler: (req, res) => {
    const log = {
      method: req.method,
      path: req.originalUrl || req.url,
      ip: req.ip,
      ua: req.headers["user-agent"] || "-",
      time: new Date().toISOString(),
      reason: "RATE_LIMIT_EXCEEDED",
    };
    logToDiscord(log);
    const retryAfterSec = Math.ceil(WINDOW_MS / 1000);
    res.set("Retry-After", String(retryAfterSec));
    res
      .status(429)
      .json({ error: "Muitas requisições. Tente novamente mais tarde." });
  },
});

export default function limiterMiddleware(req, res, next) {
  // rotas isentas
  if (req.path.startsWith("/docs") || req.path.startsWith("/dex")) {
    return next();
  }

  // permitir chaves de desenvolvimento
  const devKeys = (process.env.DEV_KEYS || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const providedKey = (
    req.get("x-api-key") ||
    req.get("key") ||
    req.get("authorization") ||
    ""
  )
    .replace(/^Bearer\s+/i, "")
    .trim();

  if (providedKey && devKeys.includes(providedKey)) {
    return next();
  }

  // aplica o limiter
  return apiLimiter(req, res, next);
}
