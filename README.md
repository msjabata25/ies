# IES JUST Student Chapter — Website

Website for the IEEE Industrial Electronics Society student chapter at Jordan University of Science and Technology.

Built with **React + Vite** (JavaScript), **Tailwind CSS v4**, **React Router**, and GSAP / Lenis / Motion / three.js for animation.

## Getting started

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run lint
```

## Project structure

```
index.html              page title, meta description, Google Fonts
public/                 static files served as-is (logo, favicon, 3D model, team photos)
src/
  main.jsx              entry point
  App.jsx               routes: /, /about, /events, /team
  index.css             Tailwind + global styles and theme colors/fonts
  pages/                one component per route
  components/
    Layout.jsx          navbar + footer + smooth scrolling around every page
    sections/           big page sections (Hero, Join, TeamCanvas, ...)
    ui/                 small reusable animated components
  data/
    events.js           event list — edit this to add/change events
    team.js             team members — edit this to update the team
  lib/utils.js          cn() helper for merging Tailwind classes
```

Imports can use `@/` as a shortcut for `src/` (e.g. `import { cn } from '@/lib/utils'`).

## Adding a page

1. Create `src/pages/MyPage.jsx`.
2. Add a route for it in `src/App.jsx`.
3. Add a link in `navLinks` in `src/components/Navbar.jsx` (and the footer if wanted).

Use `<Link to="/my-page">` from `react-router-dom` for internal links, not `<a href>`, so the page doesn't fully reload.

## Deploying

This is a single-page app: the server must send `index.html` for every path (so `/about` works on refresh). Most hosts need a one-line rewrite rule for that — add it when a host is chosen.
