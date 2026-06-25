'use client';

import { BlurFade } from '@/components/ui/blur-fade';
import { MagicCard } from '@/components/ui/magic-card';
import { ShimmerButton } from '@/components/ui/shimmer-button';

const quadrants = [
  {
    title: 'CORE_IDENTITY_',
    lines: [
      '> who we are',
      'official IEEE IES student chapter at JUST',
      'advancing industrial electronics since 2023',
      '60+ active members across 4 committees',
    ],
    direction: 'left' as const,
    delay: 0,
    color: '#F57C00',
  },
  {
    title: 'MISSION_STATEMENT_',
    lines: [
      '> what we do',
      'bridge academia and industry through',
      'hands-on projects in automation, embedded',
      'systems, and industrial control engineering.',
    ],
    direction: 'right' as const,
    delay: 0.1,
    color: '#1E88E5',
  },
  {
    title: 'DOMAIN_EXPERTISE_',
    lines: [
      '> our stack',
      'PLC / SCADA / embedded firmware',
      'pcb design / industrial iot / control theory',
      'power electronics / digital signal processing',
    ],
    direction: 'left' as const,
    delay: 0.2,
    color: '#F57C00',
  },
  {
    title: 'VISION_LOG_',
    lines: [
      '> where we\'re headed',
      'launch an IEEE-recognized research lab',
      'host jordan\'s largest student engineering expo',
      'build open-source industrial automation tools',
    ],
    direction: 'right' as const,
    delay: 0.3,
    color: '#1E88E5',
  },
];

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col pt-24">
      {/* Header */}
      <section className="px-4 md:px-14 max-w-7xl mx-auto w-full py-12">
        <BlurFade inView delay={0.1}>
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined text-[#F57C00] text-3xl">folder_open</span>
            <h1 className="text-[48px] leading-[110%] tracking-[0.02em] text-[#F57C00] font-display">
              ABOUT_IES.EXE<span className="cursor-blink font-mono">_</span>
            </h1>
            <div className="h-px bg-[#1E88E5]/30 flex-grow ml-4"></div>
          </div>
          <p className="font-mono text-[16px] text-[#1E88E5] ml-14">{`C:\\> loading chapter profile... [OK]`}</p>
        </BlurFade>
      </section>

      {/* Quadrant Grid */}
      <section className="px-4 md:px-14 max-w-7xl mx-auto w-full pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quadrants.map((q, i) => (
            <BlurFade key={i} inView delay={q.delay} direction={q.direction}>
              <MagicCard
                className="p-8 min-h-[280px] flex flex-col justify-between border border-[#1E88E5]/20"
                gradientColor={q.color}
                gradientOpacity={0.08}
              >
                <div>
                  <h3 className="font-display text-[28px] text-[#F57C00] mb-6 tracking-wider">
                    {q.title}
                  </h3>
                  <div className="font-mono text-[14px] leading-[200%] text-[#dec1af] space-y-1">
                    {q.lines.map((line, j) => (
                      <p key={j} className={j === 0 ? 'text-[#1E88E5]' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* 3D Model Reserved Area */}
      <section className="px-4 md:px-14 max-w-7xl mx-auto w-full py-12">
        <BlurFade inView delay={0.4}>
          <div className="border-2 border-dashed border-[#1E88E5]/30 rounded-lg p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[#1E88E5]/40 text-6xl mb-4">memory</span>
            <p className="font-mono text-[#1E88E5]/40 text-[14px]">
              [3D TRANSISTOR — PHASE 3]
            </p>
            <p className="font-mono text-[#1E88E5]/20 text-[12px] mt-2">
              transistor model will render here with scroll-driven rotation
            </p>
          </div>
        </BlurFade>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-14 max-w-7xl mx-auto w-full py-12 mb-24 text-center">
        <BlurFade inView delay={0.5}>
          <ShimmerButton
            shimmerColor="#F57C00"
            background="rgba(10,10,10,1)"
            borderRadius="4px"
            className="font-mono text-[16px] px-10 py-4 mx-auto"
            onClick={() => window.open('#', '_blank')}
          >
            INITIALIZE_APPLICATION.EXE
          </ShimmerButton>
          <p className="font-mono text-[12px] text-gray-600 mt-4">
            applications open for all committees
          </p>
        </BlurFade>
      </section>
    </main>
  );
}
