import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  shuffleEnabled: boolean;
  repeatEnabled: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const PlayerControls = ({
  isPlaying, shuffleEnabled, repeatEnabled,
  onTogglePlay, onNext, onPrev, onToggleShuffle, onToggleRepeat,
}: PlayerControlsProps) => {
  return (
    <div className="flex items-center justify-center px-6 py-2">
      <button
        type="button"
        onClick={onToggleShuffle}
        aria-label="Toggle shuffle"
        aria-pressed={shuffleEnabled}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${focusRing} ${
          shuffleEnabled ? 'text-primary' : 'text-muted-foreground opacity-60 hover:opacity-100'
        }`}
      >
        <Shuffle size={20} />
      </button>

      <div className="w-4" />
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous track"
        className={`w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-all ${focusRing}`}
      >
        <SkipBack size={20} fill="currentColor" />
      </button>
      <div className="w-2" />
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        aria-pressed={isPlaying}
        className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.15)] active:scale-95 transition-transform ${focusRing}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {isPlaying ? (
          <Pause size={28} fill="hsl(var(--primary-foreground))" className="text-primary-foreground" />
        ) : (
          <Play size={28} fill="hsl(var(--primary-foreground))" className="ml-1 text-primary-foreground" />
        )}
      </button>
      <div className="w-2" />
      <button
        type="button"
        onClick={onNext}
        aria-label="Next track"
        className={`w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-all ${focusRing}`}
      >
        <SkipForward size={20} fill="currentColor" />
      </button>
      <div className="w-4" />

      <button
        type="button"
        onClick={onToggleRepeat}
        aria-label="Toggle repeat"
        aria-pressed={repeatEnabled}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${focusRing} ${
          repeatEnabled ? 'text-primary' : 'text-muted-foreground opacity-60 hover:opacity-100'
        }`}
      >
        <Repeat size={20} />
      </button>
    </div>
  );
};

export default PlayerControls;
