import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import VinylPlayer from '@/components/VinylPlayer';
import TrackInfo from '@/components/TrackInfo';
import AudioProgressBar from '@/components/AudioProgressBar';
import PlayerControls from '@/components/PlayerControls';
import Playlist from '@/components/Playlist';
import BottomNav from '@/components/BottomNav';
import CrewCarousel from '@/components/CrewCarousel';
import MiniPlayer from '@/components/MiniPlayer';
import RadioSection from '@/components/RadioSection';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useTracks } from '@/hooks/useTracks';
import { SLIPMAT_IMAGE } from '@/data/tracks';
import { useFavorites } from '@/hooks/useFavorites';
import { usePlayCounts } from '@/hooks/usePlayCounts';
import { useCrew } from '@/hooks/useCrew';
import { usePersistentBottomTab } from '@/hooks/usePersistentBottomTab';
import { useRadioStream } from "@/hooks/useRadioStream";
import { RADIO_STATIONS } from "@/data/radioStations";

const Index = () => {
  const { tracks, isLoading } = useTracks();
  const player = useAudioPlayer(tracks);
  const { favoritesSet, toggleFavorite } = useFavorites();
  const { activeTab, setActiveTab } = usePersistentBottomTab();
  const { playCounts, incrementPlayCount, playCountsHydrated } = usePlayCounts();
  const { crew, isLoading: isCrewLoading, error: crewError } = useCrew();
  const currentTrackForMini = player.currentTrack.id ? player.currentTrack : null;

  const lastIsPlayingRef = useRef(false);
  const lastTrackIndexRef = useRef(player.currentTrackIndex);
  /** Tracks for playlist: by play count (desc), then stable original order. Updates when counts load or change. */
  const playlistTracks = useMemo(() => {
    if (tracks.length === 0) return tracks;
    if (!playCountsHydrated) return tracks;

    return [...tracks].sort((a, b) => {
      const ac = playCounts[a.id] ?? 0;
      const bc = playCounts[b.id] ?? 0;
      if (bc !== ac) return bc - ac;
      return tracks.indexOf(a) - tracks.indexOf(b);
    });
  }, [tracks, playCounts, playCountsHydrated]);

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

  // --- Radio: глобальный стрим, который не умирает при переключении на Crew ---
  const [activeStationId, setActiveStationId] = useState(RADIO_STATIONS[0].id);
  const activeStation = useMemo(
    () => RADIO_STATIONS.find((s) => s.id === activeStationId) ?? RADIO_STATIONS[0],
    [activeStationId],
  );

  const {
    isPlaying: isRadioPlaying,
    nowPlaying: radioNowPlaying,
    toggle: toggleRadio,
    play: playRadio,
  } = useRadioStream(activeStation.streamUrl, activeStation.curtrackUrl);

  // Микс глушим только когда реально включили эфир, а не при простом переходе на вкладку Radio.
  useEffect(() => {
    if (isRadioPlaying) {
      player.pause();
    }
  }, [isRadioPlaying, player.pause]);

  /** Мини-плеер: микс на Crew; радио на Crew или Mixes, пока эфир играет. */
  const showMixMiniOnCrew = activeTab === "crew" && !!currentTrackForMini && !isRadioPlaying;
  const showRadioMini =
    isRadioPlaying && (activeTab === "crew" || activeTab === "mixes");

  const radioTrackForMini = useMemo(
    () => ({
      id: `radio-${activeStation.id}`,
      title: radioNowPlaying?.title || activeStation.name,
      artist: radioNowPlaying?.artist || activeStation.tagline,
      audioUrl: activeStation.streamUrl,
    }),
    [activeStation, radioNowPlaying],
  );

  const handleSelectTrack = (trackId: string) => {
    const idx = tracks.findIndex((t) => t.id === trackId);
    if (idx < 0) return;
    // Если в фоне играет радио, сначала его глушим, чтобы не было одновременного воспроизведения.
    if (isRadioPlaying) {
      toggleRadio();
    }
    player.selectTrack(idx);
  };

  const handleMixTogglePlay = useCallback(() => {
    if (isRadioPlaying) {
      toggleRadio();
      player.togglePlay();
    } else {
      player.togglePlay();
    }
  }, [isRadioPlaying, toggleRadio, player.togglePlay]);

  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col max-w-[420px] mx-auto overflow-hidden">
      {/* Header — env(safe-area-inset-top): вырез / Dynamic Island / статус-бар при viewport-fit=cover */}
      <header
        className="pb-1 text-center"
        style={{ paddingTop: "calc(1rem + env(safe-area-inset-top, 0px))" }}
      >
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
          <div className={showMixMiniOnCrew || showRadioMini ? "pt-3 md:pt-0 pb-[140px]" : "pt-3 md:pt-0 pb-[80px]"}>
            <CrewCarousel crew={crew} />
          </div>
        )
      ) : activeTab === "radio" ? (
        <RadioSection
          activeStationId={activeStationId}
          onChangeStation={setActiveStationId}
          isPlaying={isRadioPlaying}
          nowPlaying={radioNowPlaying}
          toggle={toggleRadio}
          play={playRadio}
        />
      ) : (
        <>
          {/* Main Player */}
          <div
            className="flex flex-1 flex-col overflow-hidden"
            style={{
              paddingBottom: showRadioMini
                ? "calc(140px + env(safe-area-inset-bottom, 0px))"
                : "calc(72px + env(safe-area-inset-bottom, 0px))",
            }}
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
                      onTogglePlay={handleMixTogglePlay}
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
                  tracks={playlistTracks}
                  currentTrackId={player.currentTrack.id}
                  favoritesSet={favoritesSet}
                  onToggleFavorite={toggleFavorite}
                  onSelectTrack={handleSelectTrack}
                />
              )}
            </div>
          </div>
        </>
      )}

      {showMixMiniOnCrew ? (
        <MiniPlayer
          currentTrack={currentTrackForMini}
          isPlaying={player.isPlaying}
          onPlayPause={player.togglePlay}
          onExpand={() => setActiveTab("mixes")}
        />
      ) : showRadioMini ? (
        <MiniPlayer
          currentTrack={radioTrackForMini}
          isPlaying={isRadioPlaying}
          onPlayPause={toggleRadio}
          onExpand={() => setActiveTab("radio")}
          artworkUrl={activeStation.logoUrl}
          artworkBackdrop={activeStation.logoBackdrop ?? "cover"}
        />
      ) : null}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
