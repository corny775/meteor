'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances, Float } from '@react-three/drei';
import * as THREE from 'three';

interface AsteroidFieldProps {
  count?: number;
}

export default function AsteroidField({ count = 100 }: AsteroidFieldProps) {
  const instancesRef = useRef<THREE.InstancedMesh>(null);

  // Generate random asteroid positions and properties
  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 50 + Math.random() * 100;

      temp.push({
        position: [
          Math.sin(phi) * Math.cos(theta) * radius,
          (Math.random() - 0.5) * 50,
          Math.sin(phi) * Math.sin(theta) * radius,
        ] as [number, number, number],
        scale: 0.2 + Math.random() * 0.8,
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ] as [number, number, number],
        rotationSpeed: [
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
        ],
      });
    }
    return temp;
  }, [count]);

  // Animate asteroid rotation
  useFrame((state) => {
    if (!instancesRef.current) return;

    const time = state.clock.getElapsedTime();
    asteroids.forEach((asteroid, i) => {
      const matrix = new THREE.Matrix4();
      const position = new THREE.Vector3(...asteroid.position);
      const rotation = new THREE.Euler(
        asteroid.rotation[0] + time * asteroid.rotationSpeed[0],
        asteroid.rotation[1] + time * asteroid.rotationSpeed[1],
        asteroid.rotation[2] + time * asteroid.rotationSpeed[2]
      );
      const scale = new THREE.Vector3(
        asteroid.scale,
        asteroid.scale,
        asteroid.scale
      );

      matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
      instancesRef.current!.setMatrixAt(i, matrix);
    });
    instancesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <Instances ref={instancesRef} limit={count}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#8b7355"
          roughness={0.8}
          metalness={0.2}
          emissive="#3d2817"
          emissiveIntensity={0.1}
        />
        {asteroids.map((asteroid, i) => (
          <Instance key={i} position={asteroid.position} scale={asteroid.scale} />
        ))}
      </Instances>

      {/* Particle dust effect */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2000}
            array={new Float32Array(
              Array.from({ length: 6000 }, () => (Math.random() - 0.5) * 200)
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#00d4ff"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
