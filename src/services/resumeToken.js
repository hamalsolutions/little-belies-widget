// Resume-booking token: opaque base64url encoding of the lead's identity
// (siteId + timestampSite + leadId). The leadId is a UUID, so the token is not
// enumerable. Encoded by the SMS lambda / link generator; decoded here.

const toBase64Url = (s) =>
  btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const fromBase64Url = (s) => {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : "";
  return atob(b64 + pad);
};

export function encodeResumeToken({ siteId, timestampSite, leadId }) {
  return toBase64Url(`${siteId}:${timestampSite}:${leadId}`);
}

export function decodeResumeToken(token) {
  try {
    const [siteId, timestampSite, leadId] = fromBase64Url(token).split(":");
    if (!siteId || !timestampSite || !leadId) return null;
    return { siteId, timestampSite, leadId };
  } catch {
    return null;
  }
}
