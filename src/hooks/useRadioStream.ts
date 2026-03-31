import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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

// Exponential backoff: 2s → 4s → 8s → 16s → 30s, then give up
const RETRY_DELAYS = [2_000, 4_000, 8_000, 16_000, 30_000];

/**
 * Single live stream + optional Radio Meuh–style curtrack.json polling.
 * Handles stream errors and stalls with exponential backoff retry + toast notifications.
 */
export function useRadioStream(streamUrl: string, curtrackUrl: string | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isError, setIsError] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<RadioNowPlaying | null>(null);

  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userPausedRef = useRef(true);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.volume = 1;
    audio.muted = false;
    audio.src = streamUrl;
    audioRef.current = audio;
    retryCountRef.current = 0;

    const clearRetryTimer = () => {
      if (retryTimerRef.current !== null) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };

    const scheduleRetry = () => {
      if (userPausedRef.current) return;
      if (retryTimerRef.current !== null) return; // already pending

      const attempt = retryCountRef.current;
      if (attempt >= RETRY_DELAYS.length) return; // gave up already

      const delay = RETRY_DELAYS[attempt];
      retryCountRef.current += 1;

      retryTimerRef.current = setTimeout(() => {
        retryTimerRef.current = null;
        if (userPausedRef.current) return;
        audio.load();
        void audio.play().catch(() => {});
      }, delay);
    };

    const onPlay = () => {
      setIsPlaying(true);
      setIsError(false);
      retryCountRef.current = 0;
      clearRetryTimer();
      toast.dismiss("radio-error");
      toast.dismiss("radio-stalled");
    };

    const onPause = () => setIsPlaying(false);

    const onError = () => {
      if (userPausedRef.current) return;
      setIsError(true);

      if (retryCountRef.current < RETRY_DELAYS.length) {
        toast.error("Ошибка соединения с радиостанцией", {
          id: "radio-error",
          description: "Переподключаемся...",
        });
        scheduleRetry();
      } else {
        toast.error("Радиостанция недоступна", {
          id: "radio-error",
          description: "Проверьте соединение и попробуйте позже",
        });
      }
    };

    const onStalled = () => {
      if (userPausedRef.current) return;
      toast.loading("Буферизация радиопотока...", {
        id: "radio-stalled",
        duration: 5_000,
      });
      scheduleRetry();
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    audio.addEventListener("stalled", onStalled);

    return () => {
      clearRetryTimer();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("stalled", onStalled);
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
      userPausedRef.current = false;
      retryCountRef.current = 0;
      void audio.play().catch(() => {});
    } else {
      userPausedRef.current = true;
      if (retryTimerRef.current !== null) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      audio.pause();
    }
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    userPausedRef.current = false;
    retryCountRef.current = 0;
    void audio.play().catch(() => {});
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    userPausedRef.current = true;
    if (retryTimerRef.current !== null) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    audio.pause();
  }, []);

  return { isPlaying, isError, nowPlaying, toggle, play, pause };
}
