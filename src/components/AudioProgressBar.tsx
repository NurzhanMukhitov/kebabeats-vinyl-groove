import * as React from "react";

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
  const hitRef = React.useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const draggingRef = React.useRef(false);
  const [dragPercent, setDragPercent] = React.useState<number | null>(null);
  const effectivePercent = dragPercent ?? percent;

  const seekFromClientX = (clientX: number, setThumb = false) => {
    const el = hitRef.current;
    if (!el || total <= 0) return;
    const rect = el.getBoundingClientRect();
    const pct01 = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    if (setThumb) setDragPercent(pct01 * 100);
    onSeek(pct01 * total);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 1) return;
    draggingRef.current = true;
    setIsDragging(true);
    seekFromClientX(e.touches[0].clientX, true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    // Prevent page scroll while dragging the slider.
    e.preventDefault();
    if (e.touches.length < 1) return;
    seekFromClientX(e.touches[0].clientX, true);
  };

  const handleTouchEnd = () => {
    draggingRef.current = false;
    setIsDragging(false);
    setDragPercent(null);
  };

  return (
    <div className="w-full px-6 space-y-2">
      <div
        className="relative min-h-[44px] flex items-center touch-none group"
        style={{ touchAction: "none" }}
      >
        {/* Touch/click target (44px+ tall) */}
        <div
          ref={hitRef}
          className="w-full h-full cursor-pointer"
          onClick={(e) => seekFromClientX(e.clientX)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-[width] duration-200"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Thumb visual */}
        <div
          className="absolute top-1/2 pointer-events-none"
          style={{
            left: `${effectivePercent}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className={`h-[44px] w-[44px] rounded-full flex items-center justify-center transition-transform duration-200 ${
              isDragging
                ? "scale-100"
                : "group-hover:scale-[1.05]"
            }`}
          >
            <div
              className={`h-4 w-4 rounded-full bg-white shadow-[0_6px_18px_rgba(0,0,0,0.4)] transition-transform duration-200 ${
                isDragging
                  ? "scale-[1.4] shadow-[0_0_22px_rgba(255,255,255,0.45),0_8px_22px_rgba(0,0,0,0.45)]"
                  : "group-hover:scale-[1.2]"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground tracking-widest tabular-nums">
        <span>{formatTime(current)}</span>
        <span>{formatTime(total)}</span>
      </div>
    </div>
  );
};

export default AudioProgressBar;
