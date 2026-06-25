'use client';

import { useState } from 'react';
import { events, type ChapterEvent } from '@/data/events';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { BlurFade } from '@/components/ui/blur-fade';

type ViewMode = 'stack' | 'grid' | 'calendar';

function getStatusColor(status: string) {
  switch (status) {
    case 'Active': return 'text-green-400';
    case 'Upcoming': return 'text-yellow-400';
    case 'Past': return 'text-gray-500';
    default: return 'text-gray-500';
  }
}

function EventCard({ event, index }: { event: ChapterEvent; index: number }) {
  return (
    <CardSpotlight
      className="!p-6 !border-[#1E88E5]/30 hover:!border-[#F57C00]/50 transition-colors bg-[#0e0e0e]"
      color="rgba(245,124,0,0.05)"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="font-display text-[48px] text-[#F57C00]/20 leading-none">
          {String(index + 1).padStart(2, '0')}
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
    </CardSpotlight>
  );
}

function StackView() {
  return (
    <div className="relative" style={{ perspective: '1200px' }}>
      {events.map((event, i) => (
        <div
          key={event.id}
          className="relative"
          style={{
            zIndex: events.length - i,
            marginTop: i === 0 ? 0 : '-60px',
            transform: `rotate(${i * 0.5}deg)`,
          }}
        >
          <BlurFade inView delay={i * 0.1}>
            <EventCard event={event} index={i} />
          </BlurFade>
        </div>
      ))}
    </div>
  );
}

function GridView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, i) => (
        <BlurFade key={event.id} inView delay={i * 0.05}>
          <EventCard event={event} index={i} />
        </BlurFade>
      ))}
    </div>
  );
}

function CalendarView() {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const currentYear = 2026;

  const eventsByMonth = events.reduce<Record<string, ChapterEvent[]>>((acc, event) => {
    const date = new Date(event.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {months.map((month, i) => {
        const key = `${currentYear}-${i}`;
        const monthEvents = eventsByMonth[key] || [];
        return (
          <div key={i} className="border border-[#1E88E5]/20 p-4 bg-[#0e0e0e] min-h-[120px]">
            <div className="font-mono text-[12px] text-[#F57C00] mb-3">{month}</div>
            <div className="flex flex-wrap gap-2">
              {monthEvents.map((event) => (
                <ExpandableCard
                  key={event.id}
                  trigger={
                    <div className={`w-3 h-3 rounded-full cursor-pointer ${getStatusColor(event.status)}`} />
                  }
                >
                  <div className="bg-[#0e0e0e] border border-[#F57C00]/30 p-4 w-64 shadow-lg">
                    <div className="font-display text-[16px] text-[#F57C00] mb-1">{event.title}</div>
                    <div className="font-mono text-[12px] text-[#dec1af] mb-2">{event.description}</div>
                    <div className="font-mono text-[11px] text-[#1E88E5]">
                      {event.type} — {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </ExpandableCard>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function EventsPage() {
  const [view, setView] = useState<ViewMode>('stack');

  return (
    <main className="flex min-h-screen flex-col pt-24">
      <section className="px-4 md:px-14 max-w-7xl mx-auto w-full py-12">
        <BlurFade inView delay={0.1}>
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined text-[#F57C00] text-3xl">terminal</span>
            <h1 className="text-[48px] leading-[110%] tracking-[0.02em] text-[#F57C00] font-display">
              ACTIVE_INITIATIVES.LOG<span className="cursor-blink font-mono">_</span>
            </h1>
            <div className="h-px bg-[#1E88E5]/30 flex-grow ml-4"></div>
          </div>
        </BlurFade>

        {/* View Toggle */}
        <BlurFade inView delay={0.2}>
          <div className="flex gap-2 mb-8 font-mono text-[13px]">
            {(['stack', 'grid', 'calendar'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                className={`px-4 py-2 border transition-colors ${
                  view === mode
                    ? 'bg-[#F57C00] text-[#0A0A0A] border-[#F57C00]'
                    : 'bg-transparent text-[#dec1af] border-[#1E88E5]/30 hover:border-[#F57C00]/50'
                }`}
              >
                [{mode.toUpperCase()}]
              </button>
            ))}
          </div>
        </BlurFade>

        {/* Cards */}
        {view === 'stack' && <StackView />}
        {view === 'grid' && <GridView />}
        {view === 'calendar' && <CalendarView />}
      </section>
    </main>
  );
}
