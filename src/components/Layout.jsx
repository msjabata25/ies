import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import CursorHalo from './CursorHalo';
import EasterEggs from './EasterEggs';
import Navbar from './Navbar';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Layout() {
  const lenisRef = useRef(null);
  const { pathname } = useLocation();

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

  return (
    <>
      <CursorHalo />
      <EasterEggs lenisRef={lenisRef} />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
