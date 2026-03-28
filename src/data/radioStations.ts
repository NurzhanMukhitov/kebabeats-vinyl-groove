/** Curated live streams — add stations here. */
export interface RadioStation {
  id: string;
  name: string;
  /** Shown under the station name when idle */
  tagline: string;
  streamUrl: string;
  /** Optional JSON for “now playing” (Radio Meuh format) */
  curtrackUrl: string | null;
  /** Brand mark for vinyl + list row (public path) */
  logoUrl: string;
  /** Light: белая подложка под тёмный логотип. Dark: тёмная под светлый (например NTS). */
  logoBackdrop?: "light" | "dark";
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: "radiomeuh2",
    name: "Radio Meuh",
    tagline: "La Clusaz • funk, soul, hip-hop",
    /** Direct Icecast; www.radiomeuh.com/...mp3 отдаёт 404 для голого пути — только через их JS-плеер. */
    streamUrl: "https://radiomeuh2.ice.infomaniak.ch/radiomeuh2-128.mp3",
    curtrackUrl: "https://www.radiomeuh.com/storage/curtrack.json",
    logoUrl: "/icons/logoRadioMeuh-light.svg",
    logoBackdrop: "light",
  },
  {
    id: "nts1",
    name: "NTS Radio",
    tagline: "London • eclectic / Channel 1",
    /** Прямой MP3-реле (Icecast), без HLS в плеере. */
    streamUrl: "https://stream-relay-geo.ntslive.net/stream",
    curtrackUrl: null,
    logoUrl: "/icons/nts.png",
    logoBackdrop: "dark",
  },
];
