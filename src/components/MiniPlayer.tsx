import { Play, Pause } from "lucide-react";

interface TrackLike {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
}

interface MiniPlayerProps {
  currentTrack: TrackLike | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onExpand: () => void;
  /** Обложка (радио — логотип станции); по умолчанию маскот. */
  artworkUrl?: string;
  /** Как в RadioSection: light = тёмный логотип на белом фоне, иначе на тёмном мини-плеере «пропадает». */
  artworkBackdrop?: "light" | "dark" | "cover";
}

const MiniPlayer = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onExpand,
  artworkUrl,
  artworkBackdrop = "cover",
}: MiniPlayerProps) => {
  if (!currentTrack) return null;

  const art = artworkUrl ?? "/mascot.png";
  const isRadioArt = !!artworkUrl;

  const artworkSlot = (() => {
    if (!isRadioArt) {
      return (
        <div className="w-11 h-11 rounded-md bg-zinc-800 flex-shrink-0 overflow-hidden">
          <img src={art} alt="" className="w-full h-full object-cover" />
        </div>
      );
    }
    if (artworkBackdrop === "light") {
      return (
        <div className="w-11 h-11 rounded-md bg-white flex items-center justify-center p-1 shadow-sm flex-shrink-0 overflow-hidden border border-zinc-700">
          <img src={art} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      );
    }
    if (artworkBackdrop === "dark") {
      return (
        <div className="w-11 h-11 rounded-md bg-black flex items-center justify-center p-1.5 shadow-sm flex-shrink-0 overflow-hidden border border-zinc-700">
          <img src={art} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      );
    }
    return (
      <div className="w-11 h-11 rounded-md bg-zinc-800 flex-shrink-0 overflow-hidden">
        <img src={art} alt="" className="w-full h-full object-cover" />
      </div>
    );
  })();

  /** Над нижней навигацией: высота таб-бара + safe-area (как в BottomNav), иначе плеер заезжает под табы на iPhone. */
  return (
    <div
      className="fixed left-0 right-0 z-40 px-4"
      style={{
        bottom: "calc(3.875rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div
        className="mx-auto max-w-[420px] bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 px-4 py-3 flex items-center gap-3 cursor-pointer rounded-t-lg"
        onClick={onExpand}
      >
        {artworkSlot}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
          <p className="text-xs text-gray-400 truncate">{currentTrack.artist}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayPause();
          }}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white text-black"
        >
          {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;

