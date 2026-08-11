type EventName =
  | 'tool_view'
  | 'tool_start'
  | 'tool_complete'
  | 'tool_download'
  | 'tool_copy'
  | 'related_tool_click'
  | 'favorite_add'
  | 'favorite_remove'
  | 'search'
  | 'search_result_click'
  | 'language_change'
  | 'theme_change';

interface EventPayload {
  tool_id?: string;
  tool_slug?: string;
  query?: string;
  result_count?: number;
  locale?: string;
  theme?: string;
  [key: string]: unknown;
}

let gtagLoaded = false;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function initAnalytics(id?: string) {
  if (!id || typeof window === 'undefined') return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { send_page_view: false });
  gtagLoaded = true;
}

export function track(name: EventName, payload: EventPayload = {}) {
  if (typeof window === 'undefined') return;
  if (gtagLoaded && window.gtag) {
    window.gtag('event', name, payload);
  }
  window.dispatchEvent(new CustomEvent('calcuio:analytics', { detail: { name, payload } }));
}
