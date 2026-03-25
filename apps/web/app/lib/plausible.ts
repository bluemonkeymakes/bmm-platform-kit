import { useEffect, useRef } from "react";

let trackFn: typeof import("@plausible-analytics/tracker").track | null = null;

/**
 * Initialises Plausible Analytics and enables automatic page-view tracking.
 * Call once in the root component. Skips initialisation when domain/apiHost are empty.
 */
export function usePlausible(domain: string, apiHost: string) {
  const initRef = useRef(false);

  useEffect(() => {
    if (!domain || !apiHost) return;
    if (initRef.current) return;
    initRef.current = true;

    import("@plausible-analytics/tracker").then(({ init, track }) => {
      const endpoint = apiHost.replace(/\/+$/, "") + "/api/event";
      init({
        domain,
        endpoint,
        autoCapturePageviews: true,
        captureOnLocalhost: false,
      });
      trackFn = track;
    });
  }, [domain, apiHost]);
}

/**
 * Fire a custom Plausible event. Safe to call before init.
 */
export function trackEvent(eventName: string, props?: Record<string, string>) {
  if (!trackFn) return;
  trackFn(eventName, { props });
}
