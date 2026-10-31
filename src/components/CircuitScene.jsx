import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/*
 * Scroll-driven NPN transistor schematic for the About page.
 * Each terminal routes a PCB-style trace to one of the quadrant text blocks
 * (found by `#<id>-text`), so the circuit follows the text at every screen size.
 * Base fans out to q1/q3, collector goes to q2, emitter to q4 — the same order
 * the page reveals them in.
 *
 * Driven through `ref`:
 * With `mirror` (Arabic/RTL, where the quadrants swap sides) the circuit is laid
 * out in mirrored coordinates and flipped back with a transform, so base still
 * faces q1/q3; the B/C/E labels are placed separately so they stay readable.
 *
 *   setCore(p)            0–1, draws the symbol itself
 *   setBranches([p, …])   0–1 per branch, in BRANCHES order
 */
const BRANCHES = [
  { id: 'q1', terminal: 'base', side: 'left', row: 'top' },
  { id: 'q3', terminal: 'base', side: 'left', row: 'bottom' },
  { id: 'q2', terminal: 'collector', side: 'right', row: 'top' },
  { id: 'q4', terminal: 'emitter', side: 'right', row: 'bottom' },
];

const ORANGE = '#F57C00';
const BLUE = '#1E88E5';
const PULSE_SECONDS = 2.4;

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const f = (n) => Math.round(n * 10) / 10;

/* Layout position ignoring transforms (the text blocks slide in with translateY). */
function offsetRect(el) {
  let x = 0;
  let y = 0;
  for (let n = el; n; n = n.offsetParent) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/* Polyline through `points` with each corner cut at 45° (PCB style). */
function trace(points, chamfer = 28) {
  const pts = points.filter((p, i) => i === 0 || Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y) > 0.5);
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [a, b, c] = [pts[i - 1], pts[i], pts[i + 1]];
    const l1 = Math.hypot(b.x - a.x, b.y - a.y);
    const l2 = Math.hypot(c.x - b.x, c.y - b.y);
    const k = Math.min(chamfer, l1 / 2, l2 / 2);
    d += ` L${f(b.x - ((b.x - a.x) / l1) * k)} ${f(b.y - ((b.y - a.y) / l1) * k)}`;
    d += ` L${f(b.x + ((c.x - b.x) / l2) * k)} ${f(b.y + ((c.y - b.y) / l2) * k)}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L${f(last.x)} ${f(last.y)}`;
}

/*
 * Collector/emitter leave the device outward (dir -1 = up, +1 = down). When the
 * pad isn't far enough that way — short screens, where text sits level with the
 * symbol — step sideways at `detourX` instead of doubling back through it.
 */
function legPoints(start, pad, dir, detourX) {
  const stub = 14;
  if ((pad.y - start.y) * dir >= stub) return [start, { x: start.x, y: pad.y }, pad];
  const y = start.y + dir * stub;
  return [start, { x: start.x, y }, { x: detourX, y }, { x: detourX, y: pad.y }, pad];
}

const overlaps = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

