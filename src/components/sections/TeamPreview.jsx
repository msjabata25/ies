import { Link } from 'react-router-dom';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { initialsOf, team } from '@/data/team';
import { useI18n } from '@/i18n/context';

/* Board members lead the preview; fill up to six with the rest of the team. */
const leaders = [...team.filter((m) => m.committee === 'Board'), ...team.filter((m) => m.committee !== 'Board')].slice(0, 6);

export default function TeamPreview() {
  const { t, pick } = useI18n();
  const items = leaders.map((m) => ({
    id: m.id,
    name: pick(m, 'name'),
    designation: pick(m, 'role'),
    initials: initialsOf(pick(m, 'name')),
    image: m.photo ?? '',
  }));

  return (
    <section className="px-4 md:px-14 max-w-7xl mx-auto py-20 overflow-visible border-t border-accent/20">
      <div className="flex items-center gap-4 mb-12">
        <span aria-hidden="true" className="material-symbols-outlined text-primary text-3xl">group</span>
        <h2 className="text-[32px] md:text-[48px] leading-[110%] tracking-[0.02em] text-primary font-display">
          {t('teamPreview.title')}<span className="cursor-blink font-mono">_</span>
        </h2>
        <div className="h-px bg-accent/30 flex-grow ms-4"></div>
      </div>

      <div className="flex justify-center mb-12">
        <AnimatedTooltip items={items} />
      </div>

      <div className="text-center">
        <Link to="/team">
          <span className="font-mono text-accent text-[14px] border border-accent px-6 py-3 hover:bg-accent hover:text-surface transition-all duration-300 inline-block">
            {t('teamPreview.cta')}
          </span>
        </Link>
      </div>
    </section>
  );
}
