# Kebabeats Vinyl Groove

Веб-плеер в стиле винилового приложения: миксы Kebabeats, статистика прослушиваний, команда (Crew) и интернет-радио (Radio).

**Подробное описание проекта, стека, архитектуры и точек входа для разработки — в [PROJECT.md](./PROJECT.md).**  
**План развития и приоритеты — в [ROADMAP.md](./ROADMAP.md).**

## Быстрый старт

```bash
npm install
npm run dev
```

## Скрипты

| Команда | Назначение |
|---------|------------|
| `npm run dev` | Режим разработки (Vite) |
| `npm run build` | Сборка для production |
| `npm run lint` | ESLint |
| `npm test` | Vitest |

## Стек

React (TypeScript), Vite, Tailwind, shadcn/ui, React Router, TanStack Query. Serverless API в `api/` (Vercel) для счётчиков прослушиваний (Redis).
