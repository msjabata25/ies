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

function EventCard({ event, index }) {
  const { t, pick } = useI18n();
  return (
    <CardSpotlight
      className="!p-6 !border-accent/30 hover:!border-primary/50 transition-colors bg-card"
      color="color-mix(in oklab, var(--color-primary) 5%, transparent)"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="font-display text-[48px] text-primary/20 leading-none">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className={`font-mono text-[12px] ${getStatusColor(event.status)} border border-current px-2 py-1`}>
          {t(`events.statuses.${event.status}`)}
        </span>
      </div>
      <h3 className="font-display text-[24px] text-primary mb-2 tracking-wider">{pick(event, 'title')}</h3>
      <p className="font-mono text-[13px] text-body leading-[170%] mb-4 min-h-[60px]">{pick(event, 'description')}</p>
      <div className="flex justify-between items-center font-mono text-[12px] text-accent border-t border-accent/20 pt-3">
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
            <div className="mb-6 flex items-center justify-between gap-2 font-mono text-[11px]">
              <div className="flex flex-wrap gap-2">
                {TYPE_FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setTypeFilter(f)}
                    aria-pressed={typeFilter === f}
                    className={`px-3 py-1.5 border transition-colors ${
                      typeFilter === f
                        ? 'bg-primary text-surface border-primary'
                        : 'bg-transparent text-body border-accent/30 hover:border-primary/50'
                    }`}
                  >
                    [{t(`events.types.${f}`)}]
                  </button>
                ))}
              </div>

              {/* Status dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={menuOpen}
                  className="px-3 py-1.5 border border-accent/30 text-body hover:border-primary/50 transition-colors whitespace-nowrap"
                >
                  {t('events.statusLabel')} {t(`events.statuses.${statusFilter}`)} ▼
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute end-0 top-full mt-1 z-50 bg-card border border-accent/30 shadow-lg min-w-[140px]" role="listbox">
                      {STATUS_FILTERS.map((f) => (
                        <button
                          key={f}
                          role="option"
                          aria-selected={statusFilter === f}
                          onClick={() => { setStatusFilter(f); setMenuOpen(false); }}
                          className={`block w-full text-start px-3 py-2 transition-colors ${
                            statusFilter === f
                              ? 'bg-primary/20 text-primary'
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
