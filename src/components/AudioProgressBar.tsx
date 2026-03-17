const formatTime = (s: number) => {
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface AudioProgressBarProps {
  current: number;
  total: number;
  onSeek: (val: number) => void;
}

const AudioProgressBar = ({ current, total, onSeek }: AudioProgressBarProps) => {
  const percent = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full px-6 space-y-2">
      <div className="relative h-1.5 w-full bg-secondary rounded-full overflow-hidden cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          onSeek(pct * total);
        }}
      >
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-[width] duration-200"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground tracking-widest tabular-nums">
        <span>{formatTime(current)}</span>
        <span>{formatTime(total)}</span>
      </div>
    </div>
  );
};

export default AudioProgressBar;
