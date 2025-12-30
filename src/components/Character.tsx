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
  const walkAnimation = useRef<AnimationClip | null>(null);
  const runAnimation = useRef<AnimationClip | null>(null);
  const currentAction = useRef<AnimationAction | null>(null);
  const idleSwitchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load the 3D models and merge animations
  useEffect(() => {
    const loader = new GLTFLoader();
    let loadedModel: THREE.Group;
    let allAnimations: AnimationClip[] = [];
    
    // Load main character (HappyIdle)
    loader.load(
      '/models/character.glb',
      (gltf) => {
        console.log('Main character loaded');
        console.log('Main animations:', gltf.animations.map(a => a.name));
        
        loadedModel = gltf.scene;
        
        // Keep only HappyIdle from main character
        const happyIdle = gltf.animations.find(clip => 
          clip.name.toLowerCase().includes('happy')
        );
        if (happyIdle) {
          allAnimations.push(happyIdle);
          console.log('Extracted HappyIdle from character.glb');
        }
        
        // Load characterIdle.glb for Idle animation
        loader.load(
          '/models/characterIdle.glb',
          (idleGltf) => {
            console.log('Idle character loaded');
            console.log('Idle animations:', idleGltf.animations.map(a => a.name));
            
            if (idleGltf.animations.length > 0) {
              const idleClip = idleGltf.animations[0].clone();
              idleClip.name = 'Idle';
              allAnimations.push(idleClip);
              console.log('Extracted Idle from characterIdle.glb');
            }
            
            // Load characterWalk.glb for Walk animation
            loader.load(
              '/models/characterWalk.glb',
              (walkGltf) => {
                console.log('Walk character loaded');
                console.log('Walk animations:', walkGltf.animations.map(a => a.name));
                
                if (walkGltf.animations.length > 0) {
                  const walkClip = walkGltf.animations[0].clone();
                  walkClip.name = 'Walking';
                  allAnimations.push(walkClip);
                  console.log('Extracted Walk from characterWalk.glb');
                }
                
                // Load characterRun.glb for Running animation
                loader.load(
                  '/models/characterRun.glb',
                  (runGltf) => {
                    console.log('Run character loaded');
                    console.log('Run animations:', runGltf.animations.map(a => a.name));
                    
                    if (runGltf.animations.length > 0) {
                      const runClip = runGltf.animations[0].clone();
                      runClip.name = 'Running';
                      allAnimations.push(runClip);
                      console.log('Extracted Running from characterRun.glb');
                    }
                    
                    console.log('All merged animations:', allAnimations.map(a => a.name));
                    
                    // Setup animation mixer with all animations
                    const animMixer = new AnimationMixer(loadedModel);
                    mixer.current = animMixer;
                    
                    // Categorize animations
                    idleAnimations.current = allAnimations.filter(clip => 
                      clip.name.toLowerCase().includes('idle')
                    );
                    
                    const walkAnims = allAnimations.filter(clip => 
                      clip.name.toLowerCase().includes('walk')
                    );
                    walkAnimation.current = walkAnims.length > 0 ? walkAnims[0] : null;
                    
                    const runAnims = allAnimations.filter(clip => 
                      clip.name.toLowerCase().includes('running')
                    );
                    runAnimation.current = runAnims.length > 0 ? runAnims[0] : null;
                    
                    console.log('Idle animations:', idleAnimations.current.map(a => a.name));
                    console.log('Walk animation:', walkAnimation.current?.name);
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
                    setModel(loadedModel);
                  }
                );
              },
              undefined,
              (error: unknown) => {
                console.error('Error loading walk character:', error);
                setModel(loadedModel);
              }
            );
          },
          undefined,
          (error: unknown) => {
            console.error('Error loading idle character:', error);
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
    } else if (isMoving && walkAnimation.current) {
      // Walking
      targetClip = walkAnimation.current;
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

