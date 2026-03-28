import { useCallback, useEffect, useRef, useState } from "react";

export interface RadioNowPlaying {
  title: string;
  artist: string;
  artUrl: string | null;
}

interface MeuhCurtrackRow {
  titre?: string;
  artist?: string;
  imgSrc?: string;
  expire?: number;
}

/**
 * Single live stream + optional Radio Meuh–style curtrack.json polling.
 */
export function useRadioStream(streamUrl: string, curtrackUrl: string | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<RadioNowPlaying | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.volume = 1;
    audio.muted = false;
    audio.src = streamUrl;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [streamUrl]);

  useEffect(() => {
    if (!curtrackUrl) {
      setNowPlaying(null);
      return;
    }

    let cancelled = false;

    const fetchCurtrack = async () => {
      try {
        const res = await fetch(curtrackUrl);
        if (!res.ok) return;
        const data: unknown = await res.json();
        const row: MeuhCurtrackRow | undefined = Array.isArray(data) ? data[0] : undefined;
        if (cancelled || !row) return;
        setNowPlaying({
          title: row.titre ?? "",
          artist: row.artist ?? "",
          artUrl: row.imgSrc ?? null,
        });
      } catch {
        /* ignore */
      }
    };

    void fetchCurtrack();
    const intervalMs = 20_000;
    const id = window.setInterval(() => void fetchCurtrack(), intervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [curtrackUrl]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    void audio.play().catch(() => {});
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  }, []);

  return { isPlaying, nowPlaying, toggle, play, pause };
}
