'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import TransistorCanvas from '@/components/TransistorScene';

gsap.registerPlugin(ScrollTrigger);

const quadrants = [
  {
    id: 'q1',
    title: 'CORE_IDENTITY_',
    lines: [
      '> who we are',
      'official IEEE IES student chapter at JUST',
      'advancing industrial electronics since 2023',
      '60+ active members across 4 committees',
    ],
    position: 'top-[14%] left-[6%] md:left-[10%] max-w-[44vw] md:max-w-[32%]',
    enterDir: { y: -24 },
  },
  {
    id: 'q3',
    title: 'DOMAIN_EXPERTISE_',
    lines: [
      '> our stack',
      'PLC / SCADA / embedded firmware',
      'pcb design / industrial iot / control theory',
      'power electronics / digital signal processing',
    ],
    position: 'bottom-[14%] left-[6%] md:left-[10%] max-w-[44vw] md:max-w-[32%]',
    enterDir: { y: 24 },
  },
  {
    id: 'q2',
    title: 'MISSION_STATEMENT_',
    lines: [
      '> what we do',
      'bridge academia and industry through',
      'hands-on projects in automation, embedded',
      'systems, and industrial control engineering.',
    ],
    position: 'top-[14%] right-[6%] md:right-[10%] max-w-[44vw] md:max-w-[32%]',
    enterDir: { y: -24 },
  },
  {
    id: 'q4',
    title: 'VISION_LOG_',
    lines: [
      '> where we\'re headed',
      'launch an IEEE-recognized research lab',
      'host jordan\'s largest student engineering expo',
      'build open-source industrial automation tools',
    ],
    position: 'bottom-[14%] right-[6%] md:right-[10%] max-w-[44vw] md:max-w-[32%]',
    enterDir: { y: 24 },
  },
];

const revealOrder = ['q1', 'q3', 'q2', 'q4'];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useGSAP(() => {
    const page = containerRef.current;
    if (!page) return;

    /* Discrete sections: 0=header, 1=q1, 2=q3, 3=q2, 4=q4 */
    let lastSection = -1;

    ScrollTrigger.create({
      trigger: page,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const sp = self.progress;
        const totalVH = 5;
        const headerFraction = 1 / totalVH;
        const activeFraction = (totalVH - 1) / totalVH;
        const fadeOutStart = 0.85;

        /* Rotation: linear from 0 at header-end to 1 at 70% */
        const rotP = sp < headerFraction ? 0 : Math.min(1, (sp - headerFraction) / 0.5);
        progressRef.current = rotP;

        /* Scene opacity */
        const sceneWrapper = document.getElementById('about-scene');
        if (!sceneWrapper) return;

        if (sp < headerFraction) {
          sceneWrapper.style.opacity = String(sp / headerFraction);
        } else if (sp < fadeOutStart) {
          sceneWrapper.style.opacity = '1';
        } else {
          sceneWrapper.style.opacity = String(Math.max(0, 1 - (sp - fadeOutStart) / (1 - fadeOutStart)));
        }

        /* Discrete section tracking — only update GSAP on section change */
        const section = sp < headerFraction ? 0 : Math.min(4, Math.floor((sp - headerFraction) / activeFraction * 4) + 1);
        if (section === lastSection) return;
        lastSection = section;

        revealOrder.forEach((id, i) => {
          const q = quadrants.find((x) => x.id === id)!;
          const visible = i + 1 <= section;
          gsap.to(`#${id}-text`, {
            opacity: visible ? 1 : 0,
            y: visible ? 0 : q.enterDir.y,
            duration: 0.5,
            ease: 'power2.out',
          });
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative bg-surface">
      {/* ===== Scene content — fades in/out as one unit ===== */}
      <div
        id="about-scene"
        className="fixed inset-0 z-10 pointer-events-none"
        style={{ opacity: 0 }}
      >
        {/* Transistor — fills viewport, model is centered in Canvas */}
        <div className="absolute inset-0">
          <TransistorCanvas progressRef={progressRef} />
        </div>

        {/* Quadrant text */}
        <div className="relative w-full h-full max-w-7xl mx-auto px-4">
          {quadrants.map((q) => (
            <div
              key={q.id}
              id={`${q.id}-text`}
              className={`absolute ${q.position} opacity-0`}
              style={{ transform: `translateY(${q.enterDir.y}px)` }}
            >
              <h3 className="font-display text-[22px] md:text-[32px] text-primary mb-3 tracking-wider">
                {q.title}
              </h3>
              <div className="font-mono text-[12px] md:text-[15px] leading-[170%] text-body space-y-1">
                {q.lines.map((line, j) => (
                  <p key={j} className={j === 0 ? 'text-accent' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Scroll sections ===== */}

      {/* Header */}
      <section className="relative z-20 h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">folder_open</span>
            <h1 className="text-[36px] md:text-[64px] leading-[110%] tracking-[0.02em] text-primary font-display">
              ABOUT_IES.EXE<span className="cursor-blink font-mono">_</span>
            </h1>
          </div>
          <p className="font-mono text-[13px] md:text-[16px] text-accent">{`C:\\> loading chapter profile... [OK]`}</p>
          <p className="font-mono text-[11px] text-gray-600 mt-6 animate-pulse">scroll to initialize —</p>
        </div>
      </section>

      {/* 4 scroll triggers */}
      <div id="q1-trigger" className="h-screen relative z-20" />
      <div id="q3-trigger" className="h-screen relative z-20" />
      <div id="q2-trigger" className="h-screen relative z-20" />
      <div id="q4-trigger" className="h-screen relative z-20" />
    </main>
  );
}
