const buildContentSecurityPolicy = (nonce) => [
  "default-src 'self'",
  `script-src 'nonce-${nonce}'`,
  `script-src-elem 'nonce-${nonce}'`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' https://images.unsplash.com data:",
  "font-src 'self' https://fonts.gstatic.com data:",
  "connect-src 'self'",
  "frame-src 'none'",
  "child-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

export default async (_request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("text/html")) return response;

  const randomBytes = new Uint8Array(24);
  crypto.getRandomValues(randomBytes);
  const nonce = btoa(String.fromCharCode(...randomBytes));
  const html = await response.text();
  let scriptCount = 0;
  const securedHtml = html.replace(/<script\b([^>]*)>/gi, (tag, attributes) => {
    if (/\bnonce\s*=/i.test(attributes)) return tag;
    scriptCount += 1;
    return `<script nonce="${nonce}"${attributes}>`;
  });

  if (scriptCount === 0) {
    return new Response("A página não contém o script esperado para aplicar a política de segurança.", {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }

  const headers = new Headers(response.headers);
  headers.set("content-security-policy", buildContentSecurityPolicy(nonce));
  headers.set("cache-control", "no-store, max-age=0");
  headers.delete("content-length");
  headers.delete("content-encoding");
  headers.delete("etag");
  headers.delete("last-modified");
  headers.delete("content-md5");
  headers.delete("accept-ranges");

  return new Response(securedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const config = { path: ["/", "/index.html"] };
