import { getRedisClient } from "../_lib/redis.js";

const PLAY_COUNTS_KEY = "kebabeats:playCounts";

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

const parseTrackId = (body: unknown): string | null => {
  if (!body) return null;

  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body) as unknown;
      if (!parsed || typeof parsed !== "object") return null;
      const id = (parsed as { trackId?: unknown }).trackId;
      return typeof id === "string" && id.trim() ? id.trim() : null;
    } catch {
      return null;
    }
  }

  if (typeof body === "object") {
    const id = (body as { trackId?: unknown }).trackId;
    return typeof id === "string" && id.trim() ? id.trim() : null;
  }

  return null;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const trackId = parseTrackId(req.body);
  if (!trackId) {
    res.status(400).json({ error: "trackId is required" });
    return;
  }

  try {
    const redis = await getRedisClient();
    if (!redis) {
      res.status(503).json({ ok: false, error: "Play counter storage unavailable" });
      return;
    }

    const count = await redis.hIncrBy(PLAY_COUNTS_KEY, trackId, 1);
    res.status(200).json({ ok: true, trackId, count });
  } catch {
    res.status(503).json({ ok: false, error: "Play counter storage unavailable" });
  }
}

