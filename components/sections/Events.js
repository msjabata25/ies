'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Events() {
  const container = useRef();
  
  useGSAP(() => {
    const cards = gsap.utils.toArray('.event-card');
    
    // Initial stacking setup
    gsap.set(cards, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      scale: (i) => 1 - (i * 0.05),
      y: (i) => i * 20,
      zIndex: (i) => cards.length - i,
      transformOrigin: 'top center'
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * cards.length}`, 
        pin: true,
        scrub: true,
        pinSpacing: true, // Forces spacing below so the next section doesn't overlap
        anticipatePin: 1
      }
    });

    cards.forEach((card, i) => {
      // Don't animate the last card off the screen
      if (i === cards.length - 1) return;

      tl.to(card, {
        yPercent: -120, // Move it up purely by its own height
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'power1.inOut'
      }, i);

      // Scale and move up the remaining cards below
      const remainingCards = cards.slice(i + 1);
      remainingCards.forEach((nextCard, j) => {
        tl.to(nextCard, {
          scale: 1 - (j * 0.05),
          y: j * 20,
          duration: 1,
          ease: 'power1.inOut'
        }, i);
      });
    });
  }, { scope: container });

  const events = [
    { title: 'WORKSHOP_01', desc: 'Introduction to PLC programming and industrial automation basics.', status: 'ACTIVE' },
    { title: 'HACKATHON_02', desc: '48-hour challenge building embedded solutions for smart factories.', status: 'UPCOMING' },
    { title: 'RECRUITMENT_DRIVE', desc: 'Join the next generation of industrial innovators at JUST.', status: 'ACTIVE' },
  ];

  return (
    <section ref={container} className="relative w-full bg-[#0A0A0A] z-20">
      <div className="h-screen w-full flex flex-col justify-center items-center max-w-7xl mx-auto px-4 md:px-14">
        
        <div className="flex items-center w-full gap-4 absolute top-20 left-0 px-4 md:px-14 z-30">
          <span className="material-symbols-outlined text-[#F57C00] text-3xl">terminal</span>
          <h2 className="text-[32px] md:text-[48px] leading-[110%] tracking-[0.02em] text-[#F57C00] font-display">ACTIVE_INITIATIVES.LOG</h2>
          <div className="h-px bg-[#1E88E5]/30 flex-grow ml-4"></div>
        </div>
        
        <div className="relative w-full h-[50vh] max-w-lg mt-24">
          {events.map((ev, i) => (
            <div key={i} className="event-card bg-[#0e0e0e] border-2 border-[#1E88E5] p-8 md:p-10 shadow-[0_0_30px_rgba(0,0,0,0.6)] flex flex-col min-h-[300px]">
              <h3 className="font-display text-[32px] font-normal leading-[120%] text-[#F57C00] mb-4">{ev.title}</h3>
              <p className="font-mono text-[16px] leading-[160%] text-[#dec1af] mb-8">{ev.desc}</p>
              <div className="font-mono text-[14px] text-[#1E88E5] mt-auto border-t-2 border-[#1E88E5]/30 pt-4">
                [STATUS: {ev.status}]
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
