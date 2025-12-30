import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, AnimationMixer, AnimationAction, AnimationClip } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface CharacterProps {
  position: THREE.Vector3;
  isMoving: boolean;
  isRunning: boolean;
}

export const Character = ({ position, isMoving, isRunning }: CharacterProps) => {
  const group = useRef<Group>(null);
  const mixer = useRef<AnimationMixer | null>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const idleAnimations = useRef<AnimationClip[]>([]);
  const runAnimation = useRef<AnimationClip | null>(null);
  const currentAction = useRef<AnimationAction | null>(null);
  const idleSwitchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load the 3D models and merge animations
  useEffect(() => {
    const loader = new GLTFLoader();
    let loadedModel: THREE.Group;
    let allAnimations: AnimationClip[] = [];
    
    // Load main character
    loader.load(
      '/models/character.glb',
      (gltf) => {
        console.log('Main character loaded');
        console.log('Main animations:', gltf.animations.map(a => a.name));
        
        loadedModel = gltf.scene;
        allAnimations = [...gltf.animations];
        
        // Now load the running animation
        loader.load(
          '/models/characterRun.glb',
          (runGltf) => {
            console.log('Run character loaded');
            console.log('Run animations:', runGltf.animations.map(a => a.name));
            
            // Extract running animation(s) and add to main character
            const runningClips = runGltf.animations.filter(clip => 
              clip.name.toLowerCase().includes('run')
            );
            
            if (runningClips.length > 0) {
              runningClips.forEach(clip => {
                const clonedClip = clip.clone();
                allAnimations.push(clonedClip);
              });
              
              console.log('Merged animations:', allAnimations.map(a => a.name));
            }
            
            // Setup animation mixer with all animations
            const animMixer = new AnimationMixer(loadedModel);
            mixer.current = animMixer;
            
            // Categorize animations
            idleAnimations.current = allAnimations.filter(clip => 
              clip.name.toLowerCase().includes('idle')
            );
            
            const runAnims = allAnimations.filter(clip => 
              clip.name.toLowerCase().includes('run')
            );
            runAnimation.current = runAnims.length > 0 ? runAnims[0] : null;
            
            console.log('Idle animations:', idleAnimations.current.map(a => a.name));
            console.log('Run animation:', runAnimation.current?.name);
            
            setModel(loadedModel);
            
            // Play initial idle animation
            if (idleAnimations.current.length > 0) {
              const randomIdle = idleAnimations.current[
                Math.floor(Math.random() * idleAnimations.current.length)
              ];
              const action = animMixer.clipAction(randomIdle);
              action.play();
              currentAction.current = action;
              console.log('Playing initial animation:', randomIdle.name);
            }
          },
          undefined,
          (error: unknown) => {
            console.error('Error loading run character:', error);
            // Continue without run animation
            setModel(loadedModel);
          }
        );
      },
      undefined,
      (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error loading main character:', errorMessage);
      }
    );

    return () => {
      if (mixer.current) {
        mixer.current.stopAllAction();
      }
      if (idleSwitchTimeout.current) {
        clearTimeout(idleSwitchTimeout.current);
      }
    };
  }, []);

  // Handle animation switching based on movement
  useEffect(() => {
    if (!mixer.current || !currentAction.current) return;

    // Clear idle animation switching when moving
    if (idleSwitchTimeout.current) {
      clearTimeout(idleSwitchTimeout.current);
      idleSwitchTimeout.current = null;
    }

    let targetClip: AnimationClip | null = null;

    if (isMoving && isRunning && runAnimation.current) {
      // Running
      targetClip = runAnimation.current;
    } else if (isMoving && idleAnimations.current.length > 0) {
      // Walking (use idle animation for now)
      targetClip = idleAnimations.current[0];
    } else if (!isMoving && idleAnimations.current.length > 0) {
      // Idle - pick a random one
      targetClip = idleAnimations.current[
        Math.floor(Math.random() * idleAnimations.current.length)
      ];
    }

    if (targetClip && currentAction.current) {
      const currentClip = currentAction.current.getClip();
      
      // Only switch if different animation
      if (currentClip.name !== targetClip.name) {
        const nextAction = mixer.current.clipAction(targetClip);
        
        currentAction.current.fadeOut(0.2);
        nextAction.reset().fadeIn(0.2).play();
        currentAction.current = nextAction;
        
        console.log('Switching to:', targetClip.name);
      }
    }
  }, [isMoving, isRunning]);

  // Randomly switch between idle animations when idle
  useEffect(() => {
    if (isMoving || !mixer.current || idleAnimations.current.length <= 1) return;

    const scheduleNextSwitch = () => {
      const randomDelay = 5000 + Math.random() * 5000; // 5-10 seconds
      idleSwitchTimeout.current = setTimeout(() => {
        if (!isMoving && mixer.current && currentAction.current) {
          const randomIdle = idleAnimations.current[
            Math.floor(Math.random() * idleAnimations.current.length)
          ];
          
          const nextAction = mixer.current.clipAction(randomIdle);
          currentAction.current.fadeOut(0.5);
          nextAction.reset().fadeIn(0.5).play();
          currentAction.current = nextAction;
          
          console.log('Switching idle to:', randomIdle.name);
          scheduleNextSwitch();
        }
      }, randomDelay);
    };

    scheduleNextSwitch();

    return () => {
      if (idleSwitchTimeout.current) {
        clearTimeout(idleSwitchTimeout.current);
      }
    };
  }, [isMoving, model]);

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

