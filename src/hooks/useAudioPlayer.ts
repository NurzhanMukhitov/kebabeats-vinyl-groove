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

  const currentTrack = tracks[currentTrackIndex];

  const nextTrack = useCallback(() => {
    if (shuffleEnabled) {
      let next: number;
      do {
        next = Math.floor(Math.random() * tracks.length);
      } while (next === currentTrackIndex && tracks.length > 1);
      setCurrentTrackIndex(next);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
  }, [shuffleEnabled, currentTrackIndex, tracks.length]);

  const prevTrack = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      return;
    }
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.src = currentTrack.audioUrl;
    audio.load();

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || currentTrack.durationSeconds);
    const handleEnd = () => {
      if (repeatEnabled) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
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
  }, [currentTrackIndex]);

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
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  }, []);

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
