'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Events() {
  const container = useRef();
  
  useGSAP(() => {
    // Select the wrapper using a ref or scoped class
    const wrapper = container.current.querySelector('.events-wrapper');
    const cards = gsap.utils.toArray('.event-card');
    
    // Entrance animation: cards rise from the bottom staggered
    gsap.from(cards, {
      y: 500, // starting from below
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%", // trigger as soon as the section starts coming into view
      }
    });
    
    // Animate the wrapper horizontally based on its width
    gsap.to(wrapper, {
      x: () => -(wrapper.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: () => `+=${wrapper.scrollWidth}`,
        pin: true,
        scrub: 1,
        pinSpacing: true,
      }
    });

  }, { scope: container });

  const events = [
    { num: '01', title: 'WORKSHOP_01', desc: 'Introduction to PLC programming and industrial automation basics.', status: 'ACTIVE' },
    { num: '02', title: 'HACKATHON_02', desc: '48-hour challenge building embedded solutions for smart factories.', status: 'UPCOMING' },
    { num: '03', title: 'RECRUITMENT_DRIVE', desc: 'Join the next generation of industrial innovators at JUST.', status: 'ACTIVE' },
    { num: '04', title: 'ROBOTICS_SEMINAR', desc: 'Advanced kinematics and machine vision concepts.', status: 'PLANNED' },
    { num: '05', title: 'SYSTEMS_EXPO', desc: 'Annual showcase of student industrial systems.', status: 'UPCOMING' },
  ];

  return (
    <section ref={container} className="relative w-full bg-[#0A0A0A] overflow-hidden z-20">
      <div className="h-screen w-full flex flex-col justify-center relative">
        
        {/* Header - Fixed to top of the pinned section */}
        <div className="flex items-center w-full gap-4 absolute top-20 left-0 px-4 md:px-14 z-30">
          <span className="material-symbols-outlined text-[#F57C00] text-3xl">terminal</span>
          <h2 className="text-[32px] md:text-[48px] leading-[110%] tracking-[0.02em] text-[#F57C00] font-display whitespace-nowrap">ACTIVE_INITIATIVES.LOG</h2>
          <div className="h-px bg-[#1E88E5]/30 w-1/3 ml-4"></div>
        </div>
        
        {/* Horizontal scroll track */}
        <div className="events-wrapper flex items-center h-full px-4 md:px-14 w-max mt-20 pt-10 gap-8">
          {events.map((ev, i) => (
            <div key={i} 
                 className={`event-card relative group flex-shrink-0 w-[80vw] md:w-[450px] h-[55vh] max-h-[500px] bg-[#0e0e0e] border-2 border-[#1E88E5] p-8 md:p-10 shadow-[0_0_30px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden transition-colors hover:border-[#F57C00]`}
            >
              {/* Background large number */}
              <div className="absolute top-4 right-4 text-[120px] md:text-[180px] font-display font-bold leading-none text-[#F57C00] opacity-20 pointer-events-none select-none drop-shadow-[0_0_15px_rgba(245,124,0,0.5)]">
                {ev.num}
              </div>
              
              <div className="relative z-10 w-3/4">
                <h3 className="font-display text-[32px] md:text-[40px] font-normal leading-[120%] text-[#F57C00] mb-4 drop-shadow-md">{ev.title}</h3>
                <p className="font-mono text-[16px] leading-[160%] text-[#dec1af] mb-8 bg-[#0A0A0A]/50 p-2 backdrop-blur-sm border border-[#1E88E5]/20">{ev.desc}</p>
              </div>
              
              <div className="font-mono text-[14px] text-[#1E88E5] mt-auto border-t-2 border-[#1E88E5]/30 pt-4 relative z-10 transition-colors group-hover:text-[#F57C00] group-hover:border-[#F57C00]/30 tracking-widest bg-[#0e0e0e]/80 p-2">
                [STATUS: {ev.status}]
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
