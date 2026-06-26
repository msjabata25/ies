import Link from 'next/link';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';

const leaders = [
  { id: 1, name: 'Ahmad Al-Khatib', designation: 'Chair', image: '' },
  { id: 2, name: 'Layla Mansour', designation: 'Vice Chair', image: '' },
  { id: 3, name: 'Omar Haddad', designation: 'Lead Engineer', image: '' },
  { id: 4, name: 'Sara Nassar', designation: 'Content Lead', image: '' },
  { id: 5, name: 'Mohammad Obeidat', designation: 'Treasurer', image: '' },
  { id: 6, name: 'Noor Shamma', designation: 'Frontend Dev', image: '' },
];

export default function TeamPreview() {
  return (
    <section className="px-4 md:px-14 max-w-7xl mx-auto py-20 overflow-visible border-t border-[#1E88E5]/20">
      <div className="flex items-center gap-4 mb-12">
        <span className="material-symbols-outlined text-[#F57C00] text-3xl">group</span>
        <h2 className="text-[32px] md:text-[48px] leading-[110%] tracking-[0.02em] text-[#F57C00] font-display">
          LEADERSHIP.LOG<span className="cursor-blink font-mono">_</span>
        </h2>
        <div className="h-px bg-[#1E88E5]/30 flex-grow ml-4"></div>
      </div>

      <div className="flex justify-center mb-12">
        <AnimatedTooltip items={leaders} />
      </div>

      <div className="text-center">
        <Link href="/team">
          <span className="font-mono text-[#1E88E5] text-[14px] border border-[#1E88E5] px-6 py-3 hover:bg-[#1E88E5] hover:text-[#0A0A0A] transition-all duration-300 inline-block">
            MEET THE FULL TEAM →
          </span>
        </Link>
      </div>
    </section>
  );
}
