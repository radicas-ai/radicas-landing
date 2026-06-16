/** GA4 measurement id, or undefined when analytics is disabled. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

/** Fire a GA4 event when analytics is configured; a safe no-op otherwise. */
export function track(event: string, params: GtagParams = {}): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}
