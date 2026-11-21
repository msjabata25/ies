import { useState, useMemo, useEffect } from 'react';
import { events } from '@/data/events';
import ParticleText from '@/components/sections/ParticleText';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { useI18n } from '@/i18n/context';

function getStatusColor(status) {
  switch (status) {
    case 'Active': return 'text-ok';
    case 'Upcoming': return 'text-warn';
    case 'Past': return 'text-idle';
    default: return 'text-idle';
  }
}

const STATUS_FILTERS = ['All', 'Upcoming', 'Active', 'Past'];
const TYPE_FILTERS = ['All', 'Workshop', 'Seminar', 'Hackathon', 'Expo'];

/* Card number = position in the full list, so it never changes with the filters */
const EVENT_NUMBER = new Map(events.map((e, i) => [e.id, i + 1]));

function EventCard({ event }) {
  const { t, pick } = useI18n();
  const past = event.status === 'Past';
  return (
    <CardSpotlight
      className={`!p-6 transition-colors bg-card ${
        past
          ? '!border-line hover:!border-accent/50'
          : '!border-primary/40 hover:!border-primary'
      }`}
      color="color-mix(in oklab, var(--color-primary) 5%, transparent)"
    >
      <div className="flex items-start justify-between mb-4">
        <span className={`font-display text-[48px] leading-none ${past ? 'text-faint' : 'text-primary/40'}`}>
          {String(EVENT_NUMBER.get(event.id)).padStart(2, '0')}
        </span>
        <span className={`font-mono text-[13px] ${getStatusColor(event.status)} border border-current px-2 py-1`}>
          {t(`events.statuses.${event.status}`)}
        </span>
      </div>
      <h3 className={`font-display text-[24px] mb-2 ${past ? 'text-fg' : 'text-primary'} tracking-wider`}>{pick(event, 'title')}</h3>
      <p className="font-mono text-[13px] text-body leading-[170%] mb-4 min-h-[60px]">{pick(event, 'description')}</p>
      <div className="flex justify-between items-center font-mono text-[13px] text-accent border-t border-accent/20 pt-3">
        <span>{t(`events.typeNames.${event.type}`)}</span>
        <span>{new Date(event.date).toLocaleDateString(t('events.dateLocale'), { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</span>
      </div>
    </CardSpotlight>
  );
}

export default function EventsPage() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useI18n();

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (statusFilter !== 'All' && event.status !== statusFilter) return false;
      if (typeFilter !== 'All' && event.type !== typeFilter) return false;
      return true;
    });
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <main className="flex min-h-screen flex-col">
      <h1 className="sr-only">{t('events.particle')}</h1>
      <section className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen lg:sticky lg:top-0 bg-surface z-10">
          <ParticleText text={t('events.particle')} />
        </div>
        <div className="w-full lg:w-1/2 bg-surface pt-28 pb-12 px-4 md:px-8 overflow-y-auto"
          style={{
            backgroundImage: `
              linear-gradient(90deg, color-mix(in oklab, var(--color-accent) 10%, transparent) 1px, transparent 1px),
              linear-gradient(0deg, color-mix(in oklab, var(--color-accent) 10%, transparent) 1px, transparent 1px),
              radial-gradient(circle, color-mix(in oklab, var(--color-accent) 18%, transparent) 2px, transparent 2px)
            `,
            backgroundSize: '40px 40px, 40px 40px, 40px 40px',
            backgroundPosition: '0 0, 0 0, 20px 20px',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="max-w-2xl mx-auto">
            {/* Filter bar */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                {TYPE_FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setTypeFilter(f)}
                    aria-pressed={typeFilter === f}
                    className={`pill ${typeFilter === f ? 'pill-active' : ''}`}
                  >
                    [{t(`events.types.${f}`)}]
                  </button>
                ))}
              </div>

              {/* Status dropdown */}
              <div className="relative ms-auto">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={menuOpen}
                  className={`pill ${statusFilter !== 'All' ? 'pill-active' : ''}`}
                >
                  {t('events.statusLabel')} {t(`events.statuses.${statusFilter}`)} ▼
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute end-0 top-full mt-1 z-50 bg-card border border-accent/30 shadow-lg min-w-[160px]" role="listbox">
                      {STATUS_FILTERS.map((f) => (
                        <button
                          key={f}
                          role="option"
                          aria-selected={statusFilter === f}
                          onClick={() => { setStatusFilter(f); setMenuOpen(false); }}
                          className={`block w-full min-h-10 text-start px-4 py-2 font-mono text-[12px] uppercase transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary ${
                            statusFilter === f
                              ? 'bg-primary/15 text-primary'
                              : 'text-body hover:bg-accent/10'
                          }`}
                        >
                          [{t(`events.statuses.${f}`)}]
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
                <p className="font-mono text-[13px] text-body text-center py-12">
                  {t('events.empty')}
                </p>
              ) : (
                filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
