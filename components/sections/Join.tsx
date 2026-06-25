'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

export default function Join() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 50%',
      }
    });

    tl.from('.join-title', { text: "X!&_S$#%@*", duration: 1, ease: 'none' });

    gsap.to('.ticker-content', {
      xPercent: -50,
      ease: 'none',
      duration: 15,
      repeat: -1
    });

    gsap.to('.join-btn', {
      boxShadow: '0 0 20px rgba(245,124,0,0.8), inset 0 0 10px rgba(245,124,0,0.5)',
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  }, { scope: container });

  const tickerText = "01001010 01000101 01010011 00100000 HEX:0x9A SYS.OP NULL // ";
  const fullTicker = Array(10).fill(tickerText).join("");

  return (
    <section ref={container} className="relative min-h-[80vh] flex flex-col justify-center items-center text-center overflow-hidden border-t-2 border-primary/30 mb-24 mt-24">

      <div className="absolute top-0 w-full overflow-hidden bg-accent/10 border-b border-accent/30 py-2 z-0">
        <div className="ticker-content whitespace-nowrap text-accent font-mono text-[12px] tracking-widest opacity-50 flex w-max">
          <span>{fullTicker}</span>
          <span>{fullTicker}</span>
        </div>
      </div>

      <div className="z-10 px-4 mt-8">
        <h2 className="text-[84px] md:text-[120px] text-primary tracking-[0.05em] font-display leading-none mb-6">
          <span className="join-title">WANT_TO_JOIN?</span><span className="cursor-blink font-mono">_</span>
        </h2>
        <p className="font-mono text-[16px] leading-[150%] text-body mb-12 max-w-2xl mx-auto">
          IES is currently recruiting new members. Don&apos;t miss the chance.
        </p>

        <button className="join-btn bg-card text-primary border-2 border-accent px-8 py-4 font-ui text-[16px] font-bold hover:bg-primary hover:text-surface hover:border-primary hover:shadow-[0_0_25px_rgba(245,124,0,0.7)] cursor-pointer transition-all duration-300">
          INITIALIZE_APPLICATION.EXE
        </button>

        <p className="font-mono text-[14px] text-accent mt-8 text-shadow-glitch">
          {`C:\\>CONNECT_ALLIANCE => @IES_JUST`}
        </p>
      </div>
    </section>
  );
}
