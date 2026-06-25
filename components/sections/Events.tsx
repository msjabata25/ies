'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin, ScrollTrigger);
}

export default function Events() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    const wrapper = container.current?.querySelector('.events-wrapper') as HTMLElement;
    const cards = gsap.utils.toArray('.event-card') as HTMLElement[];

    gsap.from(cards, {
      y: 500,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      }
    });

    gsap.from('.events-title', {
      text: "",
      duration: 1,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      }
    });

    if (wrapper) {
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
    }
  }, { scope: container });

  const events = [
    { num: '01', title: 'WORKSHOP_01', desc: 'Introduction to PLC programming and industrial automation basics.', status: 'ACTIVE' },
    { num: '02', title: 'HACKATHON_02', desc: '48-hour challenge building embedded solutions for smart factories.', status: 'UPCOMING' },
    { num: '03', title: 'RECRUITMENT_DRIVE', desc: 'Join the next generation of industrial innovators at JUST.', status: 'ACTIVE' },
    { num: '04', title: 'ROBOTICS_SEMINAR', desc: 'Advanced kinematics and machine vision concepts.', status: 'PLANNED' },
    { num: '05', title: 'SYSTEMS_EXPO', desc: 'Annual showcase of student industrial systems.', status: 'UPCOMING' },
  ];

  const getLedClass = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'led-active';
      case 'UPCOMING': return 'led-upcoming';
      case 'PLANNED': return 'led-planned';
      default: return 'led-planned';
    }
  };

  return (
    <section ref={container} className="relative w-full bg-surface overflow-hidden z-20">
      <div className="h-screen w-full flex flex-col justify-center relative">

        <div className="flex items-center w-full gap-4 absolute top-20 left-0 px-4 md:px-14 z-30">
          <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
          <h2 className="text-[32px] md:text-[48px] leading-[110%] tracking-[0.02em] text-primary font-display whitespace-nowrap">
            <span className="events-title">ACTIVE_INITIATIVES.LOG</span><span className="cursor-blink font-mono">_</span>
          </h2>
          <div className="h-px bg-accent/30 w-1/3 ml-4"></div>
        </div>

        <div className="events-wrapper flex items-center h-full px-4 md:px-14 w-max mt-20 pt-10 gap-8">
          {events.map((ev, i) => (
            <div key={i}
                 className={`event-card relative group flex-shrink-0 w-[80vw] md:w-[450px] h-[55vh] max-h-[500px] bg-card border-2 border-accent p-8 md:p-10 shadow-[0_0_30px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden transition-colors hover:border-primary`}
            >
              <div className="absolute top-4 right-4 text-[120px] md:text-[180px] font-display font-bold leading-none text-primary opacity-20 pointer-events-none select-none drop-shadow-[0_0_15px_rgba(245,124,0,0.5)]">
                {ev.num}
              </div>

              <div className="relative z-10 w-3/4">
                <h3 className="font-display text-[32px] md:text-[40px] font-normal leading-[120%] text-primary mb-4 drop-shadow-md">{ev.title}</h3>
                <p className="font-mono text-[16px] leading-[160%] text-body mb-8 bg-surface/50 p-2 backdrop-blur-sm border border-accent/20">{ev.desc}</p>
              </div>

              <div className="font-mono text-[14px] text-accent mt-auto border-t-2 border-accent/30 pt-4 relative z-10 transition-colors group-hover:text-primary group-hover:border-primary/30 tracking-widest bg-card/80 p-2 flex items-center gap-2">
                [STATUS: <span className={`w-2 h-2 rounded-full inline-block ${getLedClass(ev.status)}`}></span> {ev.status}]
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
