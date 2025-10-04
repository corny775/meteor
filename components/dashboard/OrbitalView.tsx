'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AsteroidModel from '../3d/AsteroidModel';
import EarthModel from '../3d/EarthModel';
import OrbitPath from '../3d/OrbitPath';
import { Suspense } from 'react';

export default function OrbitalView() {
  const { selectedAsteroid, selectedDeflectionStrategy } = useAppStore();

  return (
    <div className="container mx-auto px-4">
      <Card className="h-[calc(100vh-8rem)]">
        <CardHeader>
          <CardTitle className="text-space-cyan">Orbital Mechanics Viewer</CardTitle>
          {selectedAsteroid && (
            <p className="text-sm text-gray-400">
              Viewing: {selectedAsteroid.name}
            </p>
          )}
        </CardHeader>
        <CardContent className="h-[calc(100%-5rem)]">
          <Canvas className="w-full h-full bg-black rounded-lg">
            <PerspectiveCamera makeDefault position={[0, 50, 150]} />
            <OrbitControls enableZoom enablePan enableRotate />
            
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
            
            <Suspense fallback={null}>
              <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              
              {/* Sun */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[5, 32, 32]} />
                <meshStandardMaterial emissive="#FDB813" emissiveIntensity={2} />
              </mesh>

              {/* Earth */}
              <EarthModel position={[100, 0, 0]} />

              {/* Asteroid */}
              {selectedAsteroid && (
                <>
                  <AsteroidModel position={[80, 10, 20]} />
                  <OrbitPath 
                    orbitalData={selectedAsteroid.orbital_data}
                    deflectionApplied={!!selectedDeflectionStrategy}
                  />
                </>
              )}
            </Suspense>
          </Canvas>
        </CardContent>
      </Card>
    </div>
  );
}
