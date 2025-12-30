import { Canvas } from '@react-three/fiber';
import { Player } from './Player';
import * as THREE from 'three';

// Simple ground plane component to replace Grid
const GroundPlane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[120, 120, 20, 20]} />
      <meshStandardMaterial color="#374151"  />
    </mesh>
  );
};

export const GameCanvas = () => {
    return (
      <Canvas
        camera={{
          position: [8, 6, 8],
          fov: 30,
        }}
        shadows
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        {/* Key Light - Main light source (sun) */}
        <directionalLight
          position={[10, 15, 10]}
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-bias={-0.0001}
        />
  
        {/* Fill Light - Soften shadows */}
        <directionalLight
          position={[-5, 8, -5]}
          intensity={0.8}
          color="#b0d4ff"
        />
  
        {/* Back/Rim Light - Separate character from background */}
        <directionalLight
          position={[0, 5, -10]}
          intensity={0.6}
          color="#ffeecc"
        />
  
        {/* Ambient Light - Base illumination */}
        <ambientLight intensity={0.3} color="#ffffff" />
  
        {/* Hemisphere Light - Sky/Ground ambient */}
        <hemisphereLight
          args={['#87ceeb', '#545454', 0.6]}
          position={[0, 50, 0]}
        />
  
        {/* Player */}
        <Player />
  
        {/* Ground Plane */}
        <GroundPlane />
      </Canvas>
    );
  };

