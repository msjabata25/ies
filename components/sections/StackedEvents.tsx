'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { ChapterEvent } from '@/data/events';

gsap.registerPlugin(ScrollTrigger);

function getStatusColor(status: string) {
  switch (status) {
    case 'Active': return 'text-green-400';
    case 'Upcoming': return 'text-yellow-400';
    case 'Past': return 'text-gray-500';
    default: return 'text-gray-500';
  }
}

interface StackedEventsProps {
  events: ChapterEvent[];
}

export default function StackedEvents({ events }: StackedEventsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container || events.length === 0) return;

    const cards = container.querySelectorAll<HTMLDivElement>('.stack-card');
    const total = cards.length;

    cards.forEach((card, i) => {
      const s = 1 - i * 0.08;
      gsap.set(card, {
        scale: s,
        y: -i * 20,
        opacity: 1,
        rotationX: 0,
        transformOrigin: '50% 100%',
      });
    });

    const tl = gsap.timeline();

    for (let i = 0; i < total - 1; i++) {
      const nextScale = 1 - (i + 1) * 0.08;
      tl.to(cards[i], {
        rotationX: -90,
        opacity: 0.2,
        scale: nextScale * 0.8,
        y: (i + 1) * 20,
        duration: 0.4,
        ease: 'power2.in',
      });
    }

    const st = ScrollTrigger.create({
      trigger: container,
      pin: true,
      start: 'top top',
      end: `+=${total * 90}vh`,
      scrub: 1.5,
      animation: tl,
    });

    return () => {
      st.kill();
    };
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#0A0A0A] flex items-center justify-center"
      style={{ perspective: '1200px' }}
    >
      <div className="relative w-full max-w-lg" style={{ transformStyle: 'preserve-3d', height: '380px' }}>
        {events.map((event, i) => (
          <div
            key={event.id}
            className="stack-card absolute inset-0 bg-[#0e0e0e] border border-[#1E88E5]/30 p-6 rounded-sm shadow-lg"
            style={{
              backfaceVisibility: 'hidden',
              zIndex: events.length - i,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="font-display text-[48px] text-[#F57C00]/20 leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={`font-mono text-[12px] ${getStatusColor(event.status)} border border-current px-2 py-1`}>
                {event.status.toUpperCase()}
              </span>
            </div>
            <h3 className="font-display text-[24px] text-[#F57C00] mb-2 tracking-wider">{event.title}</h3>
            <p className="font-mono text-[13px] text-[#dec1af] leading-[170%] mb-4 min-h-[60px]">{event.description}</p>
            <div className="flex justify-between items-center font-mono text-[12px] text-[#1E88E5] border-t border-[#1E88E5]/20 pt-3">
              <span>{event.type}</span>
              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
