'use client';

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { OrbitalMechanics } from '@/lib/orbital-mechanics';
import { OrbitalData } from '@/types';

interface OrbitPathProps {
  orbitalData: any;
  deflectionApplied?: boolean;
}

export default function OrbitPath({ orbitalData, deflectionApplied }: OrbitPathProps) {
  const orbitPoints = useMemo(() => {
    try {
      // Note: OrbitalData from NASA has different property names than our OrbitData interface
      const orbit = {
        a: parseFloat(orbitalData?.semi_major_axis) || 1.5,
        e: parseFloat(orbitalData?.eccentricity) || 0.2,
        i: parseFloat(orbitalData?.inclination) || 10,
        omega: parseFloat(orbitalData?.perihelion_argument) || 0,
        Omega: parseFloat(orbitalData?.ascending_node_longitude) || 0,
        M: parseFloat(orbitalData?.mean_anomaly) || 0,
      };

      const points = OrbitalMechanics.generateOrbitPath(orbit, 200);
      
      // Convert to Three.js Vector3 and scale
      return points.map(p => new THREE.Vector3(p.x * 100, p.z * 100, p.y * 100));
    } catch (error) {
      // Fallback ellipse
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 200; i++) {
        const angle = (i / 200) * Math.PI * 2;
        const x = Math.cos(angle) * 120;
        const z = Math.sin(angle) * 80;
        points.push(new THREE.Vector3(x, 0, z));
      }
      return points;
    }
  }, [orbitalData]);

  const deflectedOrbitPoints = useMemo(() => {
    if (!deflectionApplied) return null;
    
    // Simulate deflected orbit - slightly modified path
    return orbitPoints.map((p, i) => {
      const offset = i > 100 ? (i - 100) * 0.1 : 0;
      return new THREE.Vector3(p.x + offset, p.y + offset * 0.5, p.z);
    });
  }, [orbitPoints, deflectionApplied]);

  return (
    <>
      {/* Original orbit */}
      <Line
        points={orbitPoints}
        color={deflectionApplied ? "#ff6600" : "#00d4ff"}
        lineWidth={2}
        dashed={deflectionApplied}
        dashScale={50}
        dashSize={10}
        gapSize={5}
      />

      {/* Deflected orbit */}
      {deflectedOrbitPoints && (
        <Line
          points={deflectedOrbitPoints}
          color="#00ff9f"
          lineWidth={2}
        />
      )}
    </>
  );
}
