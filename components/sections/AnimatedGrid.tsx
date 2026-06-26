'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function AnimatedGrid({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;

    const w = width;
    const h = height;

    const cols = 40;
    const rows = 28;
    const spacingX = w / cols;
    const spacingY = h / rows;

    const positions: number[] = [];
    const indices: number[] = [];
    const alphas: number[] = [];

    const maxDist = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2);

    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const x = c * spacingX;
        const y = r * spacingY;
        const dx = x - w / 2;
        const dy = y - h / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = Math.max(0, 1 - (dist / maxDist) * 1.2);
        positions.push(x - w / 2, y - h / 2, 0);
        alphas.push(alpha);
      }
    }

    const idx = (r: number, c: number) => r * (cols + 1) + c;

    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        indices.push(idx(r, c), idx(r, c + 1));
      }
    }

    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r < rows; r++) {
        indices.push(idx(r, c), idx(r + 1, c));
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('alpha', new THREE.Float32BufferAttribute(alphas, 1));
    geometry.setIndex(indices);

    const vertexShader = `
      attribute float alpha;
      varying float vAlpha;
      void main() {
        vAlpha = alpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4(uColor, uOpacity * vAlpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color('#1E88E5') },
        uOpacity: { value: 0.12 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -w / 2, w / 2, h / 2, -h / 2, 0.1, 1000
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const gridLines = new THREE.LineSegments(geometry, material);
    scene.add(gridLines);

    const posAttr = geometry.attributes.position;
    const originalY = new Float32Array(posAttr.array);

    let time = 0;
    let animId: number;

    const animate = () => {
      time += 0.008;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        const x = arr[i];
        const wave = Math.sin(x * 0.02 + time * 2) * 4 + Math.sin(x * 0.04 + time * 1.3) * 2;
        arr[i + 1] = originalY[i + 1] + wave;
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      scene.remove(gridLines);
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
