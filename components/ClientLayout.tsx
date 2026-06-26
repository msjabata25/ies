'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import CursorHalo from './CursorHalo';
import Navbar from './Navbar';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }

    const lenis = new Lenis();

    lenis.scrollTo(0, { immediate: true });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <CursorHalo />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
