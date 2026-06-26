import { team } from '@/data/team';
import TeamCanvas from '@/components/sections/TeamCanvas';

export default function TeamPage() {
  return (
    <main className="flex min-h-screen flex-col pt-24">
      <section className="px-4 md:px-14 max-w-7xl mx-auto w-full py-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="material-symbols-outlined text-[#F57C00] text-3xl">group</span>
          <h1 className="text-[48px] leading-[110%] tracking-[0.02em] text-[#F57C00] font-display">
            DIRECTORY.LOG<span className="cursor-blink font-mono">_</span>
          </h1>
          <div className="h-px bg-[#1E88E5]/30 flex-grow ml-4"></div>
        </div>
        <p className="font-mono text-[14px] text-[#1E88E5] ml-14">{`> ${team.length} members registered across 4 committees`}</p>

        <div className="mt-8">
          <TeamCanvas />
        </div>
      </section>
    </main>
  );
}
