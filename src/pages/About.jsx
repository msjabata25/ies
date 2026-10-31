import { useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CircuitScene from '@/components/CircuitScene';
import { useI18n } from '@/i18n/context';

gsap.registerPlugin(ScrollTrigger);

/* Copy lives in the i18n dictionaries (about.quadrants.*); start/end positions mirror in Arabic */
const quadrants = [
  { id: 'q1', position: 'top-[14%] [@media(max-height:720px)]:top-[10%] start-[6%] md:start-[10%] max-w-[44vw] md:max-w-[32%]', enterDir: { y: -24 } },
  { id: 'q3', position: 'bottom-[14%] [@media(max-height:720px)]:bottom-[8%] start-[6%] md:start-[10%] max-w-[44vw] md:max-w-[32%]', enterDir: { y: 24 } },
  { id: 'q2', position: 'top-[14%] [@media(max-height:720px)]:top-[10%] end-[6%] md:end-[10%] max-w-[44vw] md:max-w-[32%]', enterDir: { y: -24 } },
  { id: 'q4', position: 'bottom-[14%] [@media(max-height:720px)]:bottom-[8%] end-[6%] md:end-[10%] max-w-[44vw] md:max-w-[32%]', enterDir: { y: 24 } },
];

const revealOrder = ['q1', 'q3', 'q2', 'q4'];

/* Scroll timeline, in screens scrolled past the top of the page */
const CORE_END = 0.8; // symbol finishes drawing, scene fully faded in
const BRANCH_STEP = 0.9; // gap between one wire starting and the next
const BRANCH_DRAW = 0.6; // screens of scroll to draw one wire
const HOLD = 1; // everything stays on screen after the last wire lands
const FADE = 0.7;
const FADE_START = CORE_END + (revealOrder.length - 1) * BRANCH_STEP + BRANCH_DRAW + HOLD;
const SCROLL_SCREENS = Math.ceil(FADE_START + FADE);

const clamp01 = (n) => Math.min(1, Math.max(0, n));

export default function AboutPage() {
  const containerRef = useRef(null);
  const circuitRef = useRef(null);
  const { t, isArabic } = useI18n();

  useGSAP(() => {
    const page = containerRef.current;
    if (!page) return;

    /* Quadrants whose wire has landed — text only animates when this changes */
    let lastSection = -1;

    const st = ScrollTrigger.create({
      trigger: page,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const s = self.progress * SCROLL_SCREENS;

        /* Transistor symbol draws itself while the header scrolls away */
        circuitRef.current?.setCore(clamp01(s / CORE_END));

        /* Each wire grows with scroll, one after another */
        const branches = revealOrder.map((_, i) => clamp01((s - CORE_END - i * BRANCH_STEP) / BRANCH_DRAW));
        circuitRef.current?.setBranches(branches);

        /* Scene opacity */
        const sceneWrapper = document.getElementById('about-scene');
        if (!sceneWrapper) return;
        sceneWrapper.style.opacity = String(
          s < FADE_START ? clamp01(s / CORE_END) : clamp01(1 - (s - FADE_START) / FADE),
        );

        /* A quadrant's text appears as its wire reaches it */
        const section = branches.filter((p) => p >= 1).length;
        if (section === lastSection) return;
        lastSection = section;

        revealOrder.forEach((id, i) => {
          const q = quadrants.find((x) => x.id === id);
          const visible = i + 1 <= section;
          gsap.to(`#${id}-text`, {
            opacity: visible ? 1 : 0,
            y: visible ? 0 : q.enterDir.y,
            duration: 0.5,
            ease: 'power2.out',
          });
        });
      },
    });

    return () => {
      st.kill();
    };
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative bg-[#0A0A0A]">
      {/* ===== Scene content — fades in/out as one unit ===== */}
      <div
        id="about-scene"
        className="fixed inset-0 z-10 pointer-events-none"
        style={{ opacity: 0 }}
      >
        {/* Circuit — traces route from the transistor to each quadrant */}
        <CircuitScene ref={circuitRef} mirror={isArabic} />

        {/* Quadrant text */}
        <div className="relative w-full h-full max-w-7xl mx-auto px-4">
          {quadrants.map((q) => (
            <div
              key={q.id}
              id={`${q.id}-text`}
              className={`absolute ${q.position} opacity-0`}
              style={{ transform: `translateY(${q.enterDir.y}px)` }}
            >
              <h3 className="font-display text-[22px] md:text-[32px] [@media(max-height:720px)]:text-[22px] text-[#F57C00] mb-3 [@media(max-height:720px)]:mb-1.5 tracking-wider">
                {t(`about.quadrants.${q.id}.title`)}
              </h3>
              <div className="font-mono text-[12px] md:text-[15px] [@media(max-height:720px)]:text-[12px] leading-[170%] [@media(max-height:720px)]:leading-[150%] text-[#dec1af] space-y-1">
                {t(`about.quadrants.${q.id}.lines`).map((line, j) => (
                  <p key={j} className={j === 0 ? 'text-[#1E88E5]' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Scroll sections ===== */}

      {/* Header */}
      <section className="relative z-20 h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="material-symbols-outlined text-[#F57C00] text-3xl">folder_open</span>
            <h1 className="text-[36px] md:text-[64px] leading-[110%] tracking-[0.02em] text-[#F57C00] font-display">
              {t('about.title')}<span className="cursor-blink font-mono">_</span>
            </h1>
          </div>
          <p className="font-mono text-[13px] md:text-[16px] text-[#1E88E5]">{t('about.loading')}</p>
          <p className="font-mono text-[11px] text-gray-600 mt-6 animate-pulse">{t('about.scroll')}</p>
        </div>
      </section>

      {/* Scroll runway for the circuit timeline (header above is the first screen) */}
      <div className="relative z-20" style={{ height: `${SCROLL_SCREENS * 100}vh` }} />
    </main>
  );
}
