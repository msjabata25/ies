# IES JUST website

React 19 + Vite, plain JavaScript (no TypeScript), Tailwind CSS v4 via `@tailwindcss/vite`, React Router v7.
Ported from a Next.js App Router version in Oct 2026 — there is no server rendering, no `'use client'`, no `next/*` imports.

- Routes live in `src/App.jsx`; pages are lazy-loaded so three.js (About page only) stays out of the main bundle.
- `src/components/Layout.jsx` owns Lenis smooth scroll (driven by the GSAP ticker) and scroll-to-top on route change.
- `@/` aliases `src/` (vite.config.js + jsconfig.json).
- Site content is in `src/data/` — keep the field shapes documented at the top of each file.
- Exact dependency versions match the live site on purpose (Tailwind 4.3.3 changed the default sans font stack); upgrade deliberately and check visuals.
- Verify with `npm run lint` and `npm run build` before committing.
