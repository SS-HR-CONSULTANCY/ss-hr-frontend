import {
  logEvent,
  setCurrentScreen,
} from "firebase/analytics";
import { getFirebaseAnalytics } from "./firebase";

const IS_PRODUCTION = import.meta.env.VITE_ENVIRONMENT === "production";

/**
 * Track a page view / screen change.
 * Called automatically on every route change via usePageTracking hook.
 */
export const trackPageView = (path: string, title?: string): void => {
  if (!IS_PRODUCTION) return;

  const analytics = getFirebaseAnalytics();
  if (!analytics) return;

  const screenName = title ?? document.title;
  setCurrentScreen(analytics, screenName);
  logEvent(analytics, "page_view", {
    page_path: path,
    page_title: screenName,
    page_location: window.location.href,
  });
};

/**
 * Track a custom event.
 * @example trackEvent("contact_form_submit", { form_name: "Contact" })
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>,
): void => {
  if (!IS_PRODUCTION) return;

  const analytics = getFirebaseAnalytics();
  if (!analytics) return;

  logEvent(analytics, eventName, params);
};

// Re-export initGA alias so App.tsx stays the same
export { initFirebaseAnalytics as initGA } from "./firebase";
