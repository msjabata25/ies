'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface ParticleTextProps {
  text?: string;
  color?: string;
  particleSize?: number;
  dispersionRadius?: number;
  dispersionStrength?: number;
  resolution?: number;
}

export default function ParticleText({
  text = 'EVENTS_TERMINAL',
  color = '#F57C00',
  particleSize = 2.5,
  dispersionRadius = 200,
  dispersionStrength = 80,
  resolution = 4,
}: ParticleTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateWidth = () => setWidth(container.clientWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;

    const fontSize = w < 640 ? 56 : 120;
    const font = `bold ${fontSize}px "Space Mono", "Courier New", monospace`;

    const measureCtx = document.createElement('canvas').getContext('2d')!;
    measureCtx.font = font;
    const metrics = measureCtx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize + 20;

    const offscreen = document.createElement('canvas');
    const ctx = offscreen.getContext('2d')!;
    offscreen.width = Math.ceil(textWidth + 40);
    offscreen.height = textHeight;

    ctx.fillStyle = '#ffffff';
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, offscreen.width / 2, offscreen.height / 2);

    const imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
    const data = imageData.data;

    const rawPositions: number[] = [];
    for (let y = 0; y < offscreen.height; y += resolution) {
      for (let x = 0; x < offscreen.width; x += resolution) {
        const i = (y * offscreen.width + x) * 4;
        if (data[i + 3] > 128) {
          rawPositions.push(x - offscreen.width / 2, -(y - offscreen.height / 2), 0);
        }
      }
    }

    const textAspect = offscreen.width / offscreen.height;
    const containerAspect = w / h;

    let scaleFactor: number;
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
      color: new THREE.Color(color),
      size: particleSize,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.9,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();
    const intersection = new THREE.Vector3();
    let mouseInside = false;

    const onMouseMove = (e: MouseEvent) => {
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

    let animId: number;

    const animate = () => {
      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(plane, intersection);

      const pos = geometry.attributes.position.array as Float32Array;

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

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [text, color, particleSize, dispersionRadius, dispersionStrength, resolution, width]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(30,136,229,0.15) 2px, transparent 2px),
          linear-gradient(0deg, rgba(30,136,229,0.15) 2px, transparent 2px),
          radial-gradient(circle, rgba(30,136,229,0.25) 3px, transparent 3px)
        `,
        backgroundSize: '40px 40px, 40px 40px, 40px 40px',
        backgroundPosition: '0 0, 0 0, 20px 20px',
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block relative z-10" />
    </div>
  );
}
