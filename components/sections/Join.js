'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

export default function Join() {
  const container = useRef();
  
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 50%',
      }
    });

    tl.from('.join-title', { text: "X!&_S$#%@*", duration: 1, ease: 'none' });
    
    // Ticker animation
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
    <section ref={container} className="relative min-h-[80vh] flex flex-col justify-center items-center text-center overflow-hidden border-t-2 border-[#F57C00]/30 mb-24 mt-24">
      
      {/* Animated Ticker Divider */}
      <div className="absolute top-0 w-full overflow-hidden bg-[#1E88E5]/10 border-b border-[#1E88E5]/30 py-2 z-0">
        <div className="ticker-content whitespace-nowrap text-[#1E88E5] font-mono text-[12px] tracking-widest opacity-50 flex w-max">
          <span>{fullTicker}</span>
          <span>{fullTicker}</span>
        </div>
      </div>
      
      <div className="z-10 px-4 mt-8">
        <h2 className="text-[84px] md:text-[120px] text-[#F57C00] tracking-[0.05em] font-display leading-none mb-6">
          <span className="join-title">WANT_TO_JOIN?</span><span className="cursor-blink font-mono">_</span>
        </h2>
        <p className="font-mono text-[16px] leading-[150%] text-[#dec1af] mb-12 max-w-2xl mx-auto">
          IES is currently recruiting new members. Don&apos;t miss the chance.
        </p>
        
        <button className="join-btn bg-[#0e0e0e] text-[#F57C00] border-2 border-[#1E88E5] px-8 py-4 font-ui text-[16px] font-bold hover:bg-[#F57C00] hover:text-[#0A0A0A] hover:border-[#F57C00] hover:shadow-[0_0_25px_rgba(245,124,0,0.7)] cursor-pointer transition-all duration-300">
          INITIALIZE_APPLICATION.EXE
        </button>
        
        <p className="font-mono text-[14px] text-[#1E88E5] mt-8 text-shadow-glitch">
          {`C:\\>CONNECT_ALLIANCE => @IES_JUST`}
        </p>
      </div>
    </section>
  );
}
