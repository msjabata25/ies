'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Hero() {
  const container = useRef();
  
  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Status sweep
    tl.to('.status-bar', { width: '100%', duration: 0.3, ease: 'power2.inOut' });
    
    // Letters falling
    tl.to('.letter-i', { y: 0, opacity: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, 'letters');
    tl.to('.letter-e', { x: 0, opacity: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, 'letters+=0.1');
    tl.to('.letter-s', { x: 0, opacity: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, 'letters+=0.2');
    tl.to('.hero-rest', { opacity: 1, duration: 0.5 }, 'letters+=0.3');
    
    // E Glitch
    tl.to('.letter-e', { textShadow: '-2px 0 blue, 2px 0 orange', duration: 0.05, yoyo: true, repeat: 1 }, 'letters+=0.65');
    
    // Show terminal box
    tl.to('.hero-terminal', { opacity: 1, y: 0, duration: 0.4 }, 'letters+=1.0');
    
    // Boot sequence text logging inside the terminal
    tl.to('.boot-line', { opacity: 1, stagger: 0.25, duration: 0.1 }, 'letters+=1.4');

    // Status strip & other items
    tl.to('.status-strip', { opacity: 1, duration: 0.3 }, 'letters+=2.5');
  }, { scope: container });

  return (
    <section ref={container} className="relative min-h-[819px] flex flex-col justify-center mb-24 px-4 md:px-14 overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full md:translate-x-0 origin-left -rotate-90 text-[#1E88E5] font-mono text-[14px] leading-[160%] opacity-50 tracking-widest hidden lg:block">
        SYS.COORD: 32.5514° N, 35.8515° E
      </div>
      
      <div className="flex items-center w-full max-w-7xl mx-auto z-10">
        <div className="w-full z-10 text-left">
          <h1 className="font-display text-[#F57C00] text-[5xl] md:text-[84px] leading-none tracking-widest mb-4">
            <span className="letter-i inline-block relative opacity-0 -translate-y-[200px] -rotate-12">
              S
            </span>
            <span className="letter-e inline-block opacity-0 -translate-x-[200px] rotate-12">Y</span>
            <span className="letter-s inline-block opacity-0 translate-x-[200px] -rotate-12">S</span>
            <span className="hero-rest opacity-0">TEM BOOT <br/> SEQUENCE_</span>
          </h1>
          
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
