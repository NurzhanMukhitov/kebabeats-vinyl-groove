import { useState, useEffect, useRef, useCallback } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  venue: string;
  date: string;
  duration: string;
  durationSeconds: number;
  audioUrl: string;
  coverUrl: string;
}

export const useAudioPlayer = (tracks: Track[]) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shuffleEnabledRef = useRef(shuffleEnabled);
  const repeatEnabledRef = useRef(repeatEnabled);
  const currentTrackIndexRef = useRef(currentTrackIndex);

  useEffect(() => {
    shuffleEnabledRef.current = shuffleEnabled;
  }, [shuffleEnabled]);

  useEffect(() => {
    repeatEnabledRef.current = repeatEnabled;
  }, [repeatEnabled]);

  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  const currentTrack =
    tracks[currentTrackIndex] ?? {
      id: "",
      title: "",
      artist: "",
      venue: "",
      date: "",
      duration: "",
      durationSeconds: 0,
      audioUrl: "",
      coverUrl: "",
    };

  const nextTrack = useCallback(() => {
    if (tracks.length === 0) return;
    if (shuffleEnabled) {
      let next: number;
      do {
        next = Math.floor(Math.random() * tracks.length);
      } while (next === currentTrackIndexRef.current && tracks.length > 1);
      setCurrentTrackIndex(next);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
  }, [shuffleEnabled, tracks.length]);

  const prevTrack = useCallback(() => {
    if (tracks.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      return;
    }
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  useEffect(() => {
    if (tracks.length === 0 || !currentTrack.audioUrl) {
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.src = currentTrack.audioUrl;
    audio.load();

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || currentTrack.durationSeconds);
    const handleEnd = () => {
      if (repeatEnabledRef.current) {
        audio.currentTime = 0;
        audio.play();
      } else {
        if (tracks.length === 0) return;
        if (shuffleEnabledRef.current && tracks.length > 1) {
          let next: number;
          do {
            next = Math.floor(Math.random() * tracks.length);
          } while (next === currentTrackIndexRef.current);
          setCurrentTrackIndex(next);
        } else {
          setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
        }
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    setDuration(currentTrack.durationSeconds);
    setProgress(0);

    if (isPlaying) {
      audio.play().catch(() => {});
    }

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, tracks.length]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);

  const selectTrack = useCallback((index: number) => {
    if (tracks.length === 0) return;
    if (index < 0 || index >= tracks.length) return;
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  }, [tracks.length]);

  return {
    currentTrack,
    currentTrackIndex,
    isPlaying,
    progress,
    duration,
    shuffleEnabled,
    repeatEnabled,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    selectTrack,
    toggleShuffle: () => setShuffleEnabled((p) => !p),
    toggleRepeat: () => setRepeatEnabled((p) => !p),
  };
};
