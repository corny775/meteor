'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AsteroidModelProps {
  position: [number, number, number];
  size?: number;
}

export default function AsteroidModel({ position, size = 2 }: AsteroidModelProps) {
  const asteroidRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (asteroidRef.current) {
      asteroidRef.current.rotation.x += 0.01;
      asteroidRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={position}>
      <mesh ref={asteroidRef}>
        <dodecahedronGeometry args={[size, 1]} />
        <meshStandardMaterial
          color="#8B7355"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[size * 1.2, 32, 32]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Trail particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={50}
            array={new Float32Array(
              Array.from({ length: 150 }, () => (Math.random() - 0.5) * size * 3)
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#ffaa00" transparent opacity={0.6} />
      </points>
    </group>
  );
}
