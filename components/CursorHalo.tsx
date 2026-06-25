'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CursorHalo() {
  const haloRef = useRef<HTMLDivElement>(null);
  const [hasMouse, setHasMouse] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');

    requestAnimationFrame(() => {
      setHasMouse(mediaQuery.matches);
    });

    const handleMediaChange = (e: MediaQueryListEvent) => setHasMouse(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (!hasMouse || !haloRef.current) return;

    const halo = haloRef.current;

    const xTo = gsap.quickTo(halo, "x", { duration: 0.2, ease: "power3.out" });
    const yTo = gsap.quickTo(halo, "y", { duration: 0.2, ease: "power3.out" });

    let initialized = false;

    const moveHalo = (e: MouseEvent) => {
      if (!initialized) {
        gsap.set(halo, { x: e.clientX, y: e.clientY, opacity: 1 });
        initialized = true;
      } else {
        xTo(e.clientX);
        yTo(e.clientY);
      }
    };

    window.addEventListener("mousemove", moveHalo);

    return () => window.removeEventListener("mousemove", moveHalo);
  }, [hasMouse]);

  if (!hasMouse) return null;

  return (
    <div
      ref={haloRef}
      className="pointer-events-none fixed top-0 left-0 w-10 h-10 rounded-full border border-primary bg-primary/10 shadow-[0_0_15px_rgba(245,124,0,0.5)] z-[9999] opacity-0"
      style={{ transform: 'translate(-50%, -50%)' }}
    />
  );
}
