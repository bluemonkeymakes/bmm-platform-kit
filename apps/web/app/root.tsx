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
import { Header } from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { ErrorPage } from "~/components/common/ErrorPage";
import { usePlausible } from "~/lib/plausible";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          Skip to content
        </a>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { plausibleDomain, plausibleApiHost } = useLoaderData<typeof loader>();
  usePlausible(plausibleDomain, plausibleApiHost);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
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
