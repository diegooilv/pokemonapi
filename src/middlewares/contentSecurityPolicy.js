export function cspMiddleware(req, res, next) {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://pokemon.diegooilv.xyz",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://pokemon.diegooilv.xyz",
    "font-src 'self' https://fonts.gstatic.com https://pokemon.diegooilv.xyz",
    "img-src 'self' https://pokemon.diegooilv.xyz data:",
    "connect-src 'self' https://dex.diegooilv.xyz https://api.github.com",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  res.setHeader("Content-Security-Policy", csp);
  next();
}
