# Daily Logger

A GitHub-style contribution heatmap for tracking daily task completions — mobile-first, offline-first, installable PWA.

## Features

- Yearly GitHub-style contribution calendar with configurable color intensity thresholds
- Task CRUD (title, description, priority, tags, notes, completion time)
- Statistics dashboard: streaks, completion rate, weekday/priority breakdown charts
- Search and filters (date range, tag, priority)
- Export to CSV, JSON, and PDF; JSON import/restore as local backup
- Light/dark/system theme, configurable color palette, Monday/Sunday week start
- Installable, offline-first (all data lives in IndexedDB — nothing leaves the device)

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Zustand, Dexie (IndexedDB), Framer Motion, Recharts, React Hook Form + Zod, vite-plugin-pwa.

## Getting started

```bash
npm install
npm run dev       # start dev server
npm run build     # type-check + production build
npm run preview   # serve the production build locally
```

In development, `window.__seedDemoData(days)` and `window.__clearAllTasks()` are available in the browser console for generating/clearing sample data.
