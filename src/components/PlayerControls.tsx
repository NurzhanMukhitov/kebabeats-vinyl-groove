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

const PlayerControls = ({
  isPlaying, shuffleEnabled, repeatEnabled,
  onTogglePlay, onNext, onPrev, onToggleShuffle, onToggleRepeat,
}: PlayerControlsProps) => {
  return (
    <div className="flex items-center justify-between px-8 py-10">
      <button
        onClick={onToggleShuffle}
        className={`transition-colors ${shuffleEnabled ? 'text-primary' : 'text-muted-foreground opacity-60 hover:opacity-100'}`}
      >
        <Shuffle size={20} />
      </button>

      <div className="flex items-center gap-6">
        <button
          onClick={onPrev}
          className="w-[52px] h-[52px] rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-all"
        >
          <SkipBack size={20} fill="currentColor" />
        </button>

        <button
          onClick={onTogglePlay}
          className="w-[76px] h-[76px] rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.3)] active:scale-95 transition-transform"
          style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          {isPlaying ? (
            <Pause size={32} fill="hsl(var(--primary-foreground))" className="text-primary-foreground" />
          ) : (
            <Play size={32} fill="hsl(var(--primary-foreground))" className="ml-1 text-primary-foreground" />
          )}
        </button>

        <button
          onClick={onNext}
          className="w-[52px] h-[52px] rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-all"
        >
          <SkipForward size={20} fill="currentColor" />
        </button>
      </div>

      <button
        onClick={onToggleRepeat}
        className={`transition-colors ${repeatEnabled ? 'text-primary' : 'text-muted-foreground opacity-60 hover:opacity-100'}`}
      >
        <Repeat size={20} />
      </button>
    </div>
  );
};

export default PlayerControls;
