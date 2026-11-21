import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/context';

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <main className="flex min-h-screen flex-col pt-24">
      <section className="px-4 md:px-14 max-w-7xl mx-auto w-full py-12">
        <div className="flex items-center gap-4 mb-4">
          <span aria-hidden="true" className="material-symbols-outlined text-[#F57C00] text-3xl">error</span>
          <h1 className="text-[48px] leading-[110%] tracking-[0.02em] text-[#F57C00] font-display">
            {t('notFound.title')}<span className="cursor-blink font-mono">_</span>
          </h1>
          <div className="h-px bg-[#1E88E5]/30 flex-grow ms-4"></div>
        </div>
        <p className="font-mono text-[14px] text-[#1E88E5] ms-14">{t('notFound.subtitle')}</p>
        <p className="font-mono text-[14px] text-[#dec1af] ms-14 mt-6">{t('notFound.body')}</p>
        <Link
          to="/"
          className="inline-block ms-14 mt-8 border border-[#F57C00] px-6 py-3 font-mono text-[14px] font-bold text-[#F57C00] hover:bg-[#F57C00] hover:text-[#0A0A0A] transition-colors"
        >
          {t('notFound.home')}
        </Link>
      </section>
    </main>
  );
}
