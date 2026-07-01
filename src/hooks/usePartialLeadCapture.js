import { useEffect, useRef } from "react";
import { createLead, updateLead, flushLeadKeepalive } from "../services/leadTracking";
import { trackFunnel } from "../services/analytics";

const DEBOUNCE_MS = 1500;
const STEP_PARTIAL = 0.5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Step 0.5 of the funnel — the user typed a valid email OR a 10+ digit phone in
 * the register form but hasn't submitted yet. Promotes the step-0 lead to step
 * 0.5 with the captured contact info (or creates one if the step-0 create lost
 * a race). Fires once, debounced, with a keepalive unload safety net.
 *
 * React 17 + react-hook-form: this hook is mounted in App.js and fed the
 * `watch(...)` field values, plus leadState/setLeadState (App owns lead state).
 */
export default function usePartialLeadCapture({
  authorization,
  siteId,
  language,
  firstName,
  lastName,
  email,
  phone,
  service,
  leadState,
  setLeadState,
  disabled,
}) {
  // Latest values for the unload handler (bound once) and the debounced fire.
  const inputRef = useRef({});
  inputRef.current = {
    authorization,
    siteId,
    language,
    firstName,
    lastName,
    email,
    phone,
    service,
    leadState,
    disabled,
  };

  const phoneDigits = String(phone ?? "").replace(/\D/g, "");
  const hasContact = EMAIL_RE.test(email || "") || phoneDigits.length >= 10;
  const alreadySent = leadState.lastSentStep >= STEP_PARTIAL;
  const isValid =
    !disabled &&
    !!siteId &&
    !!authorization &&
    hasContact &&
    !alreadySent &&
    !leadState.inFlight;

  // Debounced promote to step 0.5 — fires once when contact first becomes valid.
  useEffect(() => {
    if (!isValid) return;
    const handle = setTimeout(async () => {
      const cur = inputRef.current;
      if (!cur.siteId || !cur.authorization) return;
      if (cur.leadState.lastSentStep >= STEP_PARTIAL) return;
      setLeadState((s) => ({ ...s, inFlight: true }));
      const fullName = `${cur.firstName || ""} ${cur.lastName || ""}`.trim();
      try {
        if (cur.leadState.partititonKey && cur.leadState.orderKey) {
          await updateLead({
            authorization: cur.authorization,
            siteId: cur.siteId,
            partititonKey: cur.leadState.partititonKey,
            orderKey: cur.leadState.orderKey,
            fields: {
              step: STEP_PARTIAL,
              name: fullName,
              mobilePhone: cur.phone,
              email: cur.email,
              service: cur.service,
            },
          });
          setLeadState((s) => ({ ...s, lastSentStep: STEP_PARTIAL, inFlight: false }));
        } else {
          const r = await createLead({
            authorization: cur.authorization,
            siteId: cur.siteId,
            name: fullName,
            mobilePhone: cur.phone,
            email: cur.email,
            service: cur.service,
            step: STEP_PARTIAL,
            language: cur.language,
          });
          setLeadState((s) => ({
            ...s,
            partititonKey: r.partititonKey,
            orderKey: r.orderKey,
            leadRegistered: true,
            lastSentStep: STEP_PARTIAL,
            inFlight: false,
          }));
        }
        trackFunnel(STEP_PARTIAL, {
          service: cur.service,
          lang: cur.language,
          site: cur.siteId,
        });
      } catch (e) {
        setLeadState((s) => ({ ...s, inFlight: false }));
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, setLeadState]);

  // Unload safety net — flush via keepalive if the debounce hasn't fired yet.
  useEffect(() => {
    function flush() {
      const cur = inputRef.current;
      if (!cur || cur.disabled || !cur.siteId || !cur.authorization) return;
      if (cur.leadState.lastSentStep >= STEP_PARTIAL) return;
      const d = String(cur.phone ?? "").replace(/\D/g, "");
      if (!EMAIL_RE.test(cur.email || "") && d.length < 10) return;
      const fullName = `${cur.firstName || ""} ${cur.lastName || ""}`.trim();
      if (cur.leadState.partititonKey && cur.leadState.orderKey) {
        flushLeadKeepalive({
          authorization: cur.authorization,
          siteId: cur.siteId,
          method: "PUT",
          body: {
            partitionKey: cur.leadState.partititonKey,
            orderKey: cur.leadState.orderKey,
            step: STEP_PARTIAL,
            name: fullName,
            mobilePhone: cur.phone,
            email: cur.email,
            service: cur.service,
          },
        });
      } else {
        flushLeadKeepalive({
          authorization: cur.authorization,
          siteId: cur.siteId,
          method: "POST",
          body: {
            siteId: cur.siteId,
            name: fullName,
            mobilePhone: cur.phone,
            email: cur.email,
            service: cur.service,
            clientId: "n/a",
            step: STEP_PARTIAL,
            language: cur.language,
          },
        });
      }
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") flush();
    }

    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
}
