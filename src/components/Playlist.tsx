import type { Track } from '@/hooks/useAudioPlayer';

interface PlaylistProps {
  tracks: Track[];
  currentTrackId: string;
  onSelectTrack: (index: number) => void;
}

const Playlist = ({ tracks, currentTrackId, onSelectTrack }: PlaylistProps) => {
  return (
    <section className="px-6 pb-24">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-[12px] font-bold tracking-widest text-muted-foreground uppercase">Playlist</h2>
        <span className="text-[10px] text-primary font-mono">{tracks.length} TRACKS</span>
      </div>
      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
        {tracks.map((track, idx) => {
          const isActive = currentTrackId === track.id;
          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(idx)}
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
              {isActive ? (
                <span className="text-[9px] font-bold text-primary bg-primary/20 px-2 py-1 rounded shrink-0">NOW</span>
              ) : (
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">{track.duration}</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Playlist;
