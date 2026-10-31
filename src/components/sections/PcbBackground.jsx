import { useEffect, useRef } from 'react';

/*
 * Faint procedural PCB traces behind the hero, on a plain 2D canvas.
 * Traces near the cursor light up orange and pulses run outward along them —
 * the same look as the About page circuit. On touch screens the light wanders
 * on its own; with reduced motion it's a single static frame.
 *
 * The loop only runs while the canvas is on screen, the tab is visible and
 * something is still moving, so an idle hero costs nothing.
 */
const CELL = 26;
const RADIUS = 210;
const LEVELS = 5; // brightness buckets, so each frame is a handful of strokes
const MAX_PULSES = 28;
const PULSE_SPEED = 9; // cells per second
const ORANGE = '245,124,0';
const BLUE = '30,136,229';

/* 8 directions, clockwise from east; odd indexes are the 45° diagonals. */
const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

function seeded(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Random walkers on a grid. Turns are made as two 45° steps, so corners come out chamfered. */
function generate(w, h) {
  const rand = seeded(2023);
  const cols = Math.ceil(w / CELL) + 1;
  const rows = Math.ceil(h / CELL) + 1;
  const used = new Uint8Array(cols * rows);
  const traces = [];

  for (let n = Math.floor((cols * rows) / 5); n > 0; n--) {
    let x = Math.floor(rand() * cols);
    let y = Math.floor(rand() * rows);
    if (used[y * cols + x]) continue;
    let d = Math.floor(rand() * 4) * 2;
    let turn = 0; // mid-turn rotation still to apply (+1/-1), 0 when straight
    let straight = 0;
    const cells = [[x, y]];
    used[y * cols + x] = 1;

    for (let len = 4 + Math.floor(rand() * 16); len > 0; len--) {
      if (turn) {
        d = (d + turn + 8) % 8;
        turn = 0;
        straight = 0;
      } else if (straight >= 3 && rand() < 0.28) {
        turn = rand() < 0.5 ? 1 : -1;
        d = (d + turn + 8) % 8;
      }
      const nx = x + DIRS[d][0];
      const ny = y + DIRS[d][1];
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || used[ny * cols + nx]) break;
      x = nx;
      y = ny;
      used[y * cols + x] = 1;
      cells.push([x, y]);
      straight++;
    }

    if (cells.length >= 4) traces.push(cells.map(([cx, cy]) => ({ x: cx * CELL + CELL / 2, y: cy * CELL + CELL / 2 })));
  }

  const segments = [];
  const pads = [];
  traces.forEach((pts, t) => {
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      segments.push({ a, b, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, t, i });
    }
    pads.push(pts[0], pts[pts.length - 1]);
  });
  return { traces, segments, pads };
}

function drawStatic(canvas, board, w, h, dpr) {
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineJoin = 'round';
  ctx.strokeStyle = `rgba(${BLUE},0.13)`;
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  board.traces.forEach((pts) => {
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  });
  ctx.stroke();

  ctx.fillStyle = '#0A0A0A';
  ctx.strokeStyle = `rgba(${BLUE},0.22)`;
  ctx.beginPath();
  board.pads.forEach((p) => {
    ctx.moveTo(p.x + 3, p.y);
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
  });
  ctx.fill();
  ctx.stroke();
}

function pointAt(pts, pos) {
  const i = Math.max(0, Math.min(pts.length - 2, Math.floor(pos)));
  const f = Math.max(0, Math.min(1, pos - i));
  return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * f, y: pts[i].y + (pts[i + 1].y - pts[i].y) * f };
}

