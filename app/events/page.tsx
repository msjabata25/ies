'use client';

import { useState, useMemo } from 'react';
import { events, type ChapterEvent, type EventStatus, type EventType } from '@/data/events';
import ParticleText from '@/components/sections/ParticleText';
import { CardSpotlight } from '@/components/ui/card-spotlight';

function getStatusColor(status: string) {
  switch (status) {
    case 'Active': return 'text-green-400';
    case 'Upcoming': return 'text-yellow-400';
    case 'Past': return 'text-gray-500';
    default: return 'text-gray-500';
  }
}

const STATUS_FILTERS: (EventStatus | 'All')[] = ['All', 'Upcoming', 'Active', 'Past'];
const TYPE_FILTERS: (EventType | 'All')[] = ['All', 'Workshop', 'Seminar', 'Hackathon', 'Expo'];

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
        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</span>
      </div>
    </CardSpotlight>
  );
}

export default function EventsPage() {
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<EventType | 'All'>('All');
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (statusFilter !== 'All' && event.status !== statusFilter) return false;
      if (typeFilter !== 'All' && event.type !== typeFilter) return false;
      return true;
    });
  }, [statusFilter, typeFilter]);

  return (
    <main className="flex min-h-screen flex-col">
      <section className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen sticky top-0 lg:sticky lg:top-0 bg-[#0A0A0A] z-10">
          <ParticleText />
        </div>
        <div className="w-full lg:w-1/2 bg-[#0A0A0A] pt-28 pb-12 px-4 md:px-8 overflow-y-auto"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(30,136,229,0.1) 1px, transparent 1px),
              linear-gradient(0deg, rgba(30,136,229,0.1) 1px, transparent 1px),
              radial-gradient(circle, rgba(30,136,229,0.18) 2px, transparent 2px)
            `,
            backgroundSize: '40px 40px, 40px 40px, 40px 40px',
            backgroundPosition: '0 0, 0 0, 20px 20px',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="max-w-2xl mx-auto">
            {/* Filter bar */}
            <div className="mb-6 flex items-center justify-between gap-2 font-mono text-[11px]">
              <div className="flex flex-wrap gap-2">
                {TYPE_FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setTypeFilter(f)}
                    className={`px-3 py-1.5 border transition-colors ${
                      typeFilter === f
                        ? 'bg-[#F57C00] text-[#0A0A0A] border-[#F57C00]'
                        : 'bg-transparent text-[#dec1af] border-[#1E88E5]/30 hover:border-[#F57C00]/50'
                    }`}
                  >
                    [{f.toUpperCase()}]
                  </button>
                ))}
              </div>

              {/* Status dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="px-3 py-1.5 border border-[#1E88E5]/30 text-[#dec1af] hover:border-[#F57C00]/50 transition-colors whitespace-nowrap"
                >
                  STATUS: {statusFilter === 'All' ? 'ALL' : statusFilter.toUpperCase()} ▼
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-50 bg-[#0e0e0e] border border-[#1E88E5]/30 shadow-lg min-w-[140px]">
                      {STATUS_FILTERS.map((f) => (
                        <button
                          key={f}
                          onClick={() => { setStatusFilter(f); setMenuOpen(false); }}
                          className={`block w-full text-left px-3 py-2 transition-colors ${
                            statusFilter === f
                              ? 'bg-[#F57C00]/20 text-[#F57C00]'
                              : 'text-[#dec1af] hover:bg-[#1E88E5]/10'
                          }`}
                        >
                          [{f.toUpperCase()}]
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-6">
              {filteredEvents.length === 0 ? (
                <p className="font-mono text-[13px] text-[#dec1af] text-center py-12">
                  &gt; no matching events found_
                </p>
              ) : (
                filteredEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
