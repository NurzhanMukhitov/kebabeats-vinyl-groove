import type { Track } from '@/hooks/useAudioPlayer';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Kebar Non Stop',
    artist: 'Rekatam & Shimoon',
    venue: 'Kebar Non Stop',
    date: 'Sept 2021',
    duration: '58:42',
    durationSeconds: 3522,
    audioUrl: 'https://kebabeats.r2.dev/mixes/kebar-non-stop.mp3',
    coverUrl: 'https://kebabeats.r2.dev/covers/kebar.jpg',
  },
  {
    id: '2',
    title: 'Graylinebeats vol.1',
    artist: 'Rekatam',
    venue: 'Studio 144',
    date: '2020',
    duration: '1:02:15',
    durationSeconds: 3735,
    audioUrl: 'https://kebabeats.r2.dev/mixes/graylinebeats.mp3',
    coverUrl: 'https://kebabeats.r2.dev/covers/grayline.jpg',
  },
  {
    id: '3',
    title: 'Berlin Sur Market',
    artist: 'GoshaS',
    venue: 'Tsvetnoy',
    date: 'Feb 2022',
    duration: '55:30',
    durationSeconds: 3330,
    audioUrl: 'https://kebabeats.r2.dev/mixes/berlin-sur.mp3',
    coverUrl: 'https://kebabeats.r2.dev/covers/berlin.jpg',
  },
];

export const SLIPMAT_IMAGE = '/mascot.png';