function computeLayout(wrapper, mirror) {
  const origin = offsetRect(wrapper);
  const w = wrapper.clientWidth;
  const h = wrapper.clientHeight;
  const rects = {};
  for (const b of BRANCHES) {
    const el = document.getElementById(`${b.id}-text`);
    if (!el) return null;
    const r = offsetRect(el);
    const left = r.x - origin.x;
    const top = r.y - origin.y;
    rects[b.id] = mirror
      ? { left: w - left - r.w, top, right: w - left, bottom: top + r.h }
      : { left, top, right: left + r.w, bottom: top + r.h };
  }

  /* Free space between the text: a horizontal band (tall screens) and/or a
     vertical gutter (wide, short screens). Size the symbol to whichever is roomier. */
  const gapTop = Math.max(rects.q1.bottom, rects.q2.bottom);
  const gapBottom = Math.min(rects.q3.top, rects.q4.top);
  const gutterLeft = Math.max(rects.q1.right, rects.q3.right);
  const gutterRight = Math.min(rects.q2.left, rects.q4.left);
  const room = Math.max((gapBottom - gapTop) * 0.32, (gutterRight - gutterLeft) * 0.4);
  const r = clamp(room, 28, Math.min(120, w * 0.14, h * 0.14));
  const cx = w / 2;
  const cy = (gapTop + gapBottom) / 2;

  /* Standard NPN proportions, relative to the envelope radius. */
  const barX = cx - 0.3 * r;
  const legX = cx + 0.35 * r;
  const legY = 0.937 * r; // where x = legX meets the circle
  const junction = { x: cx - r - clamp(r * 0.8, 24, 80), y: cy };
  const collector = { x: legX, y: cy - legY };
  const emitter = { x: legX, y: cy + legY };
  const detourX = gutterRight > cx + r ? clamp(cx + r + 16, legX + 20, gutterRight - 10) : cx + r + 16;

  const symbol = [
    { key: 'base', d: `M${f(junction.x)} ${f(cy)} H${f(barX)}`, width: 2 },
    { key: 'bar', d: `M${f(barX)} ${f(cy - 0.5 * r)} V${f(cy + 0.5 * r)}`, width: 4 },
    { key: 'collector', d: `M${f(barX)} ${f(cy - 0.22 * r)} L${f(legX)} ${f(cy - 0.6 * r)} V${f(cy - legY)}`, width: 2 },
    { key: 'emitter', d: `M${f(barX)} ${f(cy + 0.22 * r)} L${f(legX)} ${f(cy + 0.6 * r)} V${f(cy + legY)}`, width: 2 },
  ];

  /* Emitter arrow, pointing out of the device. */
  const ux = legX - barX;
  const uy = 0.38 * r;
  const len = Math.hypot(ux, uy);
  const u = { x: ux / len, y: uy / len };
  const tip = { x: barX + ux * 0.85, y: cy + 0.22 * r + uy * 0.85 };
  const a = 0.2 * r;
  const back = { x: tip.x - u.x * a, y: tip.y - u.y * a };
  const arrow = [
    tip,
    { x: back.x - u.y * a * 0.55, y: back.y + u.x * a * 0.55 },
    { x: back.x + u.y * a * 0.55, y: back.y - u.x * a * 0.55 },
  ].map((p) => `${f(p.x)},${f(p.y)}`).join(' ');

  const runs = [];
  const branches = BRANCHES.map((b) => {
    const rect = rects[b.id];
    const pad = {
      x: b.side === 'left' ? rect.left + 6 : rect.right - 6,
      y: b.row === 'top' ? rect.bottom + 18 : rect.top - 18,
    };
    const points =
      b.terminal === 'base' ? [junction, { x: junction.x, y: pad.y }, pad]
        : b.terminal === 'collector' ? legPoints(collector, pad, -1, detourX)
          : legPoints(emitter, pad, 1, detourX);
    if (points.length > 3) runs.push({ left: detourX - 4, right: detourX + 4, top: -Infinity, bottom: Infinity });
    return { id: b.id, pad, d: trace(points) };
  });

  /* The Q1/NPN tag only shows where it won't sit on text or a detour run. */
  const tag = { left: cx + r + 8, right: cx + r + 48, top: cy - 14, bottom: cy + 16 };
  const showTag = tag.right < w && ![...Object.values(rects), ...runs].some((box) => overlaps(tag, box));

  return { w, h, mirror, cx, cy, r, junction, legX, legY, symbol, arrow, branches, showTag };
}

function drawCore(svg, core) {
  if (!svg) return;
  svg.querySelectorAll('[data-core]').forEach((el) => {
    el.style.strokeDashoffset = String(1 - core);
  });
  svg.querySelectorAll('[data-core-fade]').forEach((el) => {
    el.style.opacity = String(core);
  });
}

/* Traces follow scroll directly (eased in and out); pads and pulses switch on
   once a trace reaches its pad. `lit` remembers that state between calls. */
function drawBranches(svg, progress, lit, immediate) {
  if (!svg) return;
  BRANCHES.forEach((b, i) => {
    const g = svg.querySelector(`[data-branch="${b.id}"]`);
    if (!g) return;
    const p = progress[i];
    const eased = 0.5 - Math.cos(p * Math.PI) / 2;
    g.querySelectorAll('[data-trace]').forEach((el) => {
      el.style.strokeDashoffset = String(1 - eased);
    });

    const on = p >= 1;
    if (!immediate && lit[i] === on) return;
    lit[i] = on;
    gsap.to(g.querySelectorAll('[data-lit]'), {
      opacity: on ? 1 : 0,
      duration: immediate ? 0 : 0.4,
      ease: 'power2.out',
      overwrite: true,
    });
  });
}

