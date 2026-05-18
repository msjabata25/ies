'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import CursorHalo from './CursorHalo';

gsap.registerPlugin(ScrollTrigger);

export default function ClientLayout({ children }) {
  useEffect(() => {
    // Force scroll to top on refresh/mount
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }

    const lenis = new Lenis();
    
    // Ensure lenis starts at the top
    lenis.scrollTo(0, { immediate: true });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <>
      <CursorHalo />
      {children}
    </>
  );
}
