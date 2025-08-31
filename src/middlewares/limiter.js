import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Muitas requisições. Tente novamente mais tarde." },
});

export function conditionalLimiter(req, res, next) {
  const devKeys = process.env.DEV_KEYS?.split(",") || [];
  const providedKey = req.headers["key"];

  if (providedKey && devKeys.includes(providedKey)) {
    return next();
  }

  apiLimiter(req, res, next);
}
