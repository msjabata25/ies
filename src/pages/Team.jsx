import { team } from '@/data/team';
import TeamCanvas from '@/components/sections/TeamCanvas';
import { useI18n } from '@/i18n/context';

export default function TeamPage() {
  const { t } = useI18n();
  return (
    <main className="flex flex-col pt-24">
      <section className="px-4 md:px-14 max-w-7xl mx-auto w-full py-12">
        <div className="flex items-center gap-4 mb-3">
          <span aria-hidden="true" className="material-symbols-outlined text-primary text-3xl">group</span>
          <h1 className="page-title">
            {t('team.title')}<span className="cursor-blink font-mono">_</span>
          </h1>
          <div className="h-px bg-accent/30 flex-grow ms-4"></div>
        </div>
        <p className="font-mono text-[14px] text-accent ms-14">{t('team.count', { count: team.length })}</p>

        <div className="mt-8">
          <TeamCanvas />
        </div>
      </section>
    </main>
  );
}
