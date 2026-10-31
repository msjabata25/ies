import { useRef, useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/i18n/context';

const navLinks = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'events', href: '/events' },
  { key: 'team', href: '/team' },
];

export default function Navbar() {
  const containerRef = useRef(null);
  const { pathname } = useLocation();
  const { t, toggleLang } = useI18n();
  const [isLightMode, setIsLightMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const scrollAccumulator = useRef(0);
  const isHidden = useRef(false);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const nav = containerRef.current;
        if (!nav) return;

        const delta = currentScrollY - lastScrollY.current;
        const isScrollingDown = delta > 0;

        /* Always visible near top */
        if (currentScrollY < 100) {
          scrollAccumulator.current = 0;
          isHidden.current = false;
          gsap.to(nav, { y: 0, opacity: 1, duration: 0.3 });
          ticking.current = false;
          lastScrollY.current = currentScrollY;
          return;
        }

        if (isScrollingDown) {
          scrollAccumulator.current = Math.min(scrollAccumulator.current + delta, 300);
          /* Hide once accumulator passes threshold */
          if (scrollAccumulator.current >= 150 && !isHidden.current) {
            isHidden.current = true;
            gsap.to(nav, { y: -100, opacity: 0, duration: 0.3 });
          }
        } else {
          /* Only re-show after meaningful upward scroll */
          if (isHidden.current && delta < -30) {
            isHidden.current = false;
            scrollAccumulator.current = 0;
            gsap.to(nav, { y: 0, opacity: 1, duration: 0.2 });
          }
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
      return () => { document.body.style.overflow = ''; };
    } else {
      const timer = setTimeout(() => { document.body.style.overflow = ''; }, 350);
      return () => clearTimeout(timer);
    }
  }, [mobileOpen]);

  /* Reset scroll + force navbar visible on route change */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    if (containerRef.current) {
      gsap.set(containerRef.current, { y: 0, opacity: 1, clearProps: 'all' });
      gsap.to(containerRef.current, { opacity: 1, duration: 0.3 });
    }
    lastScrollY.current = 0;
    ScrollTrigger.refresh();
  }, [pathname]);

  const togglePower = () => setIsLightMode(!isLightMode);

  /* Shows the language you'd switch to: "ع" on the English site, "EN" on the Arabic one */
  const langToggle = (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t('nav.switchLang')}
      title={t('nav.switchLang')}
      className="min-w-9 h-8 px-2 border border-[#F57C00]/60 text-[#F57C00] font-mono text-[14px] font-bold leading-none hover:bg-[#F57C00] hover:text-[#0A0A0A] transition-colors cursor-pointer"
    >
      {t('nav.langLabel')}
    </button>
  );

  return (
    <nav ref={containerRef} className="fixed top-0 left-0 w-full z-40 opacity-0 bg-[#131313]/80 backdrop-blur-xl border-b-2 border-[#F57C00] shadow-[0_0_15px_rgba(245,124,0,0.3)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
        <Link to="/" className="flex-shrink-0">
          <img src="/logo.png" alt="IES JUST" className="h-10 md:h-14 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-5 font-mono text-[14px] leading-none font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={
                pathname === link.href
                  ? "text-[#F57C00] border-b-2 border-[#F57C00] pb-1"
                  : "text-[#dec1af] hover:text-[#F57C00] transition-colors duration-200"
              }
            >
              {pathname === link.href ? '> ' : ''}{t(`nav.${link.key}`)}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4 text-white">
          {langToggle}
          <span
            className="material-symbols-outlined hover:text-[#F57C00] transition-colors cursor-pointer"
            style={{ fontVariationSettings: "'FILL' 1" }}
            onClick={togglePower}
            role="button"
            aria-label={t('nav.lightMode')}
          >
            power_settings_new
          </span>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden text-[#F57C00] p-2"
          onClick={() => setMobileOpen(true)}
          aria-label={t('nav.openMenu')}
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
          className={`absolute top-0 end-0 h-full w-72 bg-[#131313] border-s-2 border-[#F57C00] shadow-[-10px_0_30px_rgba(245,124,0,0.2)] p-6 flex flex-col transition-all duration-300 ease-in-out ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <span className="font-mono text-[#F57C00] text-[14px]">{t('nav.console')}</span>
            <button
              className="text-[#F57C00] p-1"
              onClick={() => setMobileOpen(false)}
              aria-label={t('nav.closeMenu')}
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-4 font-mono text-[16px]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={
                  pathname === link.href
                    ? "text-[#F57C00] border-s-2 border-[#F57C00] ps-3 py-1"
                    : "text-[#dec1af] hover:text-[#F57C00] transition-colors ps-3 py-1 border-s-2 border-transparent"
                }
              >
                {pathname === link.href ? '> ' : ''}{t(`nav.${link.key}`)}
              </Link>
            ))}
          </div>

            <div className="mt-auto flex items-center gap-4 text-white pt-8 border-t border-[#1E88E5]/20">
              {langToggle}
              <span
                className="material-symbols-outlined hover:text-[#F57C00] transition-colors cursor-pointer"
                style={{ fontVariationSettings: "'FILL' 1" }}
                onClick={togglePower}
            role="button"
            aria-label={t('nav.lightMode')}
              >
                power_settings_new
              </span>
            </div>
        </div>
      </div>
    </nav>
  );
}
