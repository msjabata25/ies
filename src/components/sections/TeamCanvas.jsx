import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { initialsOf, team } from '@/data/team';
import { useI18n } from '@/i18n/context';
import { AnimatePresence, motion } from 'motion/react';
import StaticGrid from './StaticGrid';

const committees = ['All', 'Board', 'Scientific', 'Media', 'Web'];

const BUBBLE_SIZE = 88;

function committeeColor(committee) {
  switch (committee) {
    case 'Board': return 'var(--color-primary)';
    case 'Scientific': return 'var(--color-accent)';
    case 'Media': return 'var(--color-media)';
    case 'Web': return 'var(--color-web)';
    default: return 'var(--color-primary)';
  }
}

/* Committee colours are CSS variables, so they flip with the theme on their own; this fades one to an alpha */
const fade = (color, pct) => `color-mix(in oklab, ${color} ${pct}%, transparent)`;

function BubbleCircle({
  member,
  size,
  className,
}) {
  const [imgError, setImgError] = useState(false);
  const color = committeeColor(member.committee);
  const { pick } = useI18n();
  const name = pick(member, 'name');
  const initials = initialsOf(name);

  if (member.photo && !imgError) {
    return (
      <div
        className={`rounded-full overflow-hidden flex-shrink-0 ${className ?? ''}`}
        style={{ width: size, height: size, border: `2px solid ${fade(color, 38)}` }}
      >
        <img
          src={member.photo}
          alt={name}
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
        border: `2px solid ${fade(color, 38)}`,
        backgroundColor: 'var(--color-panel)',
      }}
    >
      <span className="font-mono font-bold" style={{ color, fontSize: size * 0.22 }}>
        {initials}
      </span>
    </div>
  );
}

function Bubble({ member, left, top, index, onClick }) {
  const { pick } = useI18n();
  return (
    <motion.button
      type="button"
      layoutId={`team-bubble-${member.id}`}
      data-member-id={member.id}
      aria-label={`${pick(member, 'name')}, ${pick(member, 'role')}`}
      className="absolute cursor-pointer p-0 border-0 bg-transparent block"
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
    </motion.button>
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
  const [filterHeight, setFilterHeight] = useState(0);
  const containerElRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastOpenedIdRef = useRef(null);
  const containerRefCallback = useCallback((el) => {
    containerElRef.current = el;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  /* The filter pills wrap on narrow screens; the canvas reserves their real height. */
  const filterRefCallback = useCallback((el) => {
    if (!el) return;
    const ro = new ResizeObserver(() => setFilterHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = useMemo(() => {
    const narrow = containerWidth < 640;
    const cols = narrow ? 3 : containerWidth < 1024 ? 4 : 5;
    const spacing = Math.min((containerWidth - 40) / cols, BUBBLE_SIZE * 1.8);
    /* On phones the 0.85 row pitch is below the bubble diameter, so rows would overlap */
    const rowPitch = narrow ? BUBBLE_SIZE + 16 : spacing * 0.85;
    return { narrow, cols, spacing, rowPitch };
  }, [containerWidth]);

  const bubblePositions = useMemo(() => {
    if (containerWidth === 0) return [];
    const { narrow, cols, spacing, rowPitch } = layout;
    const startX = (containerWidth - spacing * cols) / 2;
    const scatterScale = narrow ? 0.25 : 1;

    const raw = team.map((m, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const left = startX + col * spacing + (m.scatter?.tx ?? 0) * scatterScale;
      const top = row * rowPitch + (m.scatter?.ty ?? 0) * scatterScale + 40;
      return { left, top };
    });

    return separatePositions(raw, BUBBLE_SIZE + 8, 30);
  }, [containerWidth, layout]);

  const expandedMember = useMemo(() => {
    if (!expandedId) return null;
    return team.find((m) => m.id === expandedId) ?? null;
  }, [expandedId]);

  const handleExpand = useCallback((id) => {
    lastOpenedIdRef.current = id;
    setExpandedId(id);
  }, []);

  const handleCollapse = useCallback(() => {
    setExpandedId(null);
  }, []);

  const handleFilterChange = useCallback((value) => {
    setActiveFilter(value);
    setExpandedId(null);
  }, []);

  /* Modal: Escape closes, focus moves in and returns to the bubble, page scroll is locked. */
  const modalOpen = Boolean(expandedMember);
  useEffect(() => {
    if (!modalOpen) return;
    const html = document.documentElement;
    const prev = { overflow: html.style.overflow, gutter: html.style.scrollbarGutter };
    html.style.scrollbarGutter = 'stable'; // keep the layout from jumping when the scrollbar goes
    html.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setExpandedId(null);
      } else if (e.key === 'Tab') {
        e.preventDefault(); // the close button is the only focusable control in the dialog
        closeButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      html.style.overflow = prev.overflow;
      html.style.scrollbarGutter = prev.gutter;
      /* the bubble remounts as the dialog closes, so look it up by id rather than keep a stale node */
      const id = lastOpenedIdRef.current;
      requestAnimationFrame(() => {
        containerElRef.current?.querySelector(`[data-member-id="${id}"]`)?.focus({ preventScroll: true });
      });
    };
  }, [modalOpen]);

  const canvasHeight = useMemo(() => {
    if (containerWidth === 0) return 600;
    const { cols, rowPitch } = layout;
    const rows = Math.ceil(team.length / cols);
    /* last bubble row (incl. ~35px scatter) + 24px gap + the filter bar + its 16px bottom offset */
    const needed = 40 + (rows - 1) * rowPitch + BUBBLE_SIZE + 35 + 24 + filterHeight + 16;
    return Math.max(rows * rowPitch + 120, needed);
  }, [containerWidth, layout, filterHeight]);

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
            data-lenis-prevent
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCollapse}
          >
            <motion.div
              layoutId={`team-bubble-${expandedMember.id}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="team-modal-title"
              className="bg-card border border-primary/30 p-6 w-full max-w-md mx-4 rounded-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[11px] text-accent">
                  {t(`team.committees.${expandedMember.committee}`)} &mdash; {pick(expandedMember, 'role')}
                </span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={handleCollapse}
                  aria-label={t('team.close')}
                  className="text-body hover:text-primary transition-colors font-mono text-[16px] leading-none"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <BubbleCircle member={expandedMember} size={64} />
                <div>
                  <h3 id="team-modal-title" className="font-display text-[22px] text-primary tracking-wider">
                    {pick(expandedMember, 'name')}
                  </h3>
                  <p className="font-mono text-[13px] text-body mt-1">
                    {pick(expandedMember, 'role')}
                  </p>
                  <span
                    className="inline-block font-mono text-[10px] mt-1 px-2 py-0.5 border"
                    style={{
                      color: committeeColor(expandedMember.committee),
                      borderColor: fade(committeeColor(expandedMember.committee), 25),
                    }}
                  >
                    {t(`team.committees.${expandedMember.committee}`)}
                  </span>
                </div>
              </div>

              <p className="font-mono text-[13px] text-body leading-[170%]">
                {pick(expandedMember, 'bio')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={filterRefCallback}
        role="group"
        aria-label={t('team.title')}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 z-10 w-max max-w-full"
      >
        {committees.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={activeFilter === c}
            onClick={() => handleFilterChange(c)}
            className={`px-4 py-1.5 min-h-10 md:min-h-0 rounded-full font-mono text-[11px] border transition-colors ${
              activeFilter === c
                ? 'bg-primary text-surface border-primary'
                : 'bg-transparent text-body border-accent/30 hover:border-primary/50'
            }`}
          >
            {t(`team.committees.${c}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
