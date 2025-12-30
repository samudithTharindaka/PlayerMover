import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface CharacterProps {
  position: THREE.Vector3;
}

export const Character = ({ position }: CharacterProps) => {
  const group = useRef<Group>(null);
  const mixer = useRef<AnimationMixer | null>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);

  // Load the 3D model using Three.js GLTFLoader
  useEffect(() => {
    const loader = new GLTFLoader();
    
    loader.load(
      '/models/character.glb',
      (gltf) => {
        console.log('Model loaded successfully');
        console.log('Available animations:', gltf.animations.map(a => a.name));
        
        const loadedModel = gltf.scene;
        setModel(loadedModel);

        // Setup animation mixer
        if (gltf.animations && gltf.animations.length > 0) {
          const animMixer = new AnimationMixer(loadedModel);
          mixer.current = animMixer;

          // Play the first animation (Idle)
          const clip = gltf.animations[0];
          const animAction = animMixer.clipAction(clip);
          animAction.play();
          
          console.log('Playing animation:', clip.name);
        }
      },
      (progress) => {
        const percent = (progress.loaded / progress.total * 100).toFixed(0);
        console.log('Loading:', percent + '%');
      },
      (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error loading model:', errorMessage);
      }
    );

    return () => {
      // Cleanup
      if (mixer.current) {
        mixer.current.stopAllAction();
      }
    };
  }, []);

  // Update animation mixer on each frame
  useFrame((_state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  if (!model) {
    return null;
  }

  return (
    <group ref={group} position={position}>
      <primitive 
        object={model} 
        scale={1.0}
        rotation={[0, 0, 0]}
      />
    </group>
  );
};

