import { useSyncExternalStore } from 'react';

/* The theme lives on <html>: `light-mode` (toggled by Navbar) switches the colour tokens in index.css.
   CRT mode (`crt`) is dark-only and wins over light mode, so it reports 'dark'. */
const root = typeof document !== 'undefined' ? document.documentElement : null;

export function getTheme() {
  if (!root) return 'dark';
  return root.classList.contains('light-mode') && !root.classList.contains('crt') ? 'light' : 'dark';
}

function subscribe(onChange) {
  if (!root) return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(root, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

/** 'light' | 'dark'. Re-renders when <html>'s class changes. */
export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, () => 'dark');
}

/** Computed value of a colour token, e.g. tokenColor('primary') -> '#F57C00' (or a color-mix string if a token ever becomes one). */
export function tokenColor(name) {
  if (!root) return '';
  return getComputedStyle(root).getPropertyValue(`--color-${name}`).trim();
}

/** '#rrggbb' -> 'r,g,b' for building rgba() strings in canvas code. */
export function tokenRgb(name) {
  const hex = tokenColor(name).replace('#', '');
  if (hex.length !== 6) return '0,0,0';
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(',');
}
