'use client';

import { useState, useRef, useEffect } from 'react';
import { team, type Committee, type TeamMember } from '@/data/team';
import { BlurFade } from '@/components/ui/blur-fade';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import {
  CardContainer,
  CardBody,
  CardItem,
} from '@/components/ui/3d-card';
import { AnimatePresence, motion } from 'motion/react';

const committees: { label: string; value: Committee | 'All' }[] = [
  { label: '[ALL]', value: 'All' },
  { label: '[BOARD]', value: 'Board' },
  { label: '[SCIENTIFIC]', value: 'Scientific' },
  { label: '[MEDIA]', value: 'Media' },
  { label: '[WEB]', value: 'Web' },
];

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative w-16 h-16 mx-auto mb-3">
      <GlowingEffect
        glow
        variant="default"
        blur={8}
        spread={30}
        borderWidth={1}
        disabled={false}
        className="rounded-full"
      />
      <div className="w-full h-full rounded-full bg-nav border border-primary/30 flex items-center justify-center">
        <span className="font-mono text-primary text-[18px] font-bold">{initials}</span>
      </div>
    </div>
  );
}

function MemberCard({ member, dimmed }: { member: TeamMember; dimmed: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className={`transition-opacity duration-300 ${dimmed ? 'opacity-20' : 'opacity-100'}`}
      style={{
        transform: `rotate(${member.scatter.rotate}deg) translate(${member.scatter.tx}px, ${member.scatter.ty}px)`,
      }}
    >
      <CardContainer containerClassName="py-0" className="!py-0">
        <CardBody className="bg-card border border-accent/20 hover:border-primary/40 w-[180px] p-4 rounded-sm transition-colors cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <CardItem translateZ={20}>
            <InitialsAvatar name={member.name} />
          </CardItem>
          <CardItem translateZ={30} className="text-center">
            <p className="font-display text-[16px] text-primary tracking-wider leading-tight">{member.name}</p>
            <p className="font-mono text-[11px] text-accent mt-1">{member.role}</p>
          </CardItem>
          <CardItem translateZ={10} className="text-center mt-2">
            <span className="font-mono text-[10px] text-gray-500 border border-gray-700 px-2 py-0.5">
              {member.committee.toUpperCase()}
            </span>
          </CardItem>
        </CardBody>
      </CardContainer>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-primary/30 p-4 mt-2 w-[180px]"
            style={{
              transform: `rotate(${member.scatter.rotate}deg) translate(${member.scatter.tx}px, ${member.scatter.ty}px)`,
            }}
          >
            <p className="font-mono text-[12px] text-body leading-[160%]">{member.bio}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TeamPage() {
  const [activeFilter, setActiveFilter] = useState<Committee | 'All'>('All');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTeam = team;

  return (
    <main className="flex min-h-screen flex-col pt-24">
      <section className="px-4 md:px-14 max-w-7xl mx-auto w-full py-12">
        <BlurFade inView delay={0.1}>
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">group</span>
            <h1 className="text-[48px] leading-[110%] tracking-[0.02em] text-primary font-display">
              DIRECTORY.LOG<span className="cursor-blink font-mono">_</span>
            </h1>
            <div className="h-px bg-accent/30 flex-grow ml-4"></div>
          </div>
          <p className="font-mono text-[14px] text-accent ml-14">{`> ${team.length} members registered across 4 committees`}</p>
        </BlurFade>

        {/* Filter Bar */}
        <BlurFade inView delay={0.2}>
          <div className="flex flex-wrap gap-3 my-8">
            {committees.map((c) => (
              <InteractiveHoverButton
                key={c.value}
                onClick={() => setActiveFilter(c.value)}
                className={`text-[12px] font-mono px-4 py-2 ${
                  activeFilter === c.value
                    ? 'bg-primary text-surface border-primary'
                    : 'bg-transparent text-body border-accent/30'
                }`}
              >
                {c.label}
              </InteractiveHoverButton>
            ))}
          </div>
        </BlurFade>

        {/* Team Grid */}
        <div
          ref={containerRef}
          className="relative min-h-[1200px] w-full mt-8 flex flex-wrap justify-center gap-4 p-4"
        >
          {filteredTeam.map((member, i) => (
            <BlurFade key={member.id} inView delay={i * 0.02}>
              <MemberCard
                member={member}
                dimmed={activeFilter !== 'All' && member.committee !== activeFilter}
              />
            </BlurFade>
          ))}
        </div>
      </section>
    </main>
  );
}
