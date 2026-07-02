import './lib/sentry.server';
import { PassThrough } from "node:stream";
import type { EntryContext } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onShellReady() {
          responseHeaders.set("Content-Type", "text/html");
          responseHeaders.set("X-Content-Type-Options", "nosniff");
          responseHeaders.set("X-Frame-Options", "DENY");
          responseHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
          responseHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
          responseHeaders.set("X-DNS-Prefetch-Control", "on");

          const plausibleApiHost = process.env.PLAUSIBLE_API_HOST || "";

          const scriptSrc = ["'self'", "'unsafe-inline'"].join(" ");
          const connectSrc = ["'self'", "https:", plausibleApiHost]
            .filter(Boolean)
            .join(" ");

          responseHeaders.set(
            "Content-Security-Policy",
            [
              "default-src 'self'",
              `script-src ${scriptSrc}`,
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "img-src 'self' data: https:",
              `connect-src ${connectSrc}`,
              "frame-ancestors 'none'",
            ].join("; ")
          );

          if (!responseHeaders.has("Cache-Control")) {
            responseHeaders.set(
              "Cache-Control",
              "public, max-age=60, s-maxage=300, stale-while-revalidate=3600"
            );
          }

          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          import('./lib/sentry.server').then(({ Sentry }) => {
            Sentry?.captureException(error);
          }).catch(() => {});
          reject(error);
        },
      }
    );
  });
}
