import crypto from "crypto";

export function cspMiddleware(req, res, next) {
  // nonce único por requisição (use no HTML: <script nonce="...">)
  const nonce = crypto.randomBytes(16).toString("base64");
  res.locals.nonce = nonce;

  const csp = [
    "default-src 'self'",
    `script-src 'self' https://static.cloudflareinsights.com https://pokemon.diegooilv.xyz 'nonce-${nonce}'`,
    "style-src 'self' https://fonts.googleapis.com https://pokemon.diegooilv.xyz",
    "font-src 'self' https://fonts.gstatic.com https://pokemon.diegooilv.xyz",
    "img-src 'self' https://pokemon.diegooilv.xyz",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  res.setHeader("Content-Security-Policy", csp);

  // Clickjacking protection
  res.setHeader("X-Frame-Options", "DENY");

  // COOP/COEP: COOP same-origin é seguro. COEP require-corp isola completamente
  // ATENÇÃO: se usar COEP: require-corp, terceiros (Google Fonts/Cloudflare) podem quebrar
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  // res.setHeader("Cross-Origin-Embedder-Policy", "require-corp"); // habilitar só se TODOS os recursos suportarem CORP

  // HSTS — força HTTPS 
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Outros headers de segurança
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  next();
}
