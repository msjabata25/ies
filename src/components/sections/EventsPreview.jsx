import { Link } from 'react-router-dom';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { events } from '@/data/events';

/* Local date as 'YYYY-MM-DD', comparable with event dates as plain strings. */
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* The two most relevant events: soonest upcoming first, topped up with the latest past ones. */
function pickPreview() {
  const now = today();
  const upcoming = events.filter((e) => e.date >= now).sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter((e) => e.date < now).sort((a, b) => b.date.localeCompare(a.date));
  return [...upcoming.map((e) => ({ ...e, when: 'NEXT' })), ...past.map((e) => ({ ...e, when: 'LOGGED' }))]
    .slice(0, 2)
    .map((e) => ({
      title: e.title,
      description: `[${e.when} // ${e.date}] ${e.description}`,
      link: '/events',
    }));
}

export default function EventsPreview() {
  const previewEvents = pickPreview();

  return (
    <section className="px-4 md:px-14 max-w-7xl mx-auto py-20 overflow-hidden">
      <div className="flex items-center gap-4 mb-8">
        <span className="material-symbols-outlined text-[#F57C00] text-3xl">terminal</span>
        <h2 className="text-[32px] md:text-[48px] leading-[110%] tracking-[0.02em] text-[#F57C00] font-display">
          ACTIVE_INITIATIVES.LOG<span className="cursor-blink font-mono">_</span>
        </h2>
        <div className="h-px bg-[#1E88E5]/30 flex-grow ml-4"></div>
      </div>

      <div className="relative">
        <HoverEffect items={previewEvents} />

        <div className="relative mt-[-100px] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0A0A0A]/60 to-[#0A0A0A] z-10"></div>
          <div className="absolute inset-0 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <Link to="/events">
              <span className="font-mono text-[#F57C00] text-[16px] border border-[#F57C00] px-6 py-3 hover:bg-[#F57C00] hover:text-[#0A0A0A] transition-all duration-300 pointer-events-auto inline-block">
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
