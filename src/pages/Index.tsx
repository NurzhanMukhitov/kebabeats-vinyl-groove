import { useEffect, useRef, useState } from "react";
import VinylPlayer from '@/components/VinylPlayer';
import TrackInfo from '@/components/TrackInfo';
import AudioProgressBar from '@/components/AudioProgressBar';
import PlayerControls from '@/components/PlayerControls';
import Playlist from '@/components/Playlist';
import BottomNav, { type BottomTab } from '@/components/BottomNav';
import CrewCarousel from '@/components/CrewCarousel';
import MiniPlayer from '@/components/MiniPlayer';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useTracks } from '@/hooks/useTracks';
import { SLIPMAT_IMAGE } from '@/data/tracks';
import { useFavorites } from '@/hooks/useFavorites';
import { usePlayCounts } from '@/hooks/usePlayCounts';
import { useCrew } from '@/hooks/useCrew';

const Index = () => {
  const { tracks, isLoading } = useTracks();
  const player = useAudioPlayer(tracks);
  const { favoritesSet, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<BottomTab>("mixes");
  const { playCounts, incrementPlayCount } = usePlayCounts();
  const { crew, isLoading: isCrewLoading, error: crewError } = useCrew();
  const currentTrackForMini = player.currentTrack.id ? player.currentTrack : null;
  // MiniPlayer should stay visible even when paused (track selected + CREW tab).
  const showMiniPlayer = activeTab === "crew" && !!currentTrackForMini;

  const lastIsPlayingRef = useRef(false);
  const lastTrackIndexRef = useRef(player.currentTrackIndex);

  useEffect(() => {
    const trackId = player.currentTrack.id;
    if (!trackId) return;

    if (!player.isPlaying) {
      lastIsPlayingRef.current = false;
      lastTrackIndexRef.current = player.currentTrackIndex;
      return;
    }

    const shouldCount = !lastIsPlayingRef.current || player.currentTrackIndex !== lastTrackIndexRef.current;
    if (shouldCount) {
      incrementPlayCount(trackId);
    }

    lastIsPlayingRef.current = true;
    lastTrackIndexRef.current = player.currentTrackIndex;
  }, [player.currentTrack.id, player.currentTrackIndex, player.isPlaying, incrementPlayCount]);

  const handleSelectTrack = (trackId: string) => {
    const idx = tracks.findIndex((t) => t.id === trackId);
    if (idx >= 0) player.selectTrack(idx);
  };

  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col max-w-[420px] mx-auto overflow-hidden">
      {/* Header */}
      <header className="pt-4 pb-1 text-center">
        <p className="text-[11px] tracking-[0.2em] text-muted-foreground font-bold uppercase">
          Vinyl Lovers • Party Makers
        </p>
      </header>

      {activeTab === "crew" ? (
        isCrewLoading ? (
          <section className="flex-1 flex items-center justify-center px-6 pb-24">
            <p className="text-[12px] text-muted-foreground text-center">Loading crew...</p>
          </section>
        ) : crewError || crew.length === 0 ? (
          <section className="flex-1 flex items-center justify-center px-6 pb-24">
            <p className="text-[12px] text-muted-foreground text-center">Crew info coming soon</p>
          </section>
        ) : (
          <div className={showMiniPlayer ? "pt-3 md:pt-0 pb-[140px]" : "pt-3 md:pt-0 pb-[80px]"}>
            <CrewCarousel crew={crew} />
          </div>
        )
      ) : (
        <>
          {/* Main Player */}
          <div
            className="flex flex-1 flex-col overflow-hidden"
            style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom))" }}
          >
            <div className="flex-shrink-0">
              <main className="flex flex-col items-center justify-start">
                <VinylPlayer isPlaying={!isLoading && player.isPlaying} slipmatImage={SLIPMAT_IMAGE} />

                {isLoading ? (
                  <div className="text-center px-8 mb-2">
                    <p className="text-sm text-muted-foreground">Загрузка треков...</p>
                  </div>
                ) : tracks.length === 0 ? (
                  <div className="text-center px-8 mb-2">
                    <p className="text-sm text-muted-foreground">Треки недоступны</p>
                  </div>
                ) : (
                  <>
                    <TrackInfo track={player.currentTrack} />

                    <AudioProgressBar current={player.progress} total={player.duration} onSeek={player.seek} />

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
                  </>
                )}
              </main>
            </div>

            <div className="flex-1 overflow-hidden">
              {isLoading || tracks.length === 0 ? null : (
                <Playlist
                  tracks={tracks}
                  currentTrackId={player.currentTrack.id}
                  favoritesSet={favoritesSet}
                  onToggleFavorite={toggleFavorite}
                  onSelectTrack={handleSelectTrack}
                  playCounts={playCounts}
                />
              )}
            </div>
          </div>
        </>
      )}

      {showMiniPlayer ? (
        <MiniPlayer
          currentTrack={currentTrackForMini}
          isPlaying={player.isPlaying}
          onPlayPause={player.togglePlay}
          onExpand={() => setActiveTab("mixes")}
        />
      ) : null}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
