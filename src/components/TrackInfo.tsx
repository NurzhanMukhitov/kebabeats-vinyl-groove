import type { Track } from '@/hooks/useAudioPlayer';

const TrackInfo = ({ track }: { track: Track }) => {
  return (
    <div className="text-center px-8 mb-8">
      <h1 className="text-xl font-bold tracking-tight mb-1">{track.title}</h1>
      <p className="text-primary text-sm font-medium">{track.artist}</p>
    </div>
  );
};

export default TrackInfo;
