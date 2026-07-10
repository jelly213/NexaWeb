/// <reference types="vite/client" />

declare module '*.JPG' {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  /**
   * GA4 Measurement ID (G-XXXXXXX). Public by design — gtag exposes it anyway.
   * When unset, GA4 is dead code and the consent banner does not render.
   * Secrets (STATS_BEARER, CF_API_TOKEN, CF_ACCOUNT_ID) must NEVER take a VITE_ prefix:
   * Vite inlines every VITE_* value into the public client bundle.
   */
  readonly VITE_GA4_ID?: string;

  /**
   * Event-sink URL. Defaults to https://events.nexaweb.dev/e (the nexaweb-events Worker).
   * Public by design — it is a write-only, cookieless endpoint.
   */
  readonly VITE_EVENTS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
