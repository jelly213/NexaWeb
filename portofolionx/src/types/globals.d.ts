export {};

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget(options: { url: string }): void;
    };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
