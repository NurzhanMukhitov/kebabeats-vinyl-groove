import { useCallback, useEffect, useMemo, useState } from "react";

const FAVORITES_STORAGE_KEY = "kebabeats:favorites";

function safeParseFavorites(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((x) => String(x));
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds((prev) => {
      // Load once on mount; prev is only used to keep shape stable.
      const loaded = safeParseFavorites(localStorage.getItem(FAVORITES_STORAGE_KEY));
      return loaded;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const favoritesSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = useCallback((trackId: string) => favoritesSet.has(trackId), [favoritesSet]);

  const toggleFavorite = useCallback((trackId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return Array.from(next);
    });
  }, []);

  return { favoriteIds, favoritesSet, isFavorite, toggleFavorite };
}

