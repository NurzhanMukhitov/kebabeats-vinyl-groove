# Kebabeats Vinyl Groove — описание проекта

Документ для разработчиков и ассистентов: **о чём продукт**, **зачем он**, **как устроен код**. Обновляйте при существенных изменениях архитектуры или фич.

---

## 1. О чём проект

**Kebabeats Vinyl Groove** — веб-приложение в стиле мобильного плеера: тёмная тема, винил-эстетика, слоган в шапке *«Vinyl Lovers • Party Makers»*. Это витрина миксов/сетов **Kebabeats** с плейлистом, интеграцией **статистики прослушиваний** и разделами **команда (Crew)** и **интернет-радио (Radio)**.

Цель — дать слушателям удобный просмотр треков, воспроизведение с обложкой (слипмат), избранное, популярность по счётчикам и дополнительный контент (crew + радиостанции).

---

## 2. Зачем и для кого

- **Для слушателей:** один экран с плеером, плейлистом, навигацией в три вкладки (Mixes / Crew / Radio).
- **Для продукта:** отображать актуальный каталог миксов с CDN, учитывать прослушивания (Redis на Vercel), показывать команду и живые радиопотоки без отдельного нативного приложения.

---

## 3. Технологический стек

| Слой | Технология |
|------|------------|
| UI | React 18, TypeScript |
| Сборка | Vite 8 |
| Стили | Tailwind CSS, shadcn/ui (Radix), `tailwindcss-animate` |
| Маршрутизация | `react-router-dom` (главная `/`, остальное — 404) |
| Данные (клиент) | `@tanstack/react-query` (обёртка в `App`), локальные хуки |
| Тесты | Vitest + Testing Library |
| E2E (есть конфиг) | Playwright |

Серверные функции — в каталоге **`api/`** в формате **Vercel Serverless** (handler `req`/`res`).

---

## 4. Структура репозитория (важное)

```
src/
  pages/Index.tsx          # Главный экран: вкладки, плеер миксов, crew, radio
  components/              # VinylPlayer, Playlist, PlayerControls, RadioSection, CrewCarousel, BottomNav, MiniPlayer …
  hooks/
    useAudioPlayer.ts      # HTMLAudioElement + миксы (shuffle, repeat, seek)
    useTracks.ts           # Загрузка tracks.json с R2
    usePlayCounts.ts       # GET /api/play-counts + increment, localStorage fallback
    useFavorites.ts        # Избранное (локально)
    useCrew.ts             # Данные crew (источник — см. хук)
    useRadioStream.ts      # Один поток радио + опциональный curtrack JSON
    usePersistentBottomTab.ts # sessionStorage: активная вкладка после F5
  data/
    tracks.ts              # TRACKS_URL (R2), SLIPMAT_IMAGE (/mascot.png)
    radioStations.ts       # Курируемые станции: URL потока, logo, curtrack
api/
  play-counts/index.ts     # GET — счётчики из Redis
  play-counts/increment.ts # POST — инкремент по trackId
  _lib/redis.ts            # Клиент Redis (Vercel KV / Upstash-совместимый)
public/
  icons/                   # Логотипы радио (Meuh SVG, NTS PNG и т.д.)
```

---

## 5. Разделы приложения

### 5.1 Mixes (вкладка по умолчанию)

- Треки подгружаются из **`TRACKS_URL`** (`src/data/tracks.ts`) — JSON на **Cloudflare R2** (`tracks.json`).
- Плеер: **`useAudioPlayer`**, визуал — **`VinylPlayer`** (крутящийся «винил» с картинкой слипмата `SLIPMAT_IMAGE`), **`TrackInfo`**, **`AudioProgressBar`**, **`PlayerControls`**, **`Playlist`**.
- Плейлист сортируется по **убыванию счётчиков прослушиваний** после гидрации API (`playCountsHydrated` в `usePlayCounts`), при равенстве — стабильный порядок как в исходном `tracks`.
- При старте воспроизведения трека вызывается **`incrementPlayCount(trackId)`** (через API или fallback).

### 5.2 Crew

- Карусель/контент команды (`CrewCarousel`, данные через **`useCrew`**).
- При активном треке и вкладке Crew показывается **`MiniPlayer`**; разворачивает обратно на Mixes.

### 5.3 Radio

