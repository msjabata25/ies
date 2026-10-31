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
    <section className="py-12 border-y border-[#1E88E5]/20 overflow-hidden">
      {/* The marquee's scroll animation assumes LTR; each item still reads in the page's direction */}
      <Marquee pauseOnHover={false} repeat={4} className="[--duration:30s]" dir="ltr">
        {stats.map((stat) => (
          <div key={stat.key} dir={dir} className="flex items-center gap-3 mx-6 font-mono text-[14px] text-[#F57C00]/80">
            <span className="text-[#1E88E5]">[</span>
            <span className="whitespace-nowrap">{t(`stats.${stat.key}`)}: </span>
            <NumberTicker value={stat.value} className="text-[#F57C00] font-bold text-[14px]" />
            <span className="text-[#1E88E5]">]</span>
            <span className="text-gray-600 mx-2">//</span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
