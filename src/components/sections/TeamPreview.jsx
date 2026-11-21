import Button from '@/components/ui/Button';
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
    <section className="w-full px-4 md:px-14 max-w-7xl mx-auto py-20 overflow-visible">
      <div className="flex items-center gap-4 mb-8">
        <span aria-hidden="true" className="material-symbols-outlined text-primary text-3xl">group</span>
        <h2 className="section-title">
          {t('teamPreview.title')}<span className="cursor-blink font-mono">_</span>
        </h2>
        <div className="h-px bg-accent/30 flex-grow ms-4"></div>
      </div>

      <div className="flex justify-center mb-12">
        <AnimatedTooltip items={items} />
      </div>

      <div className="text-center">
        <Button to="/team" variant="secondary" className="max-w-full">
          {t('teamPreview.cta')}
        </Button>
      </div>
    </section>
  );
}