export default function CircuitScene({ ref, mirror = false }) {
  const wrapperRef = useRef(null);
  const mirrorRef = useRef(mirror);
  const svgRef = useRef(null);
  const stateRef = useRef({ core: 0, branches: BRANCHES.map(() => 0), lit: BRANCHES.map(() => false) });
  const [layout, setLayout] = useState(null);

  useImperativeHandle(ref, () => ({
    setCore(p) {
      stateRef.current.core = p;
      drawCore(svgRef.current, p);
    },
    setBranches(progress) {
      stateRef.current.branches = progress;
      drawBranches(svgRef.current, progress, stateRef.current.lit, false);
    },
  }), []);

  /* Re-route whenever the viewport or any text block changes size (incl. font load). */
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const ro = new ResizeObserver(() => setLayout(computeLayout(wrapper, mirrorRef.current)));
    ro.observe(wrapper);
    BRANCHES.forEach((b) => {
      const el = document.getElementById(`${b.id}-text`);
      if (el) ro.observe(el);
    });
    return () => ro.disconnect();
  }, []);

  /* Switching direction moves the text blocks without always resizing them, so re-route explicitly */
  useEffect(() => {
    mirrorRef.current = mirror;
    const id = requestAnimationFrame(() => setLayout(computeLayout(wrapperRef.current, mirror)));
    return () => cancelAnimationFrame(id);
  }, [mirror]);

  /* Fresh paths start undrawn — catch them up to the current scroll state. */
  useLayoutEffect(() => {
    drawCore(svgRef.current, stateRef.current.core);
    drawBranches(svgRef.current, stateRef.current.branches, stateRef.current.lit, true);
  }, [layout]);

  return (
    <div ref={wrapperRef} className="absolute inset-0">
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        viewBox={layout ? `0 0 ${layout.w} ${layout.h}` : undefined}
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="circuit-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#ffffff" fillOpacity="0.05" />
          </pattern>
          <radialGradient id="circuit-glow">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.22" />
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-grid)" />

        {layout && (
          <>
          <g transform={layout.mirror ? `matrix(-1 0 0 1 ${layout.w} 0)` : undefined}>
            {/* Unpowered ghost of the whole circuit */}
            <g stroke={BLUE} strokeOpacity="0.14" strokeWidth="1.5" strokeLinejoin="round">
              {layout.branches.map((b) => (
                <path key={b.id} d={b.d} />
              ))}
            </g>

            {layout.branches.map((b) => (
              <g key={b.id} data-branch={b.id} stroke={ORANGE} strokeLinejoin="round">
                <path data-trace d={b.d} pathLength="1" strokeDasharray="1" strokeDashoffset="1" strokeOpacity="0.25" strokeWidth="6" />
                <path data-trace d={b.d} pathLength="1" strokeDasharray="1" strokeDashoffset="1" strokeWidth="1.75" />
                <circle cx={b.pad.x} cy={b.pad.y} r="4.5" stroke={BLUE} strokeOpacity="0.4" strokeWidth="1.5" fill="#0A0A0A" />
                <circle data-lit opacity="0" cx={b.pad.x} cy={b.pad.y} r="4.5" stroke="none" fill={ORANGE} />
                <g data-lit opacity="0" stroke="none" className="motion-reduce:hidden">
                  {[0, 0.5].map((phase) => (
                    <g key={phase}>
                      <circle r="7" fill={ORANGE} fillOpacity="0.25" />
                      <circle r="2.25" fill="#FFE0C0" />
                      <animateMotion
                        dur={`${PULSE_SECONDS}s`}
                        begin={`${-phase * PULSE_SECONDS}s`}
                        repeatCount="indefinite"
                        path={b.d}
                      />
                    </g>
                  ))}
                </g>
              </g>
            ))}

            {/* The transistor itself */}
            <circle data-core-fade opacity="0" cx={layout.cx} cy={layout.cy} r={layout.r * 2} fill="url(#circuit-glow)" />
            <g stroke={ORANGE} strokeLinejoin="round">
              <circle data-core cx={layout.cx} cy={layout.cy} r={layout.r} pathLength="1" strokeDasharray="1" strokeDashoffset="1" strokeWidth="2" fill="#0A0A0A" fillOpacity="0.6" />
              {layout.symbol.map((s) => (
                <path key={s.key} data-core d={s.d} pathLength="1" strokeDasharray="1" strokeDashoffset="1" strokeWidth={s.width} />
              ))}
            </g>
            <g data-core-fade opacity="0">
              <polygon points={layout.arrow} fill={ORANGE} />
              <circle cx={layout.junction.x} cy={layout.junction.y} r="4" fill={ORANGE} />
            </g>
          </g>

          {/* Labels sit outside the mirror transform so the letters never read backwards */}
          <g
            data-core-fade
            opacity="0"
            className="font-mono"
            fontSize="11"
            fill="#dec1af"
            fillOpacity="0.6"
            direction="ltr"
            textAnchor={layout.mirror ? 'end' : 'start'}
          >
            {(() => {
              const x = (v) => (layout.mirror ? layout.w - v : v);
              return (
                <>
                  <text x={x(layout.junction.x + 8)} y={layout.cy - 8}>B</text>
                  <text x={x(layout.legX + 8)} y={layout.cy - layout.legY + 4}>C</text>
                  <text x={x(layout.legX + 8)} y={layout.cy + layout.legY + 4}>E</text>
                  {layout.showTag && (
                    <>
                      <text x={x(layout.cx + layout.r + 12)} y={layout.cy - 2} fill={ORANGE} fillOpacity="0.9">Q1</text>
                      <text x={x(layout.cx + layout.r + 12)} y={layout.cy + 12}>NPN</text>
                    </>
                  )}
                </>
              );
            })()}
          </g>
          </>
        )}
      </svg>
    </div>
  );
}
