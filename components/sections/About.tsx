'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

export default function About() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
      }
    });

    tl.to('.about-title-wrap', { y: 0, opacity: 1, duration: 0.5 });
    tl.from('.about-title', { text: "", duration: 1, ease: "none" });
    tl.to('.about-text', { x: 0, opacity: 1, duration: 0.6 }, '-=0.3');
    tl.to('.terminal-window', { x: 0, opacity: 1, duration: 0.6 }, '-=0.5');
    tl.to('.terminal-line', { opacity: 1, duration: 0.1, stagger: 0.15 });

  }, { scope: container });

  return (
    <section ref={container} className="min-h-[80vh] flex flex-col justify-center px-4 md:px-14 max-w-7xl mx-auto py-20 mb-24 overflow-hidden">
      <div className="flex items-center gap-4 mb-8 about-title-wrap opacity-0 translate-y-12">
        <span className="material-symbols-outlined text-primary text-3xl">folder_open</span>
        <h2 className="text-[48px] leading-[110%] tracking-[0.02em] text-primary font-display">
          <span className="about-title">ABOUT_IES.EXE</span><span className="cursor-blink font-mono">_</span>
        </h2>
        <div className="h-px bg-accent/30 flex-grow ml-4"></div>
      </div>

      <div className="grid md:grid-cols-12 gap-5 items-start w-full">
        <div className="md:col-span-6 space-y-6 about-text opacity-0 -translate-x-12 font-mono text-[16px] leading-[150%] text-body">
          <p>
            The Industrial Electronics Society (IES) Jordan University of Science and Technology (JUST) Student Chapter is dedicated to the advancement of theoretical and practical engineering knowledge.
          </p>
          <p>
            Focusing on automation, embedded systems, and industrial electronics, we empower students with hands-on experience and industry networking.
          </p>
        </div>

        <div className="md:col-span-6 terminal-window opacity-0 translate-x-12 border-2 border-accent bg-card shadow-[0_0_15px_rgba(245,124,0,0.2)]">
          <div className="bg-surface border-b-2 border-accent p-2 flex justify-between items-center text-accent font-mono text-[14px]">
            <span>C:\SYSTEM\IES_ABOUT</span>
            <div className="flex gap-2">
              <div className="w-3 h-3 border border-accent hover:bg-accent cursor-pointer"></div>
              <div className="w-3 h-3 border border-accent hover:bg-accent cursor-pointer"></div>
              <div className="w-3 h-3 bg-accent hover:bg-white cursor-pointer"></div>
            </div>
          </div>
          <div className="p-6 font-mono text-[14px] leading-relaxed text-body">
            <div className="terminal-line opacity-0"><span className="text-accent">{`C:\\>`}</span> RUN IES_ABOUT.EXE<br /><br /></div>
            <div className="terminal-line opacity-0"><span className="text-gray-500">Loading modules...</span></div>
            <div className="terminal-line opacity-0">[OK] Automation Core</div>
            <div className="terminal-line opacity-0">[OK] Embedded Systems</div>
            <div className="terminal-line opacity-0">[OK] Industrial Control<br /><br /></div>
            <div className="terminal-line opacity-0"><span className="text-primary">{`> `}</span> MISSION_STATEMENT:<br />
            We build the future of industry through student-led innovation.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
