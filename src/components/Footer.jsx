import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/context';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-primary/15 bg-footer font-mono py-8 px-6 md:px-20 mx-auto w-full z-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 items-center mb-8">
        <div>
          <div className="text-primary font-display text-2xl tracking-wider">IES.JUST</div>
          <div className="text-xs text-muted mt-2 max-w-[200px]">{t('footer.tagline')}</div>
        </div>

        <div className="flex flex-col md:flex-row md:gap-6 md:justify-center text-sm text-muted">
          <Link to="/about" className="inline-flex items-center min-h-11 md:min-h-0 hover:text-primary transition">{t('footer.about')}</Link>
          <Link to="/events" className="inline-flex items-center min-h-11 md:min-h-0 hover:text-primary transition">{t('footer.events')}</Link>
          <Link to="/team" className="inline-flex items-center min-h-11 md:min-h-0 hover:text-primary transition">{t('footer.team')}</Link>
          <Link to="/" className="inline-flex items-center min-h-11 md:min-h-0 hover:text-primary transition">{t('footer.home')}</Link>
        </div>

        <div className="flex gap-4 md:justify-end text-sm text-accent">
          <a href="https://www.instagram.com/ieeeiesjust/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-11 md:min-h-0 hover:text-fg transition" dir="ltr">{t('footer.instagram')}</a>
          <span className="text-muted italic" title={t('footer.comingSoon')}>{t('footer.linkOffline')}</span>
        </div>
      </div>

      <div className="text-center text-xs text-muted border-t border-line pt-6 flex flex-wrap justify-center gap-2 md:gap-6">
        <span>{t('footer.poweredBy')}</span>
        <span className="hidden md:inline">|</span>
        <span>{t('footer.location')}</span>
        <span className="hidden md:inline">|</span>
        <span>{new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
