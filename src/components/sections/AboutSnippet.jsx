import { Link } from 'react-router-dom';
import { EncryptedText } from '@/components/ui/encrypted-text';
import { BlurFade } from '@/components/ui/blur-fade';
import { useI18n } from '@/i18n/context';

export default function AboutSnippet() {
  const { t, isArabic } = useI18n();

  return (
    <section className="min-h-[60vh] flex flex-col justify-center px-4 md:px-14 max-w-7xl mx-auto py-20 overflow-hidden">
      <BlurFade inView delay={0.1} direction="up">
        <div className="flex items-center gap-4 mb-8">
          <span aria-hidden="true" className="material-symbols-outlined text-primary text-3xl">folder_open</span>
          <h2 className="text-[48px] leading-[110%] tracking-[0.02em] text-primary font-display">
            {t('aboutSnippet.title')}<span className="cursor-blink font-mono">_</span>
          </h2>
          <div className="h-px bg-accent/30 flex-grow ms-4"></div>
        </div>
      </BlurFade>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <BlurFade inView delay={0.2} direction="left">
          <div className="font-mono text-[16px] leading-[180%] text-body space-y-6">
            <p className="bg-card border-s-2 border-primary ps-4 py-3">
              <span className="text-primary">{`>`}</span> {t('aboutSnippet.p1')}
            </p>
            <p className="bg-card border-s-2 border-accent ps-4 py-3">
              <span className="text-accent">{`>`}</span> {t('aboutSnippet.p2')}
            </p>
          </div>
        </BlurFade>

        <BlurFade inView delay={0.35} direction="right" className="flex justify-center">
          <Link
            to="/about"
            className="relative group cursor-pointer bg-transparent border-2 border-primary px-8 py-5 font-mono text-[16px] text-primary hover:bg-primary hover:text-surface transition-all duration-300 inline-grid"
          >
            {/* both labels share one grid cell, so the button keeps the wider width and never resizes on hover */}
            <span className="[grid-area:1/1] group-hover:invisible group-focus-visible:invisible">
              {/* The per-letter scramble would split up Arabic's joined letters, so Arabic gets plain text */}
              {isArabic ? (
                t('aboutSnippet.locked')
              ) : (
                <EncryptedText
                  text={t('aboutSnippet.locked')}
                  className="text-[16px] font-mono text-primary inline"
                  revealDelayMs={30}
                  encryptedClassName="text-idle"
                  revealedClassName="text-primary"
                />
              )}
            </span>
            <span className="[grid-area:1/1] invisible group-hover:visible group-focus-visible:visible text-surface font-bold">
              {t('aboutSnippet.unlocked')}
            </span>
          </Link>
        </BlurFade>
      </div>
    </section>
  );
}
