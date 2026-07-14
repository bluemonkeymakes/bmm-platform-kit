import * as React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";
import type { LinksFunction, LoaderFunctionArgs } from "react-router";

import "./app.css";
import { ThemeProvider } from "~/components/layout/ThemeProvider";
import { ToastProvider } from "~/components/ui/toast";
import { Header } from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { ErrorPage } from "~/components/common/ErrorPage";
import { usePlausible } from "~/lib/plausible";
import { useNonce } from "~/lib/nonce";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/png", href: "/favicon.png" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return {
    siteName: process.env.SITE_NAME || "Starter Kit",
    plausibleDomain: process.env.PLAUSIBLE_DOMAIN || "",
    plausibleApiHost: process.env.PLAUSIBLE_API_HOST || "",
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  // Per-request CSP nonce. Every inline script we emit must carry it, or the
  // browser will refuse to run it in production. See lib/nonce.ts.
  const nonce = useNonce();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Applies the stored theme before first paint, so dark mode doesn't flash. */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-neutral-50 text-neutral-800 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-toast focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          Skip to content
        </a>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const { plausibleDomain, plausibleApiHost } = useLoaderData<typeof loader>();
  usePlausible(plausibleDomain, plausibleApiHost);

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main id="main-content" className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;
  const status = isRouteErrorResponse(error) ? error.status : 500;

  if (!is404 && error instanceof Error && typeof window !== "undefined") {
    import("~/lib/sentry.client").then(({ Sentry }) => {
      Sentry?.captureException(error);
    }).catch(() => {});
  }

  return (
    <ErrorPage
      status={status}
      title={is404 ? "Page not found" : "Something went wrong"}
      description={
        is404
          ? "This page doesn't exist, but we can help you find what you're looking for."
          : "We're sorry, but something unexpected happened. Please try again."
      }
    />
  );
}
