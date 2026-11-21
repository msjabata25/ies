import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import CursorHalo from './CursorHalo';
import EasterEggs from './EasterEggs';
import Navbar from './Navbar';
import Footer from './Footer';
import { titleFor, useI18n } from '@/i18n/context';

gsap.registerPlugin(ScrollTrigger);

export default function Layout() {
  const lenisRef = useRef(null);
  const { pathname } = useLocation();
  const { t, lang } = useI18n();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const lenis = new Lenis();
    lenisRef.current = lenis;

    lenis.scrollTo(0, { immediate: true });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Next.js scrolled to the top on every page change; React Router doesn't, so do it here
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  // Per-route <title>; LanguageProvider re-applies the same title on a language switch
  useEffect(() => {
    document.title = titleFor(lang, pathname);
  }, [pathname, lang]);

  return (
    <>
      {/* First focusable element: hidden until a keyboard user tabs to it */}
      <a
        href="#main-content"
        className="fixed top-2 start-2 z-[10000] -translate-y-[200%] focus:translate-y-0 bg-[#F57C00] text-[#0A0A0A] font-mono text-sm font-bold px-4 py-2"
      >
        {t('nav.skip')}
      </a>
      <CursorHalo />
      <EasterEggs lenisRef={lenisRef} />
      <Navbar />
      <div id="main-content" tabIndex={-1} className="outline-none">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
