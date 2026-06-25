'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Model({ progressRef }: { progressRef: { current: number } }) {
  const { scene } = useGLTF('/models/transistor.gltf');
  const tiltRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const glintLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const p = Math.min(1, Math.max(0, progressRef.current));
    if (tiltRef.current) {
      tiltRef.current.rotation.z = -0.5 * (1 - Math.pow(p, 3));
    }
    if (spinRef.current) {
      spinRef.current.rotation.y = p * Math.PI * 4;
    }

    /* Moving glint light */
    if (glintLightRef.current) {
      const angle = state.clock.elapsedTime * 0.6;
      glintLightRef.current.position.x = Math.sin(angle) * 2.5;
      glintLightRef.current.position.z = Math.cos(angle) * 2.5;
      glintLightRef.current.position.y = Math.sin(angle * 0.7) * 1.5;
    }
  });

  /* Apply dark material on first load */
  if (!(scene as any).__patched) {
    (scene as any).__patched = true;
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#1a1a1a'),
          metalness: 0.7,
          roughness: 0.25,
          clearcoat: 0.15,
          clearcoatRoughness: 0.3,
          envMapIntensity: 1.8,
        });
      }
    });
  }

  return (
    <group ref={tiltRef} scale={1.1} position={[0, 0, 0]}>
      <group ref={spinRef}>
        <primitive object={scene} />
      </group>
      <pointLight ref={glintLightRef} intensity={0.6} distance={6} color="#F57C00" />
    </group>
  );
}

export default function TransistorCanvas({ progressRef }: { progressRef: { current: number } }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#F57C00" />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#1E88E5" />
      <Model progressRef={progressRef} />
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.35}
        scale={5}
        blur={2}
        far={4}
      />
      <Environment preset="city" />
    </Canvas>
  );
}
