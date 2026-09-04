// fetch that aborts after `timeoutMs` so a hung/slow backend can't leave the UI
// stuck forever (spinner that never resolves, "Loading services" that never
// loads). An abort rejects like any network error, so callers handle it in
// their normal catch and can show a message / retry.
export async function fetchWithTimeout(url, options, timeoutMs = 15000) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		return await fetch(url, { ...options, signal: controller.signal });
	} finally {
		clearTimeout(timer);
	}
}
