'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

export default function Hero() {
  const container = useRef();
  
  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Status sweep
    tl.to('.status-bar', { width: '100%', duration: 0.3, ease: 'power2.inOut' });
    
    // Show cursor early
    tl.to('.hero-cursor', { opacity: 1, duration: 0.1 }, 'letters');

    // Type out the title text
    tl.to('.hero-title', { text: "SYSTEM BOOT\nSEQUENCE", duration: 1.5, ease: 'none' }, 'letters');
    
    // Show terminal box
    tl.to('.hero-terminal', { opacity: 1, y: 0, duration: 0.4 }, 'letters+=1.6');

    // Logo entrance animation
    tl.to('.hero-logo', { opacity: 1, scale: 1, rotation: 360, duration: 0.8, ease: 'back.out(1.7, 0.3)' }, 'letters+=1.8');
    
    // Boot sequence text logging inside the terminal
    tl.to('.boot-line', { opacity: 1, stagger: 0.25, duration: 0.1 }, 'letters+=2.0');

    // Status strip & other items
    tl.to('.status-strip', { opacity: 1, duration: 0.3 }, 'letters+=3.0');
    
    // System coordinates pop in
    tl.to('.sys-coord', { opacity: 0.5, duration: 0.5 }, 'letters+=3.0');
  }, { scope: container });

  return (
    <section ref={container} className="relative min-h-[819px] flex flex-col justify-center mb-24 px-4 md:px-14 overflow-hidden">
      {/* Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay z-[5]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

      <div className="sys-coord absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 -translate-x-full md:translate-x-0 origin-left -rotate-90 text-[#1E88E5] font-mono text-[14px] leading-[160%] opacity-0 tracking-widest hidden lg:block">
        SYS.COORD: 32.5514° N, 35.8515° E
      </div>
      
      <div className="flex items-center w-full max-w-7xl mx-auto z-10">
        <div className="w-full z-10 text-left">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-4">
            <div className="hero-logo opacity-0 scale-50 w-24 h-24 md:w-32 md:h-32 flex-shrink-0 drop-shadow-[0_0_15px_rgba(245,124,0,0.5)]">
              {/* Note: Save the attached logo image as 'ies-logo.jpg' inside the 'public' folder! */}
              <img src="/ies-logo.jpg" alt="IES JUST Logo" className="w-full h-full object-contain mix-blend-screen" />
            </div>
            <h1 className="font-display text-[#F57C00] text-[5xl] md:text-[84px] leading-none tracking-widest whitespace-pre-wrap">
              <span className="hero-title"></span><span className="hero-cursor opacity-0 cursor-blink font-mono">_</span>
            </h1>
          </div>
          
          <div className="hero-terminal opacity-0 translate-y-4 font-mono text-[14px] leading-[160%] text-[#1E88E5] mb-8 space-y-2 max-w-2xl bg-[#0e0e0e] border border-[#1E88E5]/30 p-4 relative">
            <div className="absolute top-0 right-0 p-1 text-[10px] bg-[#1E88E5] text-[#0A0A0A]">LOG</div>
            <div className="flex flex-col gap-2">
              <p className="boot-line opacity-0">{`> INIT SYSTEM CORE...`}</p>
              <p className="boot-line opacity-0">{`> LOADING IES MODULES...`}</p>
              <p className="boot-line opacity-0">{`> ESTABLISHING CONNECTION...`}</p>
              <p className="boot-line opacity-0 text-[#F57C00]">{`> [OK] SYSTEM READY.`}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="status-strip opacity-0 absolute bottom-0 left-0 w-full border-t border-[#F57C00]/30 py-2 px-14 flex justify-between font-mono text-[14px] text-[#F57C00]/70">
        <span>STATUS: ONLINE</span>
        <span>NETWORK: ACTIVE</span>
      </div>
    </section>
  );
}
