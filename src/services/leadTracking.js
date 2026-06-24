// Centralized booking-funnel lead tracking against the LB API
// (`/api/book/clients`). Mirrors the 6-phase model used by the Next.js app:
// the lead is CREATED once (step 0) and UPDATED through steps 0.5 → 4 reusing
// the same partititonKey/orderKey. Previously these fetches were scattered
// across App.js, selectTimeAppointment-v2.js and boookAppointment.js.
//
// Spelling note (backend contract):
//   - POST create RESPONSE returns `partititonKey` (misspelled) + `orderKey`.
//   - PUT update BODY expects `partitionKey` (correct spelling).
// We keep `partititonKey` everywhere internally and translate to `partitionKey`
// only when building the PUT body, here, in one place.
import moment from "moment";

const API_URL = process.env.REACT_APP_API_URL;

const headers = (authorization, siteId) => ({
  "Content-type": "application/json; charset=UTF-8",
  authorization,
  siteid: siteId,
});

const digits = (v) => String(v ?? "").replace(/[^0-9]/gi, "");

/**
 * POST a new incomplete-booking lead. Handles `name` natively (the POST route
 * stores it explicitly, unlike the dynamic PUT). Returns { partititonKey, orderKey }.
 */
export async function createLead({
  authorization,
  siteId,
  name = "",
  mobilePhone = "",
  email = "",
  service = "",
  clientId = "n/a",
  step,
  language,
  dateTime,
}) {
  const body = {
    siteId,
    name,
    mobilePhone: digits(mobilePhone),
    email,
    service,
    clientId: clientId || "n/a",
    dateTime: dateTime || moment().format("YYYY-MM-DD[T]HH:mm:ss").toString(),
    step,
    language,
  };
  const res = await fetch(`${API_URL}/api/book/clients`, {
    method: "POST",
    headers: headers(authorization, siteId),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`createLead failed: ${res.status}`);
  return res.json(); // { partititonKey, orderKey }
}

/**
 * PUT an update onto an existing lead. `fields` is any subset of
 * { step, name, mobilePhone, email, service, dateTimeSeleted, clientId }.
 * The backend aliases attribute names, so reserved words like `name` are safe.
 */
export async function updateLead({ authorization, siteId, partititonKey, orderKey, fields = {} }) {
  const body = { partitionKey: partititonKey, orderKey, ...fields };
  if (body.mobilePhone != null) body.mobilePhone = digits(body.mobilePhone);
  const res = await fetch(`${API_URL}/api/book/clients`, {
    method: "PUT",
    headers: headers(authorization, siteId),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`updateLead failed: ${res.status}`);
  return res.json().catch(() => ({}));
}

/**
 * Unload safety net: ship a final lead write while the tab is closing.
 * Uses `fetch(..., {keepalive:true})` because it CAN carry the auth/siteid
 * headers the backend requires (navigator.sendBeacon cannot set headers and
 * would 401). Best-effort, fire-and-forget.
 */
export function flushLeadKeepalive({ authorization, siteId, method, body }) {
  try {
    const payload = { ...body };
    if (payload.mobilePhone != null) payload.mobilePhone = digits(payload.mobilePhone);
    fetch(`${API_URL}/api/book/clients`, {
      method,
      headers: headers(authorization, siteId),
      body: JSON.stringify(payload),
      keepalive: true,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * DEPRECATED — leads are no longer deleted on booking success; we PUT step 4
 * and keep the row so the funnel report can count conversions. Kept exported
 * in case a manual cleanup path is ever needed.
 */
export async function deleteLead({ authorization, siteId, partititonKey, orderKey }) {
  const res = await fetch(`${API_URL}/api/book/clients`, {
    method: "DELETE",
    headers: headers(authorization, siteId),
    body: JSON.stringify({ partititonKey, orderKey }),
  });
  if (!res.ok) throw new Error(`deleteLead failed: ${res.status}`);
  return res.json().catch(() => ({}));
}
