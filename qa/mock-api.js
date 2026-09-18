// Mock of the self-checkin API for LOCAL widget testing (no credentials, no
// external calls). Serves just enough for the 3-step booking flow so the
// iframe-height bug can be reproduced offline on port 3006.
const http = require("http");

const json = (res, code, obj) =>
  res
    .writeHead(code, {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "*",
    })
    .end(JSON.stringify(obj));

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    const p = url.pathname;
    if (req.method === "OPTIONS") return json(res, 204, {});

    if (p.startsWith("/api/userToken")) return json(res, 200, { accesssToken: "mock-token" });

    if (p === "/api/config/sites")
      return json(res, 200, {
        sites: [
          { site: "490100-1", timeZone: "America/New_York" },
          { site: "490100-2", timeZone: "America/New_York" },
        ],
      });

    if (p === "/api/sessionTypes/2")
      return json(res, 200, {
        services: [
          { sessionTypeId: 101, name: "Early Pregnancy - $79", seeOnLine: true, start_week: 5, end_week: 15 },
          { sessionTypeId: 102, name: "Gender Determination - $99", seeOnLine: true, start_week: 14, end_week: 22 },
          { sessionTypeId: 103, name: "Meet Your Baby - 25 Min 5D/HD $149", seeOnLine: true, start_week: 20, end_week: 36 },
        ],
      });
    if (p === "/api/sessionTypes/3") return json(res, 200, { services: [] });

    if (/^\/api\/sites\/\d+\/locations\/\d+\/bookeableSchedule/.test(p)) {
      const day = url.searchParams.get("startDate") || "09/19/2026";
      const [m, d, y] = day.split("/");
      const iso = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      const times = ["10:00", "10:30", "11:00", "14:00", "16:15", "16:45"];
      return json(res, 200, {
        bookeableSchedule: times.map((t, i) => ({ staffId: 90 + i, startTime: `${iso}T${t}:00` })),
      });
    }

    // Lead tracking (DynamoDB in real life) — accept and echo mock keys.
    if (p === "/api/book/clients") {
      if (req.method === "POST") return json(res, 200, { partititonKey: "mock-part", orderKey: "mock-order" });
      return json(res, 200, {});
    }

    // Client search: not found -> widget takes the CLIENT-NOT-FOUND path.
    if (p.startsWith("/api/clients")) return json(res, 404, { clients: [] });

    return json(res, 404, { mock: "no route", path: p });
  })
  .listen(3006, () => console.log("mock API on :3006"));
