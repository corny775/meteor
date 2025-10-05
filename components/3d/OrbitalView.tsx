'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

interface OrbitalViewProps {
  asteroidSize?: number;
}

function EarthSphere() {
  const ref = useRef<Mesh | null>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#4a90e2" roughness={0.8} />
    </mesh>
  );
}

function MovingAsteroid({ size = 500 }: { size?: number }) {
  const ref = useRef<Mesh | null>(null);
  let theta = 0;
  
  // Scale asteroid relative to Earth (size in meters)
  const asteroidScale = Math.min(0.3, size / 5000);
  
  useFrame((_, delta) => {
    theta += delta * 0.5;
    if (ref.current) {
      const r = 4;
      ref.current.position.set(
        Math.cos(theta) * r, 
        Math.sin(theta) * r * 0.2, 
        Math.sin(theta) * r * 0.5
      );
      ref.current.rotation.x += delta * 1.2;
      ref.current.rotation.y += delta * 0.9;
    }
  });
  
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[asteroidScale, 12, 12]} />
      <meshStandardMaterial color="#8b7355" roughness={1} />
    </mesh>
  );
}

export default function OrbitalView({ asteroidSize = 500 }: OrbitalViewProps) {
  return (
    <div className="h-64 w-full rounded overflow-hidden bg-black/50">
      <Canvas camera={{ position: [0, 3.5, 9], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <EarthSphere />
        <MovingAsteroid size={asteroidSize} />
        <gridHelper args={[10, 10, '#333', '#222']} />
      </Canvas>
    </div>
  );
}