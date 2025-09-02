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

const createApiLimiter = ({ windowMs, max, ipv6Subnet }) => {
  const keyGenerator = (req) => {
    if (!req) return "";
    return ipKeyGenerator(
      req.ip,
      ipv6Subnet === undefined ? undefined : ipv6Subnet
    );
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
        ip: req.ip,
        ua: req.headers["user-agent"] || "-",
        time: new Date().toISOString(),
        reason: "RATE_LIMIT_EXCEEDED",
      };
      await logToDiscord(log);
      const retryAfterSec = Math.ceil(windowMs / 1000);
      res.set("Retry-After", String(retryAfterSec));
      const status = (options && options.statusCode) || 429;
      return res
        .status(status)
        .json({ error: "Muitas requisições. Tente novamente mais tarde." });
    },
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
  ipv6Subnet: IPV6_SUBNET,
});

export default function limiterMiddleware(req, res, next) {
  if (isExemptPath(req)) return next();

  const providedKey = getProvidedKeyFromReq(req);

  if (providedKey && devKeys.includes(providedKey)) return next();

  return apiLimiter(req, res, next);
}
