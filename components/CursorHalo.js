'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CursorHalo() {
  const haloRef = useRef(null);
  const [hasMouse, setHasMouse] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    
    // Use requestAnimationFrame to avoid synchronous state setting in effect (Next.js linter complaint)
    requestAnimationFrame(() => {
      setHasMouse(mediaQuery.matches);
    });

    // Optional listener if device changes capabilities
    const handleMediaChange = (e) => setHasMouse(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (!hasMouse || !haloRef.current) return;

    const halo = haloRef.current;
    
    // Set initial position out of view or center, but smooth update handles it.
    // gsap.quickTo is optimized for mouse tracking without spamming react state
    const xTo = gsap.quickTo(halo, "x", { duration: 0.2, ease: "power3.out" });
    const yTo = gsap.quickTo(halo, "y", { duration: 0.2, ease: "power3.out" });

    // Ensure it appears immediately at mouse pos without sliding from origin if possible
    let initialized = false;

    const moveHalo = (e) => {
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
      className="pointer-events-none fixed top-0 left-0 w-10 h-10 rounded-full border border-[#F57C00] bg-[#F57C00]/10 shadow-[0_0_15px_rgba(245,124,0,0.5)] z-[9999] opacity-0"
      style={{ transform: 'translate(-50%, -50%)' }}
    />
  );
}
