'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const navLinks = [
  { name: 'TERMINAL.EXE', href: '/' },
  { name: 'MODULES_', href: '/about' },
  { name: 'NET_OPS_', href: '/events' },
  { name: 'ARCHIVE_', href: '/team' },
];

export default function Navbar() {
  const containerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [isLightMode, setIsLightMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useGSAP(() => {
    gsap.to(containerRef.current, { opacity: 1, duration: 0.5, delay: 2.5 });
  }, { scope: containerRef });

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const nav = containerRef.current;
        if (!nav) return;

        if (currentScrollY < 50) {
          gsap.to(nav, { y: 0, opacity: 1, duration: 0.2 });
        } else if (currentScrollY < lastScrollY.current) {
          gsap.to(nav, { y: 0, opacity: 1, duration: 0.2 });
        } else {
          gsap.to(nav, { y: -100, opacity: 0, duration: 0.2 });
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [isLightMode]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => { document.body.style.overflow = ''; }, 350);
      return () => clearTimeout(timer);
    }
  }, [mobileOpen]);

  const togglePower = () => setIsLightMode(!isLightMode);

  return (
    <nav ref={containerRef} className="fixed top-0 left-0 w-full z-40 opacity-0 bg-[#131313]/80 backdrop-blur-xl border-b-2 border-[#F57C00] shadow-[0_0_15px_rgba(245,124,0,0.3)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
        <Link href="/" className="font-display tracking-widest text-[#F57C00] text-[18px] md:text-[32px] font-normal leading-[120%] hover:text-white transition whitespace-nowrap">
          IES JUST
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-5 font-mono text-[14px] leading-none font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "text-[#F57C00] border-b-2 border-[#F57C00] pb-1"
                  : "text-[#dec1af] hover:text-[#F57C00] transition-colors duration-200"
              }
            >
              {pathname === link.href ? '> ' : ''}{link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex gap-4 text-white">
          <span className="material-symbols-outlined hover:text-[#F57C00] transition-colors cursor-pointer" style={{ fontVariationSettings: "'FILL' 1" }}>settings_input_component</span>
          <span
            className="material-symbols-outlined hover:text-[#F57C00] transition-colors cursor-pointer"
            style={{ fontVariationSettings: "'FILL' 1" }}
            onClick={togglePower}
          >
            power_settings_new
          </span>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden text-[#F57C00] p-2"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>menu</span>
        </button>
      </div>

      {/* Mobile drawer overlay — always mounted, CSS transitions */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-[#131313] border-l-2 border-[#F57C00] shadow-[-10px_0_30px_rgba(245,124,0,0.2)] p-6 flex flex-col transition-all duration-300 ease-in-out ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <span className="font-mono text-[#F57C00] text-[14px]">NAV_CONSOLE</span>
            <button
              className="text-[#F57C00] p-1"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-4 font-mono text-[16px]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={
                  pathname === link.href
                    ? "text-[#F57C00] border-l-2 border-[#F57C00] pl-3 py-1"
                    : "text-[#dec1af] hover:text-[#F57C00] transition-colors pl-3 py-1 border-l-2 border-transparent"
                }
              >
                {pathname === link.href ? '> ' : ''}{link.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto flex gap-4 text-white pt-8 border-t border-[#1E88E5]/20">
            <span className="material-symbols-outlined hover:text-[#F57C00] transition-colors cursor-pointer" style={{ fontVariationSettings: "'FILL' 1" }}>settings_input_component</span>
            <span
              className="material-symbols-outlined hover:text-[#F57C00] transition-colors cursor-pointer"
              style={{ fontVariationSettings: "'FILL' 1" }}
              onClick={togglePower}
            >
              power_settings_new
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
