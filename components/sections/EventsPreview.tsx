'use client';

import Link from 'next/link';
import { HoverEffect } from '@/components/ui/card-hover-effect';

const previewEvents = [
  {
    title: 'PLC_PROGRAMMING_01',
    description: 'intro to ladder logic and plc programming for industrial automation. bring your laptop.',
    link: '/events',
  },
  {
    title: 'HACKATHON_24H',
    description: '24-hour embedded systems challenge. teams build a smart sensor node from scratch.',
    link: '/events',
  },
  {
    title: '???',
    description: '',
    link: '/events',
  },
];

export default function EventsPreview() {
  return (
    <section className="px-4 md:px-14 max-w-7xl mx-auto py-20 overflow-hidden">
      <div className="flex items-center gap-4 mb-8">
        <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
        <h2 className="text-[32px] md:text-[48px] leading-[110%] tracking-[0.02em] text-primary font-display">
          ACTIVE_INITIATIVES.LOG<span className="cursor-blink font-mono">_</span>
        </h2>
        <div className="h-px bg-accent/30 flex-grow ml-4"></div>
      </div>

      <div className="relative">
        <HoverEffect items={previewEvents.slice(0, 2).map(e => ({
          ...e,
          title: e.title,
          description: e.description,
          link: e.link,
        }))} />

        <div className="relative mt-[-100px] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-surface/60 to-surface z-10"></div>
          <div className="absolute inset-0 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <Link href="/events">
              <span className="font-mono text-primary text-[16px] border border-primary px-6 py-3 hover:bg-primary hover:text-surface transition-all duration-300 pointer-events-auto inline-block">
                FIND OUT WHAT WE'RE DOING NEXT →
              </span>
            </Link>
          </div>
          <div className="opacity-30 filter blur-[4px]">
            <HoverEffect items={[{
              title: '???',
              description: 'classified',
              link: '/events',
            }]} />
          </div>
        </div>
      </div>
    </section>
  );
}
