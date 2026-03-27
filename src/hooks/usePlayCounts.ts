import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PLAY_COUNTS_STORAGE_KEY = "kebabeats:playCounts";
const PLAY_COUNTS_API_URL = "/api/play-counts";

type PlayCounts = Record<string, number>;

function safeParsePlayCounts(raw: string | null): PlayCounts {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const obj = parsed as Record<string, unknown>;
    const out: PlayCounts = {};
    for (const [k, v] of Object.entries(obj)) {
      const n = typeof v === "number" ? v : Number(v);
      if (Number.isFinite(n) && n >= 0) out[k] = Math.floor(n);
    }
    return out;
  } catch {
    return {};
  }
}

export function usePlayCounts() {
  const [playCounts, setPlayCounts] = useState<PlayCounts>({});
  const apiAvailableRef = useRef<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCounts = async () => {
      try {
        const response = await fetch(PLAY_COUNTS_API_URL, { cache: "no-store" });
        if (!response.ok) throw new Error(`GET ${PLAY_COUNTS_API_URL} failed`);

        const payload = (await response.json()) as { playCounts?: unknown };
        const normalized = safeParsePlayCounts(
          payload && typeof payload === "object" ? JSON.stringify(payload.playCounts ?? {}) : null
        );

        if (!cancelled) {
          setPlayCounts(normalized);
          apiAvailableRef.current = true;
        }
        return;
      } catch {
        // Local dev and unavailable API should still work using local fallback.
        apiAvailableRef.current = false;
      }

      if (!cancelled) {
        setPlayCounts(safeParsePlayCounts(localStorage.getItem(PLAY_COUNTS_STORAGE_KEY)));
      }
    };

    void loadCounts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(PLAY_COUNTS_STORAGE_KEY, JSON.stringify(playCounts));
  }, [playCounts]);

  const getPlayCount = useCallback((trackId: string) => playCounts[trackId] ?? 0, [playCounts]);

  const incrementPlayCount = useCallback((trackId: string) => {
    if (!trackId) return;

    setPlayCounts((prev) => {
      const next = { ...prev };
      next[trackId] = (next[trackId] ?? 0) + 1;
      return next;
    });

    const syncIncrement = async () => {
      // If the API was already detected as unavailable, avoid retrying every play.
      if (apiAvailableRef.current === false) return;

      try {
        const response = await fetch(`${PLAY_COUNTS_API_URL}/increment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trackId }),
          keepalive: true,
        });
        if (!response.ok) throw new Error(`POST ${PLAY_COUNTS_API_URL}/increment failed`);
        apiAvailableRef.current = true;
      } catch {
        apiAvailableRef.current = false;
      }
    };

    void syncIncrement();
  }, []);

  const mostPlayed = useMemo(() => {
    let bestId: string | null = null;
    let bestCount = -1;
    for (const [id, c] of Object.entries(playCounts)) {
      if (c > bestCount) {
        bestCount = c;
        bestId = id;
      }
    }
    return bestId ? { trackId: bestId, count: bestCount } : null;
  }, [playCounts]);

  return { playCounts, getPlayCount, incrementPlayCount, mostPlayed };
}

