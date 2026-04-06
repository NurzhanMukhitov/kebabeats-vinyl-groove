import somafmBeatBlender from "@/assets/radio/somafm-beat-blender.png";
import somafmDeepSpaceOne from "@/assets/radio/somafm-deep-space-one.gif";
import somafmFluid from "@/assets/radio/somafm-fluid.jpg";
import somafmGrooveSalad from "@/assets/radio/somafm-groove-salad.png";
import wefunkLogo from "@/assets/radio/wefunk-logo.png";
import fipLogo from "@/assets/radio/fip-seosquare.png";
import repeatHouseRadioLogo from "@/assets/radio/repeat-house-radio.png";

/** Curated live streams — add stations here. */
export interface RadioStation {
  id: string;
  name: string;
  /** Shown under the station name when idle */
  tagline: string;
  streamUrl: string;
  /** Optional JSON for “now playing” (Radio Meuh format) */
  curtrackUrl: string | null;
  /** Логотип: путь из `/public` или URL после import (Vite). */
  logoUrl: string;
  /** Light / dark: монохромные логотипы. Cover: цветная картинка на весь тайл (SomaFM и т.п.). */
  logoBackdrop?: "light" | "dark" | "cover";
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
  {
    id: "fip",
    name: "FIP",
    tagline: "Paris • éclectique / jazz, soul, world",
    /** Icecast MP3 (~128k); HLS: stream.radiofrance.fr/.../fip_hifi.m3u8 — для <audio> не нужен. */
    streamUrl: "https://icecast.radiofrance.fr/fip-midfi.mp3?id=radiofrance",
    curtrackUrl: null,
    logoUrl: fipLogo,
    logoBackdrop: "cover",
  },
  {
    id: "rhr707",
    name: "Repeat House Radio",
    tagline: "HR-707 • dance • 320 kbps",
    streamUrl: "https://listen5.myradio24.com/tknva",
    curtrackUrl: null,
    logoUrl: repeatHouseRadioLogo,
    logoBackdrop: "light",
  },
  {
    id: "ibiza-global-radio",
    name: "Ibiza Global Radio",
    tagline: "Electronic • Ibiza",
    /** CDN Icecast; control.streaming-pro.com/.../ibizaglobalradio.mp3 сейчас отдаёт 404. */
    streamUrl: "https://cdn-peer022.streaming-pro.com:8025/ibizaglobalradio.mp3",
    curtrackUrl: null,
    logoUrl: "/icons/logo-igr-black-new.svg",
    logoBackdrop: "light",
  },
  {
    id: "ibiza-global-classics",
    name: "Ibiza Global Classics",
    tagline: "Classics • Ibiza",
    streamUrl: "https://control.streaming-pro.com:8000/ibizaglobalclassics.mp3",
    curtrackUrl: null,
    logoUrl: "/icons/logo-igr-black-new.svg",
    logoBackdrop: "light",
  },
  {
    id: "somafm-beat-blender",
    name: "Beat Blender",
    tagline: "SomaFM • deep-house & downtempo",
    streamUrl: "https://ice3.somafm.com/beatblender-128-mp3",
    curtrackUrl: null,
    logoUrl: somafmBeatBlender,
    logoBackdrop: "cover",
  },
  {
    id: "somafm-fluid",
    name: "Fluid",
    tagline: "SomaFM • instrumental hiphop & future soul",
    streamUrl: "https://ice2.somafm.com/fluid-128-mp3",
    curtrackUrl: null,
    logoUrl: somafmFluid,
    logoBackdrop: "cover",
  },
  {
    id: "somafm-groove-salad",
    name: "Groove Salad",
    tagline: "SomaFM • ambient / downtempo",
    streamUrl: "https://ice3.somafm.com/groovesalad-128-mp3",
    curtrackUrl: null,
    logoUrl: somafmGrooveSalad,
    logoBackdrop: "cover",
  },
  {
    id: "somafm-deep-space-one",
    name: "Deep Space One",
    tagline: "SomaFM • ambient & space",
    streamUrl: "https://ice4.somafm.com/deepspaceone-128-mp3",
    curtrackUrl: null,
    logoUrl: somafmDeepSpaceOne,
    logoBackdrop: "cover",
  },
  {
    id: "wefunk",
    name: "WEFUNK Radio",
    tagline: "Funk • hip-hop • soul • underground classics",
    streamUrl: "https://s-09.wefunkradio.com:8443/wefunk64.mp3",
    curtrackUrl: null,
    logoUrl: wefunkLogo,
    logoBackdrop: "cover",
  },
];
