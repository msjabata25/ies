'use client';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Navbar() {
  const navRef = useRef();
  const [isLightMode, setIsLightMode] = useState(false);

  useGSAP(() => {
    // Fades in after boot sequence (~2.5s)
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
    <nav ref={navRef} className="fixed top-0 left-0 w-full z-40 opacity-0 bg-[#131313]/80 backdrop-blur-xl border-b-2 border-[#F57C00] shadow-[0_0_15px_rgba(245,124,0,0.3)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <div className="font-display tracking-widest text-[#F57C00] text-[32px] font-normal leading-[120%] cursor-pointer hover:text-white transition">
          IES JUST STUDENT CHAPTER
        </div>
        
        <div className="hidden md:flex gap-5 font-ui text-[14px] leading-none font-bold">
          <a className="text-[#ffb786] border-b-2 border-[#ffb786] pb-1" href="#">TERMINAL.EXE</a>
          <a className="text-[#dec1af] hover:text-[#F57C00] transition-colors duration-200" href="#">MODULES_</a>
          <a className="text-[#dec1af] hover:text-[#F57C00] transition-colors duration-200" href="#">NET_OPS_</a>
          <a className="text-[#dec1af] hover:text-[#F57C00] transition-colors duration-200" href="#">ARCHIVE_</a>
        </div>

        <div className="hidden md:flex gap-4 text-white">
          <span className="material-symbols-outlined hover:text-[#F57C00] transition-colors cursor-pointer" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>settings_input_component</span>
          <span 
            className="material-symbols-outlined hover:text-[#F57C00] transition-colors cursor-pointer" 
            data-weight="fill" 
            style={{ fontVariationSettings: "'FILL' 1" }}
            onClick={togglePower}
          >
            power_settings_new
          </span>
        </div>
      </div>
    </nav>
  );
}
