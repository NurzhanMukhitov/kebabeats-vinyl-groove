import { useEffect, useState } from "react";
import { TRACKS_URL } from "@/data/tracks";
import type { Track } from "@/hooks/useAudioPlayer";

type TracksJson = {
  tracks: Array<{
    id: string;
    title: string;
    artist: string;
    audioUrl: string;
  }>;
};

export function useTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(TRACKS_URL, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Failed to fetch tracks.json (HTTP ${res.status})`);
        }

        const json = (await res.json()) as unknown;
        const parsed = json as TracksJson;
        const incoming = parsed?.tracks ?? [];

        const mapped: Track[] = incoming.map((t) => ({
          id: String(t.id),
          title: String(t.title ?? ""),
          artist: String(t.artist ?? ""),
          venue: "",
          date: "",
          duration: "",
          durationSeconds: 0,
          audioUrl: String(t.audioUrl ?? ""),
          coverUrl: "",
        }));

        setTracks(mapped);
      } catch (e) {
        // Fallback required by spec: empty array on fetch failure.
        setTracks([]);
        setError(e instanceof Error ? e.message : "Failed to load tracks");
      } finally {
        setIsLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, []);

  return { tracks, isLoading, error };
}

