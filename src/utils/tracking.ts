export type ShopCtaEvent = {
  page_slug: string;
  cta_position: string;
  cta_text: string;
  destination_url: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    aiToolsGuideTrack?: (eventName: string, payload: ShopCtaEvent) => void;
  }
}

export function trackShopCta(payload: ShopCtaEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event: "shop_cta_click", ...payload });
  window.aiToolsGuideTrack?.("shop_cta_click", payload);
}
