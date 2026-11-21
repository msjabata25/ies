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

const LIGHT_KEY = 'ies-light';

export default function Navbar() {
  const containerRef = useRef(null);
  const { pathname: rawPath } = useLocation();
  /* "/about/" should light up the About link too */
  const pathname = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath;
  const { t, toggleLang } = useI18n();
  /* The class is put on <html> by the inline script in index.html before first paint, so read it back from there */
  const [isLightMode, setIsLightMode] = useState(() => document.documentElement.classList.contains('light-mode'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const closeRef = useRef(null);
  const drawerRef = useRef(null);
  const wasOpen = useRef(false);
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
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isLightMode ? '#F7F5F0' : '#0A0A0A');
    try {
      localStorage.setItem(LIGHT_KEY, isLightMode ? '1' : '0');
    } catch {
      /* storage blocked — light mode just won't persist */
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

  /* The drawer is display:none from md up — close it when the viewport crosses that breakpoint,
     otherwise the body scroll lock would stay on with nothing visible */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e) => { if (e.matches) setMobileOpen(false); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* Drawer a11y: focus moves in on open and back to the hamburger on close; Escape closes; Tab stays inside */
  useEffect(() => {
    if (!mobileOpen) {
      if (wasOpen.current) hamburgerRef.current?.focus({ preventScroll: true });
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = drawerRef.current?.querySelectorAll('a[href], button');
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
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

  const fadeTimer = useRef(0);
  const togglePower = () => {
    /* brief colour fade while the theme flips (see .theme-fade in index.css) */
    const root = document.documentElement;
    root.classList.add('theme-fade');
    clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => root.classList.remove('theme-fade'), 450);
    setIsLightMode(!isLightMode);
  };

  /* Shows the language you'd switch to: "ع" on the English site, "EN" on the Arabic one */
  const langToggle = (height) => (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t('nav.switchLang')}
      title={t('nav.switchLang')}
      className={`min-w-9 ${height} px-2 border border-primary/60 text-primary font-mono text-[14px] font-bold leading-none hover:bg-primary hover:text-surface transition-colors cursor-pointer`}
    >
      {t('nav.langLabel')}
    </button>
  );

  /* `size` pads the drawer copy up to a 44px touch target; the icon itself stays the same size */
  const powerToggle = (size = '') => (
    <button
      type="button"
      onClick={togglePower}
      aria-label={t('nav.lightMode')}
      aria-pressed={isLightMode}
      className={`inline-flex items-center justify-center hover:text-primary transition-colors cursor-pointer ${size}`}
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
        power_settings_new
      </span>
    </button>
  );

  return (
    <>
    <nav ref={containerRef} className="fixed top-0 left-0 w-full z-40 opacity-0 bg-panel/80 backdrop-blur-xl border-b-2 border-primary shadow-[0_0_15px_color-mix(in_oklab,var(--color-primary)_30%,transparent)]">
      <div className="max-w-7xl mx-auto px-4 md:px-14 h-16 flex justify-between items-center">
        <Link to="/" className="flex-shrink-0">
          <img src="/logo-nav.png" alt="IES JUST" width="168" height="168" className="h-10 md:h-14 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-5 font-mono text-[14px] leading-none font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={
                pathname === link.href
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-body hover:text-primary transition-colors duration-200"
              }
            >
              {pathname === link.href ? '> ' : ''}{t(`nav.${link.key}`)}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4 text-fg">
          {langToggle('h-8')}
          {powerToggle()}
        </div>

        {/* Hamburger — mobile only */}
        <button
          ref={hamburgerRef}
          className="md:hidden text-primary p-2"
          onClick={() => setMobileOpen(true)}
          aria-label={t('nav.openMenu')}
          aria-expanded={mobileOpen}
          aria-controls="mobile-drawer"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>menu</span>
        </button>
      </div>
    </nav>

      {/* Mobile drawer overlay — always mounted, CSS transitions. It lives outside <nav> on purpose:
          the nav's backdrop-blur makes it the containing block for fixed children, which squeezed
          the drawer into the 64px bar. */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        inert={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          id="mobile-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.console')}
          className={`absolute top-0 end-0 h-full w-72 bg-panel border-s-2 border-primary p-6 flex flex-col transition-all duration-300 ease-in-out ${
            /* the glow only exists while open — otherwise it bleeds in from the off-screen drawer as an edge glow */
            mobileOpen
              ? 'translate-x-0 shadow-[-10px_0_30px_color-mix(in_oklab,var(--color-primary)_20%,transparent)] rtl:shadow-[10px_0_30px_color-mix(in_oklab,var(--color-primary)_20%,transparent)]'
              : 'translate-x-full rtl:-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <span className="font-mono text-primary text-[14px]">{t('nav.console')}</span>
            <button
              ref={closeRef}
              className="text-primary p-2.5 -m-2.5"
              onClick={() => setMobileOpen(false)}
              aria-label={t('nav.closeMenu')}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-2xl">close</span>
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
                    ? "text-primary border-s-2 border-primary ps-3 py-1"
                    : "text-body hover:text-primary transition-colors ps-3 py-1 border-s-2 border-transparent"
                }
              >
                {pathname === link.href ? '> ' : ''}{t(`nav.${link.key}`)}
              </Link>
            ))}
          </div>

            <div className="mt-auto flex items-center gap-4 text-fg pt-8 border-t border-accent/20">
              {langToggle('h-11')}
              {powerToggle('min-w-11 min-h-11')}
            </div>
        </div>
      </div>
    </>
  );
}
