import { useCallback, useEffect, useMemo, useState } from "react";

const PLAY_COUNTS_STORAGE_KEY = "kebabeats:playCounts";

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

  useEffect(() => {
    setPlayCounts(safeParsePlayCounts(localStorage.getItem(PLAY_COUNTS_STORAGE_KEY)));
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

