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
    initials: initialsOf(m.name),
    image: m.photo ?? '',
  }));

  return (
    <section className="px-4 md:px-14 max-w-7xl mx-auto py-20 overflow-visible border-t border-[#1E88E5]/20">
      <div className="flex items-center gap-4 mb-12">
        <span className="material-symbols-outlined text-[#F57C00] text-3xl">group</span>
        <h2 className="text-[32px] md:text-[48px] leading-[110%] tracking-[0.02em] text-[#F57C00] font-display">
          {t('teamPreview.title')}<span className="cursor-blink font-mono">_</span>
        </h2>
        <div className="h-px bg-[#1E88E5]/30 flex-grow ms-4"></div>
      </div>

      <div className="flex justify-center mb-12">
        <AnimatedTooltip items={items} />
      </div>

      <div className="text-center">
        <Link to="/team">
          <span className="font-mono text-[#1E88E5] text-[14px] border border-[#1E88E5] px-6 py-3 hover:bg-[#1E88E5] hover:text-[#0A0A0A] transition-all duration-300 inline-block">
            {t('teamPreview.cta')}
          </span>
        </Link>
      </div>
    </section>
  );
}
