// Microsoft Clarity integration for the booking widget.
//
// The widget runs inside an iframe, so Clarity here records the widget's own
// session (the booking funnel interactions), which is exactly what we want for
// funnel analysis. Gated behind REACT_APP_ANALYTICS_ENABLED so QA/test builds
// never load Clarity or pollute the project (mirrors next-app's analytics flag).
//
// CRA inlines `process.env.REACT_APP_*` at build time, so these literals must be
// referenced directly (no destructuring) and set in the production build env.

const ANALYTICS_ENABLED = process.env.REACT_APP_ANALYTICS_ENABLED === "true";
const CLARITY_ID = process.env.REACT_APP_CLARITY_ID;

/** Inject the standard Microsoft Clarity snippet. No-op if disabled/missing. */
export function initClarity() {
  if (!ANALYTICS_ENABLED || !CLARITY_ID) return;
  if (typeof window === "undefined" || window.clarity) return;
  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", CLARITY_ID);
}

/** Tag the current Clarity session with the funnel step it reached. */
export function clarityFunnelStep(step) {
  if (typeof window !== "undefined" && window.clarity) {
    window.clarity("set", "funnel_step", String(step));
  }
}

/** Fire a custom Clarity event. */
export function clarityEvent(name) {
  if (typeof window !== "undefined" && window.clarity) {
    window.clarity("event", name);
  }
}

/**
 * Single entry point the components call at each funnel phase. Sets the
 * funnel_step tag and, on completion, fires a `booking_completed` event so
 * sessions can be filtered/funnelled in the Clarity dashboard.
 */
export function trackFunnel(step) {
  clarityFunnelStep(step);
  if (Number(step) >= 4) clarityEvent("booking_completed");
}
