'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { team, type Committee, type TeamMember } from '@/data/team';
import { AnimatePresence, motion } from 'motion/react';
import AnimatedGrid from './AnimatedGrid';

const committees: { label: string; value: Committee | 'All' }[] = [
  { label: 'ALL', value: 'All' },
  { label: 'BOARD', value: 'Board' },
  { label: 'SCIENTIFIC', value: 'Scientific' },
  { label: 'MEDIA', value: 'Media' },
  { label: 'WEB', value: 'Web' },
];

const BUBBLE_SIZE = 88;

function committeeColor(committee: string) {
  switch (committee) {
    case 'Board': return '#F57C00';
    case 'Scientific': return '#1E88E5';
    case 'Media': return '#10b981';
    case 'Web': return '#8b5cf6';
    default: return '#F57C00';
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function BubbleCircle({
  member,
  size,
  className,
}: {
  member: TeamMember;
  size: number;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const color = committeeColor(member.committee);
  const initials = getInitials(member.name);

  if (member.photo && !imgError) {
    return (
      <div
        className={`rounded-full overflow-hidden flex-shrink-0 ${className ?? ''}`}
        style={{ width: size, height: size, borderColor: `${color}60}`, borderWidth: 2 }}
      >
        <img
          src={member.photo}
          alt={member.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center flex-shrink-0 ${className ?? ''}`}
      style={{
        width: size,
        height: size,
        borderColor: `${color}60`,
        borderWidth: 2,
        backgroundColor: '#131313',
      }}
    >
      <span className="font-mono font-bold" style={{ color, fontSize: size * 0.22 }}>
        {initials}
      </span>
    </div>
  );
}

interface BubbleProps {
  member: TeamMember;
  left: number;
  top: number;
  onClick: () => void;
}

function Bubble({ member, left, top, onClick }: BubbleProps) {
  return (
    <motion.div
      layoutId={`team-bubble-${member.id}`}
      className="absolute cursor-pointer"
      style={{ left, top, width: BUBBLE_SIZE, height: BUBBLE_SIZE }}
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
    >
      <BubbleCircle member={member} size={BUBBLE_SIZE} />
    </motion.div>
  );
}

export default function TeamCanvas() {
  const [activeFilter, setActiveFilter] = useState<Committee | 'All'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const bubblePositions = useMemo(() => {
    if (containerWidth === 0) return [];
    const cols = containerWidth < 640 ? 3 : containerWidth < 1024 ? 4 : 5;
    const spacing = Math.min((containerWidth - 40) / cols, BUBBLE_SIZE * 1.6);
    const startX = (containerWidth - spacing * cols) / 2;

    return team.map((m, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const left = startX + col * spacing + (m.scatter?.tx ?? 0);
      const top = row * spacing * 0.85 + (m.scatter?.ty ?? 0) + 40;
      return { left, top };
    });
  }, [containerWidth]);

  const expandedMember = useMemo(() => {
    if (!expandedId) return null;
    return team.find((m) => m.id === expandedId) ?? null;
  }, [expandedId]);

  const handleExpand = useCallback((id: string) => {
    setExpandedId(id);
  }, []);

  const handleCollapse = useCallback(() => {
    setExpandedId(null);
  }, []);

  const handleFilterChange = useCallback((value: Committee | 'All') => {
    setActiveFilter(value);
    setExpandedId(null);
  }, []);

  const canvasHeight = useMemo(() => {
    if (containerWidth === 0) return 600;
    const cols = containerWidth < 640 ? 3 : containerWidth < 1024 ? 4 : 5;
    const spacing = Math.min((containerWidth - 40) / cols, BUBBLE_SIZE * 1.6);
    const rows = Math.ceil(team.length / cols);
    return rows * spacing * 0.85 + 120;
  }, [containerWidth]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ minHeight: canvasHeight }}
    >
      <div className="absolute inset-0 z-0">
        <AnimatedGrid width={containerWidth} height={canvasHeight} />
      </div>

      <div className="absolute inset-0 z-[1]">
        {bubblePositions.length > 0 && team.map((member, i) => {
          const pos = bubblePositions[i];
          if (!pos) return null;
          const visible = activeFilter === 'All' || member.committee === activeFilter;
          return (
            <AnimatePresence key={member.id}>
              {visible && expandedId !== member.id && (
                <Bubble
                  member={member}
                  left={pos.left}
                  top={pos.top}
                  onClick={() => handleExpand(member.id)}
                />
              )}
            </AnimatePresence>
          );
        })}
      </div>

      <AnimatePresence>
        {expandedMember && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCollapse}
          >
            <motion.div
              layoutId={`team-bubble-${expandedMember.id}`}
              className="bg-[#0e0e0e] border border-[#F57C00]/30 p-6 w-full max-w-md mx-4 rounded-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[11px] text-[#1E88E5]">
                  {expandedMember.committee.toUpperCase()} &mdash; {expandedMember.role}
                </span>
                <button
                  onClick={handleCollapse}
                  className="text-[#dec1af] hover:text-[#F57C00] transition-colors font-mono text-[16px] leading-none"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <BubbleCircle member={expandedMember} size={64} />
                <div>
                  <h3 className="font-display text-[22px] text-[#F57C00] tracking-wider">
                    {expandedMember.name}
                  </h3>
                  <p className="font-mono text-[13px] text-[#dec1af] mt-1">
                    {expandedMember.role}
                  </p>
                  <span
                    className="inline-block font-mono text-[10px] mt-1 px-2 py-0.5 border"
                    style={{
                      color: committeeColor(expandedMember.committee),
                      borderColor: `${committeeColor(expandedMember.committee)}40`,
                    }}
                  >
                    {expandedMember.committee.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="font-mono text-[13px] text-[#dec1af] leading-[170%]">
                {expandedMember.bio}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 z-10">
        {committees.map((c) => (
          <button
            key={c.value}
            onClick={() => handleFilterChange(c.value)}
            className={`px-4 py-1.5 rounded-full font-mono text-[11px] border transition-colors ${
              activeFilter === c.value
                ? 'bg-[#F57C00] text-[#0A0A0A] border-[#F57C00]'
                : 'bg-transparent text-[#dec1af] border-[#1E88E5]/30 hover:border-[#F57C00]/50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
