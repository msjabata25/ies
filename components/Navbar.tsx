'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';

const navLinks = [
  { name: 'TERMINAL.EXE', href: '/' },
  { name: 'MODULES_', href: '/about' },
  { name: 'NET_OPS_', href: '/events' },
  { name: 'ARCHIVE_', href: '/team' },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [isLightMode, setIsLightMode] = useState(false);
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const prev = scrollYProgress.getPrevious();
      if (prev === undefined) return;
      const direction = current - prev;
      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        setVisible(direction < 0);
      }
    }
  });

  useGSAP(() => {
    gsap.to(navRef.current, { opacity: 1, duration: 0.5, delay: 2.5 });
  }, { scope: navRef });

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [isLightMode]);

  const togglePower = () => setIsLightMode(!isLightMode);

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        ref={navRef}
        initial={{ opacity: 0, y: 0 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 w-full z-40 bg-[#131313]/80 backdrop-blur-xl border-b-2 border-[#F57C00] shadow-[0_0_15px_rgba(245,124,0,0.3)]"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="font-display tracking-widest text-[#F57C00] text-[32px] font-normal leading-[120%] hover:text-white transition">
            IES JUST STUDENT CHAPTER
          </Link>

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
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}
