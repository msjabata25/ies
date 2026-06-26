import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(245,124,0,0.15)] bg-[#050505] font-mono py-8 px-6 md:px-20 mx-auto w-full z-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 items-center mb-8">
        <div>
          <div className="text-[#F57C00] font-display text-2xl tracking-wider">IES.JUST</div>
          <div className="text-xs text-gray-500 mt-2 max-w-[200px]">Industrial Electronics Society — JUST Student Chapter</div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:justify-center text-sm text-gray-400">
          <Link href="/about" className="hover:text-[#F57C00] transition">About</Link>
          <Link href="/events" className="hover:text-[#F57C00] transition">Events</Link>
          <Link href="/team" className="hover:text-[#F57C00] transition">Team</Link>
          <Link href="/" className="hover:text-[#F57C00] transition">Home</Link>
        </div>

        <div className="flex gap-4 md:justify-end text-sm text-[#1E88E5]">
          <a href="https://www.instagram.com/ieeeiesjust/" className="hover:text-white transition">IG: @ies_just</a>
          <span className="text-gray-600 italic" title="Coming soon">[LINK OFFLINE — TBD]</span>
        </div>
      </div>

      <div className="text-center text-xs text-gray-600 border-t border-[#111] pt-6 flex flex-wrap justify-center gap-2 md:gap-6">
        <span>IES_JUST // POWERED BY IEEE</span>
        <span className="hidden md:inline">|</span>
        <span>IRBID, JORDAN</span>
        <span className="hidden md:inline">|</span>
        <span>2026</span>
      </div>
    </footer>
  );
}
