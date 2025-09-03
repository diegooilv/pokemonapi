import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { logToDiscord } from "./discordLogger.js";

const getEnvInt = (name, fallback) => {
  const raw = process.env[name];
  if (raw == null || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
};

const parseDevKeys = () => {
  const raw = process.env.DEV_KEYS || "";
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
};

const getProvidedKeyFromReq = (req) => {
  const header =
    req.get("x-api-key") || req.get("key") || req.get("authorization") || "";
  return header.replace(/^Bearer\s+/i, "").trim();
};

const isExemptPath = (req) => {
  const p = req.path || req.url || "";
  return p.startsWith("/docs") || p.startsWith("/dex");
};

const blockedPaths = [
  /vendor\/phpunit/i,
  /\.env$/i,
  /\.htaccess$/i,
  /\.bak$/i,
  /\.zip$/i,
  /\.tar\.gz$/i,
  /\.7z$/i,
  /wwwroot/i,
  /backup/i,
  /configs?/i
];

const isSuspicious = (req) => {
  const p = req.originalUrl || req.url || "";
  return blockedPaths.some((rx) => rx.test(p));
};

const getIp = (req) => {
  const cf = req.headers && req.headers["cf-connecting-ip"];
  if (cf) return cf;
  const xff = req.headers && req.headers["x-forwarded-for"];
  if (xff) return String(xff).split(",")[0].trim();
  return req.ip || "";
};

const createApiLimiter = ({ windowMs, max, ipv6Subnet }) => {
  const keyGenerator = (req) => {
    if (!req) return "";
    return ipKeyGenerator(getIp(req), ipv6Subnet === undefined ? undefined : ipv6Subnet);
  };

  return rateLimit({
    windowMs,
    max,
    keyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === "OPTIONS",
    handler: async (req, res, next, options) => {
      const log = {
        method: req.method,
        path: req.originalUrl || req.url,
        ip: getIp(req),
        ua: req.headers["user-agent"] || "-",
        time: new Date().toISOString(),
        reason: "RATE_LIMIT_EXCEEDED"
      };
      try {
        await logToDiscord(log);
      } catch (e) {}
      const retryAfterSec = Math.ceil(windowMs / 1000);
      res.set("Retry-After", String(retryAfterSec));
      const status = (options && options.statusCode) || 429;
      return res.status(status).json({ error: "Muitas requisições. Tente novamente mais tarde." });
    }
  });
};

const WINDOW_MS = getEnvInt("RATE_LIMIT_WINDOW_MS", 5 * 60 * 1000);
const MAX_REQUESTS = getEnvInt("RATE_LIMIT_MAX", 15);
const IPV6_SUBNET_RAW = process.env.RATE_LIMIT_IPV6_SUBNET;
const IPV6_SUBNET =
  IPV6_SUBNET_RAW == null || IPV6_SUBNET_RAW === ""
    ? undefined
    : IPV6_SUBNET_RAW.toLowerCase() === "false"
    ? false
    : Number.isFinite(Number(IPV6_SUBNET_RAW))
    ? Number(IPV6_SUBNET_RAW)
    : undefined;

const devKeys = parseDevKeys();

const apiLimiter = createApiLimiter({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  ipv6Subnet: IPV6_SUBNET
});

export default async function limiterMiddleware(req, res, next) {
  if (isExemptPath(req)) return next();

  const providedKey = getProvidedKeyFromReq(req);
  if (providedKey && devKeys.includes(providedKey)) return next();

  if (isSuspicious(req)) {
    const log = {
      method: req.method,
      path: req.originalUrl || req.url,
      ip: getIp(req),
      ua: req.headers["user-agent"] || "-",
      time: new Date().toISOString(),
      reason: "SUSPICIOUS_PATH_BLOCKED"
    };
    try {
      await logToDiscord(log);
    } catch (e) {}
    return res.status(403).json({ error: "Acesso proibido" });
  }

  return apiLimiter(req, res, next);
}
