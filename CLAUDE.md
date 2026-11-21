# IES JUST website

React 19 + Vite, plain JavaScript (no TypeScript), Tailwind CSS v4 via `@tailwindcss/vite`, React Router v7.
Ported from a Next.js App Router version in Oct 2026 — there is no server rendering, no `'use client'`, no `next/*` imports.

- Routes live in `src/App.jsx`; pages are lazy-loaded so three.js (Events page only) stays out of the main bundle.
- `src/components/Layout.jsx` owns Lenis smooth scroll (driven by the GSAP ticker) and scroll-to-top on route change.
- `@/` aliases `src/` (vite.config.js + jsconfig.json).
- Site content is in `src/data/` — keep the field shapes documented at the top of each file.
- Bilingual: English + casual Jordanian Arabic (not Fusha). UI strings live in `src/i18n/en.js` / `ar.js` (same keys) and are read with `useI18n().t(...)`; data items carry an optional `ar` object read with `pick(item, field)`. Arabic sets `<html dir="rtl">`, so use logical Tailwind classes (`ms-/ps-/start-/end-/text-start`) instead of left/right.
- `/apply` (membership form) submits through `src/lib/applications.js` to a Google Sheet via an Apps Script web app (contract documented at the top of that file). Set `VITE_APPLICATION_ENDPOINT` to the web app's /exec URL; without it, dev only logs submissions and production shows applications as closed.
- Colors: use the semantic tokens from `src/index.css` (`primary`, `accent`, `surface`, `card`, `panel`, `body`, `fg`, `muted`, `faint`, `line`, `ok`/`warn`/`idle`/`err`), never hard-coded hex. Light mode is `html.light-mode` (persisted in localStorage `ies-light`) and swaps the token values; `light:` is a variant for per-theme tweaks. Canvas/SVG/WebGL code reads colors via `useTheme()` / `tokenColor()` from `src/lib/theme.js`.
- Shared UI: `<Button>` (`src/components/ui/Button.jsx`) for calls to action, `.page-title` / `.section-title` for headings, `.pill` / `.pill-active` for filter chips.
- Event status is computed from `date`/`endDate` in `src/data/events.js`; don't hand-write it.
- Exact dependency versions match the live site on purpose (Tailwind 4.3.3 changed the default sans font stack); upgrade deliberately and check visuals.
- Verify with `npm run lint` and `npm run build` before committing.
