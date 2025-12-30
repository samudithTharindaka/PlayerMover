import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, AnimationMixer, AnimationAction, AnimationClip } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface CharacterProps {
  position: THREE.Vector3;
}

export const Character = ({ position }: CharacterProps) => {
  const group = useRef<Group>(null);
  const mixer = useRef<AnimationMixer | null>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const idleAnimations = useRef<AnimationClip[]>([]);
  const currentAction = useRef<AnimationAction | null>(null);

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

          // Find all idle animations (Idle, HappyIdle, etc.)
          idleAnimations.current = gltf.animations.filter(clip => 
            clip.name.toLowerCase().includes('idle')
          );

          console.log('Found idle animations:', idleAnimations.current.map(a => a.name));

          // Play a random idle animation to start
          if (idleAnimations.current.length > 0) {
            const randomIdle = idleAnimations.current[
              Math.floor(Math.random() * idleAnimations.current.length)
            ];
            const action = animMixer.clipAction(randomIdle);
            action.play();
            currentAction.current = action;
            console.log('Playing animation:', randomIdle.name);
          }
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

  // Randomly switch between idle animations
  useEffect(() => {
    if (!mixer.current || idleAnimations.current.length <= 1) return;

    const switchIdleAnimation = () => {
      // Pick a random idle animation
      const randomIdle = idleAnimations.current[
        Math.floor(Math.random() * idleAnimations.current.length)
      ];

      if (mixer.current && currentAction.current) {
        const nextAction = mixer.current.clipAction(randomIdle);
        
        // Smooth transition
        currentAction.current.fadeOut(0.5);
        nextAction.reset().fadeIn(0.5).play();
        currentAction.current = nextAction;
        
        console.log('Switching to:', randomIdle.name);
      }
    };

    // Switch idle animation every 5-10 seconds (random interval)
    const scheduleNext = () => {
      const randomDelay = 5000 + Math.random() * 5000; // 5-10 seconds
      return setTimeout(() => {
        switchIdleAnimation();
        scheduleNext();
      }, randomDelay);
    };

    const timeoutId = scheduleNext();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [model]);

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

