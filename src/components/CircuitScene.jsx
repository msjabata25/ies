import { useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/*
 * Scroll-driven NPN transistor schematic for the About page.
 * Each terminal routes a PCB-style trace to one of the quadrant text blocks
 * (found by `#<id>-text`), so the circuit follows the text at every screen size.
 * Base fans out to q1/q3, collector goes to q2, emitter to q4 — the same order
 * the page reveals them in.
 *
 * Driven through `ref`:
 *   setCore(p)     0–1, draws the symbol itself
 *   setSection(n)  0–4, powers the first n branches
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

/* Vertical run, 45° chamfer, horizontal run. */
function route(from, to, chamfer = 28) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const k = Math.min(chamfer, Math.abs(dx), Math.abs(dy));
  const sx = Math.sign(dx);
  const sy = Math.sign(dy);
  return `M${f(from.x)} ${f(from.y)} V${f(to.y - sy * k)} L${f(from.x + sx * k)} ${f(to.y)} H${f(to.x)}`;
}

function computeLayout(wrapper) {
  const origin = offsetRect(wrapper);
  const rects = {};
  for (const b of BRANCHES) {
    const el = document.getElementById(`${b.id}-text`);
    if (!el) return null;
    const r = offsetRect(el);
    const left = r.x - origin.x;
    const top = r.y - origin.y;
    rects[b.id] = { left, top, right: left + r.w, bottom: top + r.h };
  }

  const w = wrapper.clientWidth;
  const h = wrapper.clientHeight;
  const gapTop = Math.max(rects.q1.bottom, rects.q2.bottom);
  const gapBottom = Math.min(rects.q3.top, rects.q4.top);
  const r = clamp((gapBottom - gapTop) * 0.32, 36, Math.min(120, w * 0.14));
  const cx = w / 2;
  const cy = (gapTop + gapBottom) / 2;

  /* Standard NPN proportions, relative to the envelope radius. */
  const barX = cx - 0.3 * r;
  const legX = cx + 0.35 * r;
  const legY = 0.937 * r; // where x = legX meets the circle
  const junction = { x: cx - r - clamp(r * 0.8, 24, 80), y: cy };
  const starts = {
    base: junction,
    collector: { x: legX, y: cy - legY },
    emitter: { x: legX, y: cy + legY },
  };

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

  const branches = BRANCHES.map((b) => {
    const rect = rects[b.id];
    const pad = {
      x: b.side === 'left' ? rect.left + 6 : rect.right - 6,
      y: b.row === 'top' ? rect.bottom + 18 : rect.top - 18,
    };
    return { id: b.id, pad, d: route(starts[b.terminal], pad) };
  });

  return { w, h, cx, cy, r, junction, legX, legY, symbol, arrow, branches };
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

function powerBranches(svg, section, immediate) {
  if (!svg) return;
  BRANCHES.forEach((b, i) => {
    const g = svg.querySelector(`[data-branch="${b.id}"]`);
    if (!g) return;
    const on = i < section;
    const vars = { duration: immediate ? 0 : 0.7, ease: 'power2.inOut', overwrite: true };
    gsap.to(g.querySelectorAll('[data-trace]'), { ...vars, strokeDashoffset: on ? 0 : 1 });
    gsap.to(g.querySelectorAll('[data-lit]'), {
      ...vars,
      opacity: on ? 1 : 0,
      delay: on && !immediate ? 0.5 : 0,
    });
  });
}

export default function CircuitScene({ ref }) {
  const wrapperRef = useRef(null);
  const svgRef = useRef(null);
  const stateRef = useRef({ core: 0, section: 0 });
  const [layout, setLayout] = useState(null);

  useImperativeHandle(ref, () => ({
    setCore(p) {
      stateRef.current.core = p;
      drawCore(svgRef.current, p);
    },
    setSection(n) {
      stateRef.current.section = n;
      powerBranches(svgRef.current, n, false);
    },
  }), []);

  /* Re-route whenever the viewport or any text block changes size (incl. font load). */
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const ro = new ResizeObserver(() => setLayout(computeLayout(wrapper)));
    ro.observe(wrapper);
    BRANCHES.forEach((b) => {
      const el = document.getElementById(`${b.id}-text`);
      if (el) ro.observe(el);
    });
    return () => ro.disconnect();
  }, []);

  /* Fresh paths start undrawn — catch them up to the current scroll state. */
  useLayoutEffect(() => {
    drawCore(svgRef.current, stateRef.current.core);
    powerBranches(svgRef.current, stateRef.current.section, true);
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
              <g className="font-mono" fontSize="11" fill="#dec1af" fillOpacity="0.6">
                <text x={layout.junction.x + 8} y={layout.cy - 8}>B</text>
                <text x={layout.legX + 8} y={layout.cy - layout.legY + 4}>C</text>
                <text x={layout.legX + 8} y={layout.cy + layout.legY + 4}>E</text>
                <text x={layout.cx + layout.r + 12} y={layout.cy - 2} fill={ORANGE} fillOpacity="0.9">Q1</text>
                <text x={layout.cx + layout.r + 12} y={layout.cy + 12}>NPN</text>
              </g>
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
