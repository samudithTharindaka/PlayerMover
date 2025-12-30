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
  const happyIdleAnimation = useRef<AnimationClip | null>(null);
  const walkAnimation = useRef<AnimationClip | null>(null);
  const runAnimation = useRef<AnimationClip | null>(null);
  const currentAction = useRef<AnimationAction | null>(null);

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
                    const happyIdle = allAnimations.find(clip => 
                      clip.name.toLowerCase().includes('happy')
                    );
                    happyIdleAnimation.current = happyIdle || null;
                    
                    const walkAnims = allAnimations.filter(clip => 
                      clip.name.toLowerCase().includes('walk')
                    );
                    walkAnimation.current = walkAnims.length > 0 ? walkAnims[0] : null;
                    
                    const runAnims = allAnimations.filter(clip => 
                      clip.name.toLowerCase().includes('running')
                    );
                    runAnimation.current = runAnims.length > 0 ? runAnims[0] : null;
                    
                    console.log('HappyIdle animation:', happyIdleAnimation.current?.name);
                    console.log('Walk animation:', walkAnimation.current?.name);
                    console.log('Run animation:', runAnimation.current?.name);
                    
                    setModel(loadedModel);
                    
                    // Play HappyIdle initially
                    if (happyIdleAnimation.current) {
                      const action = animMixer.clipAction(happyIdleAnimation.current);
                      action.play();
                      currentAction.current = action;
                      console.log('Playing initial animation:', happyIdleAnimation.current.name);
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
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error loading main character:', errorMessage);
      }
    );

    return () => {
      if (mixer.current) {
        mixer.current.stopAllAction();
      }
    };
  }, []);

  // Handle animation switching based on movement
  useEffect(() => {
    if (!mixer.current || !currentAction.current) return;

    let targetClip: AnimationClip | null = null;

    if (isMoving && isRunning && runAnimation.current) {
      // Running
      targetClip = runAnimation.current;
    } else if (isMoving && walkAnimation.current) {
      // Walking
      targetClip = walkAnimation.current;
    } else if (!isMoving && happyIdleAnimation.current) {
      // Idle - always use HappyIdle
      targetClip = happyIdleAnimation.current;
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