export default function PcbBackground({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const staticLayer = document.createElement('canvas');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wander = !window.matchMedia('(pointer: fine)').matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let board = { traces: [], segments: [], pads: [] };
    const light = { x: 0, y: 0, tx: 0, ty: 0 };
    let pulses = [];
    let travelled = 0; // pointer distance since the last pulse
    let wanderClock = 0;
    let raf = 0;
    let running = false;
    let last = 0;
    let onScreen = true;

    const spawnPulse = () => {
      if (pulses.length >= MAX_PULSES) return;
      const near = board.segments.filter((s) => (s.mx - light.x) ** 2 + (s.my - light.y) ** 2 < (RADIUS * 0.45) ** 2);
      if (!near.length) return;
      const s = near[Math.floor(Math.random() * near.length)];
      const pts = board.traces[s.t];
      const first = pts[0];
      const end = pts[pts.length - 1];
      /* head for whichever end of the trace is further from the light */
      const dir = (first.x - light.x) ** 2 + (first.y - light.y) ** 2 > (end.x - light.x) ** 2 + (end.y - light.y) ** 2 ? -1 : 1;
      pulses.push({ pts, pos: s.i - 0.5, dir });
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(staticLayer, 0, 0, w, h);

      const buckets = Array.from({ length: LEVELS }, () => []);
      const r2 = RADIUS * RADIUS;
      for (const s of board.segments) {
        const d2 = (s.mx - light.x) ** 2 + (s.my - light.y) ** 2;
        if (d2 < r2) buckets[Math.min(LEVELS - 1, Math.floor((1 - Math.sqrt(d2) / RADIUS) * LEVELS))].push(s);
      }

      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      buckets.forEach((segs, level) => {
        if (!segs.length) return;
        const k = ((level + 1) / LEVELS) ** 1.5;
        ctx.beginPath();
        segs.forEach((s) => {
          ctx.moveTo(s.a.x, s.a.y);
          ctx.lineTo(s.b.x, s.b.y);
        });
        ctx.strokeStyle = `rgba(${ORANGE},${0.18 * k})`;
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.strokeStyle = `rgba(${ORANGE},${0.75 * k})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      for (const p of pulses) {
        const head = pointAt(p.pts, p.pos);
        const tail = pointAt(p.pts, p.pos - p.dir * 1.6);
        const fade = Math.min(1, p.dir > 0 ? p.pts.length - 1 - p.pos : p.pos);
        ctx.strokeStyle = `rgba(${ORANGE},${0.6 * fade})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(head.x, head.y);
        ctx.stroke();
        ctx.fillStyle = `rgba(${ORANGE},${0.28 * fade})`;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,224,192,${fade})`;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (wander) {
        wanderClock += dt;
        light.tx = w * (0.62 + 0.28 * Math.sin(wanderClock * 0.23));
        light.ty = h * (0.5 + 0.32 * Math.sin(wanderClock * 0.37 + 1));
        if (Math.random() < dt * 2.5) spawnPulse();
      }
      const ease = 1 - Math.exp(-dt * 8);
      light.x += (light.tx - light.x) * ease;
      light.y += (light.ty - light.y) * ease;

      pulses = pulses.filter((p) => {
        p.pos += p.dir * PULSE_SPEED * dt;
        return p.pos > 0 && p.pos < p.pts.length - 1;
      });

      draw();

      const settled = !wander && Math.abs(light.tx - light.x) < 0.5 && Math.abs(light.ty - light.y) < 0.5 && !pulses.length;
      if (settled || !onScreen || document.hidden) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (reduced || running || !onScreen || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (!w || !h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      board = generate(w, h);
      drawStatic(staticLayer, board, w, h, dpr);
      if (!light.x && !light.y) {
        light.x = light.tx = w * 0.72;
        light.y = light.ty = h * 0.45;
      }
      pulses = [];
      draw();
      kick();
    };

    const onPointerMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      travelled += Math.hypot(x - light.tx, y - light.ty);
      light.tx = x;
      light.ty = y;
      if (travelled > 45) {
        travelled = 0;
        spawnPulse();
      }
      kick();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      kick();
    });
    io.observe(canvas);
    document.addEventListener('visibilitychange', kick);
    if (!reduced && !wander) window.addEventListener('pointermove', onPointerMove);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', kick);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`absolute inset-0 h-full w-full pointer-events-none ${className}`} />;
}
