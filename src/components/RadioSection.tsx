import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import TrackInfo from "@/components/TrackInfo";
import VinylPlayer from "@/components/VinylPlayer";
import { SLIPMAT_IMAGE } from "@/data/tracks";
import { RADIO_STATIONS, type RadioStation } from "@/data/radioStations";
import type { Track } from "@/hooks/useAudioPlayer";
import { useRadioStream } from "@/hooks/useRadioStream";
import type { RadioNowPlaying } from "@/hooks/useRadioStream";

/** Станция: только брендовый логотип (без обложек из эфира). */
const RadioStationArt = ({
  logoUrl,
  logoBackdrop = "light",
}: {
  logoUrl: string;
  logoBackdrop?: "light" | "dark" | "cover";
}) => (
  <div className="w-11 h-11 md:w-12 md:h-12 rounded-[10px] bg-secondary border border-border flex items-center justify-center overflow-hidden shrink-0">
    {logoBackdrop === "cover" ? (
      <img src={logoUrl} alt="" className="w-full h-full object-cover" />
    ) : logoBackdrop === "dark" ? (
      <div className="w-[88%] h-[88%] rounded-lg bg-black flex items-center justify-center p-1.5 shadow-sm">
        <img src={logoUrl} alt="" className="max-w-full max-h-full object-contain" />
      </div>
    ) : (
      <div className="w-[88%] h-[88%] rounded-lg bg-white flex items-center justify-center p-1 shadow-sm">
        <img src={logoUrl} alt="" className="max-w-full max-h-full w-auto h-auto object-contain" />
      </div>
    )}
  </div>
);

const StationRow = ({
  station,
  isPlaying,
  nowPlaying,
  onPress,
}: {
  station: RadioStation;
  isPlaying: boolean;
  nowPlaying: RadioNowPlaying | null;
  onPress: () => void;
}) => {
  const subtitle =
    nowPlaying && (nowPlaying.title || nowPlaying.artist)
      ? [nowPlaying.title, nowPlaying.artist].filter(Boolean).join(" — ")
      : station.tagline;

  return (
    <button
      type="button"
      onClick={onPress}
      className={`w-full h-14 shrink-0 flex items-center gap-3 px-2 rounded-xl border transition-all text-left ${
        isPlaying
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:bg-secondary"
      }`}
    >
      <RadioStationArt logoUrl={station.logoUrl} logoBackdrop={station.logoBackdrop} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold truncate">{station.name}</p>
        <p className="text-[10px] text-muted-foreground truncate">{subtitle}</p>
      </div>
      <span
        className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground shrink-0 mr-1"
        aria-hidden
      >
        Live
      </span>
      <span
        className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full border border-border bg-card text-foreground"
        aria-hidden
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
      </span>
    </button>
  );
};

const RadioSection = () => {
  const [activeStationId, setActiveStationId] = useState(RADIO_STATIONS[0].id);
  const pendingAutoplay = useRef(false);

  const activeStation = useMemo(
    () => RADIO_STATIONS.find((s) => s.id === activeStationId) ?? RADIO_STATIONS[0],
    [activeStationId],
  );

  const { isPlaying, nowPlaying, toggle, play } = useRadioStream(
    activeStation.streamUrl,
    activeStation.curtrackUrl,
  );

  useEffect(() => {
    if (!pendingAutoplay.current) return;
    pendingAutoplay.current = false;
    const id = window.setTimeout(() => play(), 120);
    return () => window.clearTimeout(id);
  }, [activeStationId, activeStation.streamUrl, play]);

  const radioTrack: Track = useMemo(
    () => ({
      id: `radio-${activeStation.id}`,
      title: nowPlaying?.title || activeStation.name,
      artist: nowPlaying?.artist || activeStation.tagline,
      venue: "",
      date: "",
      duration: "Live",
      durationSeconds: 0,
      audioUrl: activeStation.streamUrl,
      coverUrl: activeStation.logoUrl,
    }),
    [nowPlaying, activeStation],
  );

  const handleStationPress = (station: RadioStation) => {
    if (station.id === activeStationId) {
      toggle();
    } else {
      pendingAutoplay.current = true;
      setActiveStationId(station.id);
    }
  };

  return (
    <div
      className="flex flex-1 flex-col overflow-hidden"
      style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom))" }}
    >
      <div className="flex-shrink-0">
        <main className="flex flex-col items-center justify-start">
          <VinylPlayer isPlaying={isPlaying} slipmatImage={SLIPMAT_IMAGE} />
          <TrackInfo track={radioTrack} />
        </main>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-2 min-h-0">
        {RADIO_STATIONS.map((station) => (
          <StationRow
            key={station.id}
            station={station}
            isPlaying={isPlaying && station.id === activeStationId}
            nowPlaying={station.id === activeStationId ? nowPlaying : null}
            onPress={() => handleStationPress(station)}
          />
        ))}
      </div>
    </div>
  );
};

export default RadioSection;
