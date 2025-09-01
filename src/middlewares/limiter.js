import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// Limiter da API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req, res) => ipKeyGenerator(req),

  skip: (req) => req.headers.origin === "https://dex.diegooilv.xyz",

  handler: (req, res, options) => {
    const ip = req.ip;
    const url = req.originalUrl;

    console.log(`[RATE LIMIT] IP atingiu limite: ${ip} - URL: ${url}`);
    console.warn(`[RATE LIMIT] Bloqueado: ${ip}`);

    res.status(429).json({
      error: "Muitas requisições. Tente novamente mais tarde.",
    });
  },
});

export function conditionalLimiter(req, res, next) {
  if (req.path.startsWith("/docs") || req.path.startsWith("/dex")) {
    return next();
  }

  const devKeys = process.env.DEV_KEYS?.split(",") || [];
  const providedKey = req.headers["key"];

  if (providedKey && devKeys.includes(providedKey)) {
    return next();
  }

  apiLimiter(req, res, next);
}
