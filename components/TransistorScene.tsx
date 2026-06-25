'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Model({ progressRef }: { progressRef: { current: number } }) {
  const { scene } = useGLTF('/models/transistor.gltf');
  const tiltRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = Math.min(1, Math.max(0, progressRef.current));
    if (tiltRef.current) {
      tiltRef.current.rotation.z = -0.5 * (1 - Math.pow(p, 3));
    }
    if (spinRef.current) {
      spinRef.current.rotation.y = p * Math.PI * 4;
    }
  });

  return (
    <group ref={tiltRef} scale={1.2} position={[0, 0, 0]}>
      <group ref={spinRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

export default function TransistorCanvas({ progressRef }: { progressRef: { current: number } }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#F57C00" />
      <directionalLight position={[-5, -5, -5]} intensity={0.4} color="#1E88E5" />
      <pointLight position={[0, 0, 3]} intensity={0.3} color="#F57C00" />
      <Model progressRef={progressRef} />
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={5}
        blur={2}
        far={4}
      />
      <Environment preset="city" />
    </Canvas>
  );
}
