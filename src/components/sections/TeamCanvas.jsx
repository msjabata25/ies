import { useState, useMemo, useCallback, } from 'react';
import { initialsOf, team } from '@/data/team';
import { useI18n } from '@/i18n/context';
import { AnimatePresence, motion } from 'motion/react';
import StaticGrid from './StaticGrid';

const committees = ['All', 'Board', 'Scientific', 'Media', 'Web'];

const BUBBLE_SIZE = 88;

function committeeColor(committee) {
  switch (committee) {
    case 'Board': return '#F57C00';
    case 'Scientific': return '#1E88E5';
    case 'Media': return '#10b981';
    case 'Web': return '#8b5cf6';
    default: return '#F57C00';
  }
}

function BubbleCircle({
  member,
  size,
  className,
}) {
  const [imgError, setImgError] = useState(false);
  const color = committeeColor(member.committee);
  const { pick } = useI18n();
  const initials = initialsOf(pick(member, 'name'));

  if (member.photo && !imgError) {
    return (
      <div
        className={`rounded-full overflow-hidden flex-shrink-0 ${className ?? ''}`}
        style={{ width: size, height: size, border: `2px solid ${color}60` }}
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
        border: `2px solid ${color}60`,
        backgroundColor: '#131313',
      }}
    >
      <span className="font-mono font-bold" style={{ color, fontSize: size * 0.22 }}>
        {initials}
      </span>
    </div>
  );
}

function Bubble({ member, left, top, index, onClick }) {
  return (
    <motion.div
      layoutId={`team-bubble-${member.id}`}
      className="absolute cursor-pointer"
      style={{ left, top, width: BUBBLE_SIZE, height: BUBBLE_SIZE }}
      onClick={onClick}
      exit={{ scale: 0, opacity: 0 }}
      animate={{
        y: [0, -5, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.15,
        },
      }}
      whileHover={{ scale: 1.08 }}
    >
      <BubbleCircle member={member} size={BUBBLE_SIZE} />
    </motion.div>
  );
}

function separatePositions(positions, minDist, iterations) {
  const result = positions.map((p) => ({ ...p }));
  const minDistSq = minDist * minDist;

  for (let iter = 0; iter < iterations; iter++) {
    let moved = false;
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const dx = result[i].left - result[j].left;
        const dy = result[i].top - result[j].top;
        const distSq = dx * dx + dy * dy;
        if (distSq < minDistSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const overlap = minDist - dist;
          const nx = dx / dist;
          const ny = dy / dist;
          result[i].left += nx * overlap * 0.5;
          result[i].top += ny * overlap * 0.5;
          result[j].left -= nx * overlap * 0.5;
          result[j].top -= ny * overlap * 0.5;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  return result;
}

export default function TeamCanvas() {
  const { t, pick } = useI18n();
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRefCallback = useCallback((el) => {
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const bubblePositions = useMemo(() => {
    if (containerWidth === 0) return [];
    const cols = containerWidth < 640 ? 3 : containerWidth < 1024 ? 4 : 5;
    const spacing = Math.min((containerWidth - 40) / cols, BUBBLE_SIZE * 1.8);
    const startX = (containerWidth - spacing * cols) / 2;

    const raw = team.map((m, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const left = startX + col * spacing + (m.scatter?.tx ?? 0);
      const top = row * spacing * 0.85 + (m.scatter?.ty ?? 0) + 40;
      return { left, top };
    });

    return separatePositions(raw, BUBBLE_SIZE * 0.9, 8);
  }, [containerWidth]);

  const expandedMember = useMemo(() => {
    if (!expandedId) return null;
    return team.find((m) => m.id === expandedId) ?? null;
  }, [expandedId]);

  const handleExpand = useCallback((id) => {
    setExpandedId(id);
  }, []);

  const handleCollapse = useCallback(() => {
    setExpandedId(null);
  }, []);

  const handleFilterChange = useCallback((value) => {
    setActiveFilter(value);
    setExpandedId(null);
  }, []);

  const canvasHeight = useMemo(() => {
    if (containerWidth === 0) return 600;
    const cols = containerWidth < 640 ? 3 : containerWidth < 1024 ? 4 : 5;
    const spacing = Math.min((containerWidth - 40) / cols, BUBBLE_SIZE * 1.8);
    const rows = Math.ceil(team.length / cols);
    return rows * spacing * 0.85 + 120;
  }, [containerWidth]);

  return (
    <div
      ref={containerRefCallback}
      className="relative w-full"
      style={{ minHeight: canvasHeight }}
    >
      <div className="absolute inset-0 z-0">
        <StaticGrid />
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
                  index={i}
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
                  {t(`team.committees.${expandedMember.committee}`)} &mdash; {pick(expandedMember, 'role')}
                </span>
                <button
                  onClick={handleCollapse}
                  aria-label={t('team.close')}
                  className="text-[#dec1af] hover:text-[#F57C00] transition-colors font-mono text-[16px] leading-none"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <BubbleCircle member={expandedMember} size={64} />
                <div>
                  <h3 className="font-display text-[22px] text-[#F57C00] tracking-wider">
                    {pick(expandedMember, 'name')}
                  </h3>
                  <p className="font-mono text-[13px] text-[#dec1af] mt-1">
                    {pick(expandedMember, 'role')}
                  </p>
                  <span
                    className="inline-block font-mono text-[10px] mt-1 px-2 py-0.5 border"
                    style={{
                      color: committeeColor(expandedMember.committee),
                      borderColor: `${committeeColor(expandedMember.committee)}40`,
                    }}
                  >
                    {t(`team.committees.${expandedMember.committee}`)}
                  </span>
                </div>
              </div>

              <p className="font-mono text-[13px] text-[#dec1af] leading-[170%]">
                {pick(expandedMember, 'bio')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 z-10">
        {committees.map((c) => (
          <button
            key={c}
            onClick={() => handleFilterChange(c)}
            className={`px-4 py-1.5 rounded-full font-mono text-[11px] border transition-colors ${
              activeFilter === c
                ? 'bg-[#F57C00] text-[#0A0A0A] border-[#F57C00]'
                : 'bg-transparent text-[#dec1af] border-[#1E88E5]/30 hover:border-[#F57C00]/50'
            }`}
          >
            {t(`team.committees.${c}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
