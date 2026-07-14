import { createContext, useContext } from "react";

/**
 * Per-request CSP nonce.
 *
 * The server generates one nonce per response (entry.server.tsx), puts it in the
 * Content-Security-Policy header, and provides it here so root.tsx can stamp it
 * onto the inline scripts we legitimately emit. Anything injected into the page
 * WITHOUT the nonce — say, a `<script>` smuggled through CMS content — will not
 * match the header and the browser refuses to run it.
 *
 * On the client this is "": the scripts are already in the DOM, and browsers
 * deliberately hide the nonce attribute's value from JavaScript, so there is
 * nothing to re-apply at hydration.
 */
export const NonceContext = createContext<string>("");

export const NonceProvider = NonceContext.Provider;

export function useNonce(): string {
  return useContext(NonceContext);
}
