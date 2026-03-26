import type { Track } from '@/hooks/useAudioPlayer';
import { Heart } from 'lucide-react';

interface PlaylistProps {
  tracks: Track[];
  currentTrackId: string;
  favoritesSet: Set<string>;
  onToggleFavorite: (trackId: string) => void;
  onSelectTrack: (trackId: string) => void;
  playCounts: Record<string, number>;
}

const Playlist = ({ tracks, currentTrackId, favoritesSet, onToggleFavorite, onSelectTrack, playCounts }: PlaylistProps) => {
  return (
    <section className="px-6 pb-24">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-[12px] font-bold tracking-widest text-muted-foreground uppercase">Playlist</h2>
      </div>
      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
        {tracks.map((track) => {
          const isActive = currentTrackId === track.id;
          const isFavorite = favoritesSet.has(track.id);
          const plays = playCounts[track.id] ?? 0;
          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className={`flex items-center gap-3 p-2 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:bg-secondary'
              }`}
            >
              <img
                src={track.coverUrl}
                className="w-12 h-12 rounded-[10px] object-cover bg-secondary"
                alt={track.title}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{track.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
              </div>
              <button
                type="button"
                aria-label={isFavorite ? `Unfavorite ${track.title}` : `Favorite ${track.title}`}
                aria-pressed={isFavorite}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(track.id);
                }}
                className={`shrink-0 inline-flex items-center justify-center p-2 rounded-full border transition-colors ${
                  isFavorite
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground opacity-70 hover:opacity-100 hover:bg-secondary'
                }`}
              >
                <Heart
                  size={18}
                  strokeWidth={2}
                  fill={isFavorite ? 'hsl(var(--primary))' : 'transparent'}
                  className={isFavorite ? 'text-primary' : 'text-muted-foreground'}
                />
              </button>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] font-mono text-muted-foreground">{track.duration}</span>
                {plays > 0 ? (
                  <span className="text-[9px] font-bold text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full font-mono">
                    {plays}x
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Playlist;
