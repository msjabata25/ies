import Button from '@/components/ui/Button';
import { useI18n } from '@/i18n/context';

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <main className="flex min-h-screen flex-col pt-24">
      <section className="px-4 md:px-14 max-w-7xl mx-auto w-full py-12">
        <div className="flex items-center gap-4 mb-4">
          <span aria-hidden="true" className="material-symbols-outlined text-primary text-3xl">error</span>
          <h1 className="page-title">
            {/* bdi keeps the Latin "ERROR_404_" in order inside the Arabic (RTL) page */}
            <bdi>{t('notFound.title')}<span className="cursor-blink font-mono">_</span></bdi>
          </h1>
          <div className="h-px bg-accent/30 flex-grow ms-4"></div>
        </div>
        <p className="font-mono text-[14px] text-accent ms-14">{t('notFound.subtitle')}</p>
        <p className="font-mono text-[14px] text-body ms-14 mt-6">{t('notFound.body')}</p>
        <Button to="/" size="sm" className="ms-14 mt-8">
          {t('notFound.home')}
        </Button>
      </section>
    </main>
  );
}
