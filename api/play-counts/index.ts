import { getRedisClient } from "../_lib/redis.js";

const PLAY_COUNTS_KEY = "kebabeats:playCounts";

interface ApiRequest {
  method?: string;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

const normalizeCounts = (input: Record<string, unknown> | null | undefined) => {
  const output: Record<string, number> = {};
  if (!input) return output;

  for (const [trackId, value] of Object.entries(input)) {
    const n = typeof value === "number" ? value : Number(value);
    if (Number.isFinite(n) && n >= 0) output[trackId] = Math.floor(n);
  }

  return output;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const redis = await getRedisClient();
    if (!redis) {
      res.status(200).json({ playCounts: {} });
      return;
    }

    const raw = (await redis.hGetAll(PLAY_COUNTS_KEY)) as Record<string, unknown>;
    res.status(200).json({ playCounts: normalizeCounts(raw) });
  } catch {
    // Return empty payload to keep frontend usable when KV is not configured yet.
    res.status(200).json({ playCounts: {} });
  }
}

