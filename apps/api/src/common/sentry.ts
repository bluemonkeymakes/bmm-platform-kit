// Sentry / GlitchTip error tracking — must be first import in main.ts
// Only reports 5xx errors. Strips auth headers from events.
// Set SENTRY_DSN to enable. Leave unset in development.

let Sentry: { init: Function; captureException: Function } | null = null;

try {
  // Loaded defensively: @sentry/node is a declared dependency, but the require
  // is wrapped so a missing/broken install degrades to "no error tracking"
  // rather than crashing boot.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sentry = require('@sentry/node');
  const dsn = process.env.SENTRY_DSN;
  if (dsn) {
    sentry.init({
      dsn,
      environment: process.env.NODE_ENV || 'development',
      sendDefaultPii: false,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      beforeSend(event: any) {
        const statusCode = event.extra?.statusCode as number | undefined;
        if (statusCode && statusCode >= 400 && statusCode < 500) return null;
        if (event.request?.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
        }
        return event;
      },
    });
    Sentry = sentry;
  }
} catch {
  // @sentry/node not installed — silently skip
}

export { Sentry };
