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
}

const MiniPlayer = ({ currentTrack, isPlaying, onPlayPause, onExpand, artworkUrl }: MiniPlayerProps) => {
  if (!currentTrack) return null;

  const art = artworkUrl ?? "/mascot.png";

  return (
    <div className="fixed bottom-[70px] left-0 right-0 z-40 px-4">
      <div
        className="mx-auto max-w-[420px] bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 px-4 py-3 flex items-center gap-3 cursor-pointer rounded-t-lg"
        onClick={onExpand}
      >
        <div className="w-11 h-11 rounded-md bg-zinc-800 flex-shrink-0 overflow-hidden">
          <img src={art} alt="" className="w-full h-full object-cover" />
        </div>

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

