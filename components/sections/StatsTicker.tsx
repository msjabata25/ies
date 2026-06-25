'use client';

import { Marquee } from '@/components/ui/marquee';
import { NumberTicker } from '@/components/ui/number-ticker';

const stats = [
  { label: 'MEMBERS RECRUITED', value: 28 },
  { label: 'EVENTS HELD', value: 12 },
  { label: 'WORKSHOPS RUN', value: 5 },
  { label: 'PROJECTS LAUNCHED', value: 8 },
  { label: 'HACKATHON HOURS', value: 96 },
  { label: 'GUEST SPEAKERS', value: 15 },
];

export default function StatsTicker() {
  return (
    <section className="py-12 border-y border-accent/20 overflow-hidden">
      <Marquee pauseOnHover={false} repeat={4} className="[--duration:30s]">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-3 mx-6 font-mono text-[14px] text-primary/80">
            <span className="text-accent">[</span>
            <span className="whitespace-nowrap">{stat.label}: </span>
            <NumberTicker value={stat.value} className="text-primary font-bold text-[14px]" />
            <span className="text-accent">]</span>
            <span className="text-gray-600 mx-2">//</span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
