import type { Track } from '@/hooks/useAudioPlayer';

const TrackInfo = ({ track }: { track: Track }) => {
  return (
    <div className="text-center px-8 mb-8">
      <h1 className="text-xl font-bold tracking-tight mb-1">{track.title}</h1>
      <p className="text-primary text-sm font-medium mb-2">{track.artist}</p>
      <p className="text-muted-foreground text-[11px] flex items-center justify-center gap-1">
        <span className="opacity-70">📍</span> {track.venue}, {track.date}
      </p>
    </div>
  );
};

export default TrackInfo;
