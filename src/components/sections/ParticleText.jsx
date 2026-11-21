import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useTheme, tokenColor, getTheme } from '@/lib/theme';

export default function ParticleText({
  text = 'EVENTS_TERMINAL',
  color,
  particleSize = 2.5,
  dispersionRadius = 200,
  dispersionStrength = 80,
  resolution = 4,
}) {
  const containerRef = useRef(null);
  const builtSizeRef = useRef({ width: 0, height: 0 });
  /* Handles into the current three.js build so a theme change can recolour it without a rebuild */
  const liveRef = useRef(null);
  const theme = useTheme();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  /* Rebuild only for real size changes: debounced, and ignoring small height-only
     jitter (mobile URL bar). The first observer callback matches the initial build. */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let timer;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const last = builtSizeRef.current;
        if (last.width === width && last.height === height) return;
        if (last.width === width && Math.abs(last.height - height) < 100) return;
        setDimensions({ width, height });
      }, 150);
    });
    ro.observe(container);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let teardown = null;

    const build = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      builtSizeRef.current = { width: w, height: h };

      /* A canvas whose context was force-lost can't be reused, so each build gets a fresh one */
      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      canvas.className = 'w-full h-full block relative z-10';
      container.appendChild(canvas);

      const fontSize = w < 640 ? 56 : 120;
      const font = `bold ${fontSize}px "Space Mono", "IBM Plex Sans Arabic", "Courier New", monospace`;

      const measureCtx = document.createElement('canvas').getContext('2d');
      measureCtx.font = font;
      const metrics = measureCtx.measureText(text);
      const textWidth = metrics.width;
      const textHeight = fontSize + 20;

      const offscreen = document.createElement('canvas');
      const ctx = offscreen.getContext('2d');
      offscreen.width = Math.ceil(textWidth + 40);
      offscreen.height = textHeight;

      ctx.fillStyle = '#ffffff';
      ctx.font = font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, offscreen.width / 2, offscreen.height / 2);

      const imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
      const data = imageData.data;

      const res = Math.max(1, Math.floor(resolution));
      const rawPositions = [];
      for (let y = 0; y < offscreen.height; y += res) {
        for (let x = 0; x < offscreen.width; x += res) {
          const i = (y * offscreen.width + x) * 4;
          if (data[i + 3] > 128) {
            rawPositions.push(x - offscreen.width / 2, -(y - offscreen.height / 2), 0);
          }
        }
      }

      const textAspect = offscreen.width / offscreen.height;
      const containerAspect = w / h;

      let scaleFactor;
      if (containerAspect > textAspect) {
        scaleFactor = (h * 0.5) / offscreen.height;
      } else {
        scaleFactor = (w * 0.75) / offscreen.width;
      }

      const particleCount = rawPositions.length / 3;
      const homePositions = new Float32Array(rawPositions.length);
      const currentPositions = new Float32Array(rawPositions.length);

      for (let i = 0; i < rawPositions.length; i += 3) {
        homePositions[i] = rawPositions[i] * scaleFactor;
        homePositions[i + 1] = rawPositions[i + 1] * scaleFactor;
        homePositions[i + 2] = 0;
        currentPositions[i] = homePositions[i];
        currentPositions[i + 1] = homePositions[i + 1];
        currentPositions[i + 2] = 0;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 1000);
      camera.position.z = 10;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

      const material = new THREE.PointsMaterial({
        color: new THREE.Color(color ?? tokenColor('primary')),
        size: getTheme() === 'light' ? particleSize * 1.25 : particleSize,
        sizeAttenuation: false,
        transparent: true,
        opacity: getTheme() === 'light' ? 1 : 0.9,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      liveRef.current = { material, redraw: () => renderer.render(scene, camera) };

      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const raycaster = new THREE.Raycaster();
      const mouseNDC = new THREE.Vector2();
      const intersection = new THREE.Vector3();
      let mouseInside = false;

      const onMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        mouseInside = true;
      };

      const onMouseLeave = () => {
        mouseInside = false;
      };

      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('mouseleave', onMouseLeave);

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let animId = 0;
      let onScreen = true;

      const animate = () => {
        raycaster.setFromCamera(mouseNDC, camera);
        raycaster.ray.intersectPlane(plane, intersection);

        const pos = geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          let dx = 0;
          let dy = 0;

          if (mouseInside && intersection) {
            const px = homePositions[i3];
            const py = homePositions[i3 + 1];
            const dist = Math.sqrt(
              (px - intersection.x) ** 2 + (py - intersection.y) ** 2
            );
            if (dist < dispersionRadius && dist > 0.1) {
              const force = (1 - dist / dispersionRadius) * dispersionStrength;
              dx = ((px - intersection.x) / dist) * force;
              dy = ((py - intersection.y) / dist) * force;
            }
          }

          const targetX = homePositions[i3] + dx;
          const targetY = homePositions[i3 + 1] + dy;
          pos[i3] += (targetX - pos[i3]) * 0.1;
          pos[i3 + 1] += (targetY - pos[i3 + 1]) * 0.1;
          pos[i3 + 2] += (0 - pos[i3 + 2]) * 0.1;
        }

        geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };

      /* Loop runs only while the canvas is on screen, the tab is visible and motion is allowed */
      const sync = () => {
        const shouldRun = onScreen && !document.hidden && !reducedMotion.matches;
        if (shouldRun && !animId) {
          animId = requestAnimationFrame(animate);
        } else if (!shouldRun && animId) {
          cancelAnimationFrame(animId);
          animId = 0;
        }
        /* Reduced motion: one static, settled frame (particles already sit at home) */
        if (reducedMotion.matches) renderer.render(scene, camera);
      };

      const io = new IntersectionObserver((entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
        sync();
      });
      io.observe(container);
      document.addEventListener('visibilitychange', sync);
      reducedMotion.addEventListener('change', sync);
      sync();

      teardown = () => {
        liveRef.current = null;
        cancelAnimationFrame(animId);
        animId = 0;
        io.disconnect();
        document.removeEventListener('visibilitychange', sync);
        reducedMotion.removeEventListener('change', sync);
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('mouseleave', onMouseLeave);
        renderer.forceContextLoss();
        renderer.dispose();
        canvas.remove();
        geometry.dispose();
        material.dispose();
      };
    };

    /* Measure text only once the web font is available */
    const fontSize = container.clientWidth < 640 ? 56 : 120;
    const fontSpec = `bold ${fontSize}px "Space Mono", "IBM Plex Sans Arabic"`;
    const fontsReady = document.fonts
      ? Promise.all([document.fonts.load(fontSpec, text), document.fonts.ready]).catch(() => {})
      : Promise.resolve();
    fontsReady.then(() => {
      if (!disposed) build();
    });

    return () => {
      disposed = true;
      if (teardown) teardown();
    };
  }, [text, color, particleSize, dispersionRadius, dispersionStrength, resolution, dimensions]);

  /* Theme flip: recolour the existing particles (the render loop picks it up; reduced motion needs one redraw) */
  useEffect(() => {
    const live = liveRef.current;
    if (!live) return;
    live.material.color.set(color ?? tokenColor('primary'));
    live.material.opacity = theme === 'light' ? 1 : 0.9; /* thin dark dots on light need full strength */
    live.material.size = theme === 'light' ? particleSize * 1.25 : particleSize;
    live.redraw();
  }, [theme, color, particleSize]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(90deg, color-mix(in oklab, var(--color-accent) 15%, transparent) 2px, transparent 2px),
          linear-gradient(0deg, color-mix(in oklab, var(--color-accent) 15%, transparent) 2px, transparent 2px),
          radial-gradient(circle, color-mix(in oklab, var(--color-accent) 25%, transparent) 3px, transparent 3px)
        `,
        backgroundSize: '40px 40px, 40px 40px, 40px 40px',
        backgroundPosition: '0 0, 0 0, 20px 20px',
      }}
    />
  );
}
