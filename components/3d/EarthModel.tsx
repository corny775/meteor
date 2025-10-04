'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Vertex shader for atmosphere (from tutorial)
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 eyeVector;
  
  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    eyeVector = normalize(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

// Fragment shader for atmosphere (from tutorial)
const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 eyeVector;
  uniform float atmOpacity;
  uniform float atmPowFactor;
  uniform float atmMultiplier;
  
  void main() {
    float dotP = dot(vNormal, eyeVector);
    float factor = pow(dotP, atmPowFactor) * atmMultiplier;
    vec3 atmColor = vec3(0.35 + dotP/4.5, 0.35 + dotP/4.5, 1.0);
    gl_FragColor = vec4(atmColor, atmOpacity) * factor;
  }
`

interface EarthModelProps {
  position?: [number, number, number];
}

export default function EarthModel({ position = [0, 0, 0] }: EarthModelProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const uvOffsetRef = useRef(0);

  // Load real NASA textures from assets folder with optimization
  const earthTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      '/assets/Gaia_EDR3_darkened.png',
      () => console.log('Earth texture loaded successfully'),
      undefined,
      (err) => console.error('Error loading earth texture:', err)
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    // Performance optimization
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 2; // Reduced from default 16
    return texture;
  }, []);

  const bumpTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      '/assets/Bump.jpg',
      () => console.log('Bump texture loaded successfully'),
      undefined,
      (err) => console.error('Error loading bump texture:', err)
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false; // Disable for bump maps
    return texture;
  }, []);

  const cloudTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      '/assets/Clouds.png',
      () => console.log('Cloud texture loaded successfully'),
      undefined,
      (err) => console.error('Error loading cloud texture:', err)
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  const oceanTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      '/assets/Ocean.png',
      () => console.log('Ocean texture loaded successfully'),
      undefined,
      (err) => console.error('Error loading ocean texture:', err)
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  const lightsTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      '/assets/night_lights_modified.png',
      () => console.log('Night lights texture loaded successfully'),
      undefined,
      (err) => console.error('Error loading night lights texture:', err)
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  // Set initial rotation positions and animate
  useFrame((state, delta) => {
    const speedFactor = 1.0;
    
    // Set initial rotation once
    if (earthRef.current && !earthRef.current.userData.initialized) {
      earthRef.current.rotateY(-0.3);
      earthRef.current.userData.initialized = true;
    }
    if (cloudsRef.current && !cloudsRef.current.userData.initialized) {
      cloudsRef.current.rotateY(-0.3);
      cloudsRef.current.userData.initialized = true;
    }
    
    // Rotate Earth and clouds
    if (earthRef.current) {
      earthRef.current.rotateY(delta * 0.01 * speedFactor);
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotateY(delta * 0.015 * speedFactor);
    }
  });

  return (
    <group position={position} rotation={[0, 0, 23.5 / 360 * 2 * Math.PI]}>
      {/* Main Earth sphere with all maps - Reduced segments for performance */}
      <Sphere ref={earthRef} args={[10, 48, 48]}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={0.05}
          roughnessMap={oceanTexture}
          roughness={1.0}
          metalness={0.0}
          emissiveMap={lightsTexture}
          emissive={new THREE.Color(0xffff88)}
          emissiveIntensity={0.8}
        />
      </Sphere>

      {/* Clouds layer - Reduced segments */}
      <Sphere ref={cloudsRef} args={[10.1, 48, 48]}>
        <meshStandardMaterial
          alphaMap={cloudTexture}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </Sphere>

      {/* Atmosphere using custom shader - Reduced segments */}
      <Sphere ref={atmosphereRef} args={[12, 32, 32]}>
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={{
            atmOpacity: { value: 0.3 },
            atmPowFactor: { value: 3.5 },
            atmMultiplier: { value: 5.0 },
          }}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
        />
      </Sphere>

      {/* Orbit ring - Reduced segments */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[99, 101, 64]} />
        <meshBasicMaterial
          color="#00ff9f"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}