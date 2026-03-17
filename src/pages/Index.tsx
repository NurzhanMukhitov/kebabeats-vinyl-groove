import VinylPlayer from '@/components/VinylPlayer';
import TrackInfo from '@/components/TrackInfo';
import AudioProgressBar from '@/components/AudioProgressBar';
import PlayerControls from '@/components/PlayerControls';
import Playlist from '@/components/Playlist';
import BottomNav from '@/components/BottomNav';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { TRACKS, SLIPMAT_IMAGE } from '@/data/tracks';

const Index = () => {
  const player = useAudioPlayer(TRACKS);

  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col max-w-[420px] mx-auto overflow-hidden">
      {/* Header */}
      <header className="pt-6 pb-2 text-center">
        <p className="text-[11px] tracking-[0.2em] text-muted-foreground font-bold uppercase">
          Vinyl Lovers • Party Makers
        </p>
      </header>

      {/* Main Player */}
      <main className="flex-1 flex flex-col justify-center">
        <VinylPlayer isPlaying={player.isPlaying} slipmatImage={SLIPMAT_IMAGE} />

        <TrackInfo track={player.currentTrack} />

        <AudioProgressBar
          current={player.progress}
          total={player.duration}
          onSeek={player.seek}
        />

        <PlayerControls
          isPlaying={player.isPlaying}
          shuffleEnabled={player.shuffleEnabled}
          repeatEnabled={player.repeatEnabled}
          onTogglePlay={player.togglePlay}
          onNext={player.nextTrack}
          onPrev={player.prevTrack}
          onToggleShuffle={player.toggleShuffle}
          onToggleRepeat={player.toggleRepeat}
        />
      </main>

      <Playlist
        tracks={TRACKS}
        currentTrackId={player.currentTrack.id}
        onSelectTrack={player.selectTrack}
      />

      <BottomNav />
    </div>
  );
};

export default Index;
