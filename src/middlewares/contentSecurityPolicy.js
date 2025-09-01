export function cspMiddleware(req, res, next) {
  // Content Security Policy (permite script do Cloudflare)
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self';
     script-src 'self' https://static.cloudflareinsights.com https://pokemon.diegooilv.xyz 'nonce-${nonce}';
     style-src 'self' https://fonts.googleapis.com https://pokemon.diegooilv.xyz;
     font-src 'self' https://fonts.gstatic.com https://pokemon.diegooilv.xyz;
     object-src 'none';
     base-uri 'self';
     frame-ancestors 'none';`
  );

  // Bloqueia a página de ser carregada em iframes
  res.setHeader("X-Frame-Options", "DENY");

  // Isolamento de contexto para SharedArrayBuffer e segurança cross-origin
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

  // HSTS — força HTTPS
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Outros headers de segurança opcionais
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  next();
}
