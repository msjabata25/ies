import { Marquee } from '@/components/ui/marquee';
import { NumberTicker } from '@/components/ui/number-ticker';
import { useI18n } from '@/i18n/context';

const stats = [
  { key: 'members', value: 28 },
  { key: 'events', value: 12 },
  { key: 'workshops', value: 5 },
  { key: 'projects', value: 8 },
  { key: 'hackathonHours', value: 96 },
  { key: 'speakers', value: 15 },
];

export default function StatsTicker() {
  const { t, dir } = useI18n();

  return (
    <section className="py-12 border-y border-accent/20 overflow-hidden">
      {/* The marquee's scroll animation assumes LTR; each item still reads in the page's direction */}
      <Marquee pauseOnHover={false} repeat={4} className="[--duration:30s]" dir="ltr">
        {(copy) =>
          stats.map((stat) => (
            <div key={stat.key} dir={dir} className="flex items-center gap-3 mx-6 font-mono text-[14px] text-primary/80 light:text-primary">
              <span className="text-accent">[</span>
              <span className="whitespace-nowrap">{t(`stats.${stat.key}`)}: </span>
              {/* copies after the first slide in already on screen, so they show the final number instead of counting from 0 */}
              <NumberTicker value={stat.value} instant={copy > 0} className="text-primary font-bold text-[14px]" />
              <span className="text-accent">]</span>
              <span className="text-faint mx-2">//</span>
            </div>
          ))
        }
      </Marquee>
    </section>
  );
}