- Список станций из **`src/data/radioStations.ts`**.
- Один «активный» поток на момент времени: **`activeStationId`** + один экземпляр **`useRadioStream`** (переключение станции перезагружает URL, автозапуск при смене строки).
- **Radio Meuh:** прямой Icecast MP3 (Infomaniak), метаданные — `curtrack.json` на сайте станции.
- **NTS:** MP3-реле `stream-relay-geo.ntslive.net` (без HLS в браузере).
- **Ibiza Global Radio / Classics:** Icecast MP3 (`cdn-peer022…` для основного канала, `control.streaming-pro.com` для Classics); логотип `logo-igr-black-new.svg`, без отдельного now-playing API в приложении.
- **SomaFM** (Beat Blender, Fluid, Groove Salad, Deep Space One): разные хосты `ice*.somafm.com`, суффикс потока `-128-mp3`; иконки в `public/icons/somafm-*`, режим отображения `logoBackdrop: cover`.
- Винил на Radio использует **тот же слипмат**, что и Mixes (`SLIPMAT_IMAGE`).
- Обложки треков из эфира в списке **не показываются** — только брендовые логотипы с подложкой (`logoBackdrop`: светлая для тёмного логотипа, тёмная для светлого на чёрном, напр. NTS).
- Вкладка **Radio** ставит миксы на паузу через **`pause()`** из `useAudioPlayer`.

---

## 6. Данные и API

| Что | Где |
|-----|-----|
| Каталог миксов | `tracks.json` по `TRACKS_URL` (поля: id, title, artist, audioUrl + доп. поля в маппинге) |
| Счётчики прослушиваний | `GET /api/play-counts` → `{ playCounts: { [trackId]: number } }`; Redis hash `kebabeats:playCounts` |
| Инкремент | `POST` (см. `api/play-counts/increment.ts`) |
| Нет Redis | API отдаёт пустые счётчики; фронт может кэшировать в **localStorage** (см. `usePlayCounts`) |

---

## 7. Аудио: важные детали

- Миксы: один **`HTMLAudioElement`** в `useAudioPlayer`, смена трека — смена `src`.
- Радио: отдельный **`Audio`** в `useRadioStream`; не смешивать с миксами — при входе на Radio миксы на паузе.
- Потоки должны быть **доступны с HTTPS** и по возможности с **CORS**, если когда-либо понадобится разбор потока в JS (для обычного `<audio>` часто достаточно прямого URL).

---

## 8. Состояние и UX

- **Активная вкладка** (Mixes / Crew / Radio): **`sessionStorage`**, ключ в хуке `usePersistentBottomTab` — после обновления страницы вкладка сохраняется.
- **Избранное:** локально (хук `useFavorites`).
- **Плейлист по популярности:** пересчёт при обновлении `playCounts` (не зафиксированный «снимок» до загрузки API).

---

## 9. Деплой

- Типичный сценарий: **Vercel** (корень проекта, `api/` как serverless).
- Переменные для Redis/KV — по документации провайдера (см. `api/_lib/redis.ts`).

---

## 10. Команды разработки

```bash
npm run dev      # Vite dev server
npm run build    # Production build
npm run lint
npm test         # Vitest
```

---

## 11. Быстрый вход для правок

| Задача | Файлы |
|--------|--------|
| Новый микс / смена CDN | `src/data/tracks.ts`, JSON на R2 |
| Сортировка / счётчики | `usePlayCounts.ts`, `Index.tsx` (`playlistTracks`) |
| Плеер миксов | `useAudioPlayer.ts`, `Index.tsx` |
| Новая радиостанция | `src/data/radioStations.ts`, при необходимости `useRadioStream.ts`, `RadioSection.tsx` |
| Вкладки / навигация | `BottomNav.tsx`, `Index.tsx`, `usePersistentBottomTab.ts` |
| Винил | `VinylPlayer.tsx` |
| API счётчиков | `api/play-counts/*`, `api/_lib/redis.ts` |

---

## 12. История решений (кратко)

- Счётчики раньше «залипали» из-за снимка плейлиста до загрузки `playCounts` — исправлено через `playCountsHydrated` и `useMemo` по счётчикам.
- Радио с двумя независимыми `Audio` давало рассинхрон с винилом — введён один активный `activeStationId` и один `useRadioStream`.

---

*Последнее обновление документа: Radio (+ SomaFM), persistent tab, Redis play-counts.*
