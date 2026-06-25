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
    color: '#F57C00',
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
    color: '#1E88E5',
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
    color: '#F57C00',
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
    color: '#1E88E5',
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

    const totalVH = 5;
    const headerFraction = 1 / totalVH;
    const activeFraction = (totalVH - 1) / totalVH;
    const fadeOutStart = (totalVH - 1) / totalVH;

    ScrollTrigger.create({
      trigger: page,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const sp = self.progress;

        /* Rotation progress — active only during the 4 quadrant sections */
        const rotProgress = sp < headerFraction
          ? 0
          : Math.min(1, (sp - headerFraction) / activeFraction);
        progressRef.current = rotProgress;

        /* Fade entire scene content (model + text) in and out */
        const sceneWrapper = document.getElementById('about-scene');
        if (!sceneWrapper) return;

        if (sp < headerFraction) {
          /* Fade in during header */
          sceneWrapper.style.opacity = String(sp / headerFraction);
        } else if (sp < fadeOutStart) {
          /* Fully visible */
          sceneWrapper.style.opacity = '1';
        } else {
          /* Fade out into footer */
          sceneWrapper.style.opacity = String(Math.max(0, 1 - (sp - fadeOutStart) * totalVH));
        }
      },
    });

    /* Each quadrant fades in when scrolled into view, out when scrolled past */
    revealOrder.forEach((id) => {
      const q = quadrants.find((x) => x.id === id)!;
      ScrollTrigger.create({
        trigger: `#${id}-trigger`,
        start: 'top bottom-=5%',
        end: 'bottom top+=5%',
        onEnter: () => {
          gsap.to(`#${id}-text`, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
        },
        onLeave: () => {
          gsap.to(`#${id}-text`, { opacity: 0, y: q.enterDir.y, duration: 0.4, ease: 'power2.in' });
        },
        onEnterBack: () => {
          gsap.to(`#${id}-text`, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
        },
        onLeaveBack: () => {
          gsap.to(`#${id}-text`, { opacity: 0, y: q.enterDir.y, duration: 0.4, ease: 'power2.in' });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative bg-[#0A0A0A]">
      {/* ===== Scene content — fades in/out as one unit ===== */}
      <div
        id="about-scene"
        className="fixed inset-0 z-10 pointer-events-none"
        style={{ opacity: 0 }}
      >
        {/* Transistor */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[340px] h-[340px] md:w-[500px] md:h-[500px]">
            <TransistorCanvas progressRef={progressRef} />
          </div>
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
              <h3 className="font-display text-[22px] md:text-[32px] text-[#F57C00] mb-3 tracking-wider">
                {q.title}
              </h3>
              <div className="font-mono text-[12px] md:text-[15px] leading-[170%] text-[#dec1af] space-y-1">
                {q.lines.map((line, j) => (
                  <p key={j} className={j === 0 ? 'text-[#1E88E5]' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Scroll sections ===== */}

      {/* Header — model is hidden here, fades in as user scrolls */}
      <section className="relative z-20 h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="material-symbols-outlined text-[#F57C00] text-3xl">folder_open</span>
            <h1 className="text-[36px] md:text-[64px] leading-[110%] tracking-[0.02em] text-[#F57C00] font-display">
              ABOUT_IES.EXE<span className="cursor-blink font-mono">_</span>
            </h1>
          </div>
          <p className="font-mono text-[13px] md:text-[16px] text-[#1E88E5]">{`C:\\> loading chapter profile... [OK]`}</p>
          <p className="font-mono text-[11px] text-gray-600 mt-6 animate-pulse">scroll to initialize —</p>
        </div>
      </section>

      {/* 4 scroll triggers — Q1 → Q3 → Q2 → Q4 */}
      <div id="q1-trigger" className="h-screen relative z-20" />
      <div id="q3-trigger" className="h-screen relative z-20" />
      <div id="q2-trigger" className="h-screen relative z-20" />
      <div id="q4-trigger" className="h-screen relative z-20" />
    </main>
  );
}
