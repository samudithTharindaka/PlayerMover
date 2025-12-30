import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, AnimationMixer, AnimationAction } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface CharacterProps {
  position: THREE.Vector3;
}

export const Character = ({ position }: CharacterProps) => {
  const group = useRef<Group>(null);
  const mixer = useRef<AnimationMixer | null>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [action, setAction] = useState<AnimationAction | null>(null);

  // Load the 3D model using Three.js GLTFLoader
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8c83c568-9d4c-4d90-b85b-618686995722',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Character.tsx:19',message:'Character component mounted, starting model load',data:{position:position.toArray()},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'K,M'})}).catch(()=>{});
    // #endregion
    
    const loader = new GLTFLoader();
    
    loader.load(
      '/models/character.glb',
      (gltf) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/8c83c568-9d4c-4d90-b85b-618686995722',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Character.tsx:28',message:'Model loaded successfully',data:{hasScene:!!gltf.scene,sceneChildren:gltf.scene.children.length,animations:gltf.animations.map(a=>a.name),boundingBox:new THREE.Box3().setFromObject(gltf.scene)},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'K,L,N'})}).catch(()=>{});
        // #endregion
        
        console.log('Model loaded successfully');
        console.log('Available animations:', gltf.animations.map(a => a.name));
        
        const loadedModel = gltf.scene;
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/8c83c568-9d4c-4d90-b85b-618686995722',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Character.tsx:38',message:'Before setModel',data:{modelType:loadedModel.type,hasChildren:loadedModel.children.length>0},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'K,N'})}).catch(()=>{});
        // #endregion
        
        setModel(loadedModel);

        // Setup animation mixer
        if (gltf.animations && gltf.animations.length > 0) {
          const animMixer = new AnimationMixer(loadedModel);
          mixer.current = animMixer;

          // Play the first animation (Idle)
          const clip = gltf.animations[0];
          const animAction = animMixer.clipAction(clip);
          animAction.play();
          setAction(animAction);
          
          console.log('Playing animation:', clip.name);
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/8c83c568-9d4c-4d90-b85b-618686995722',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Character.tsx:57',message:'Animation setup complete',data:{animationName:clip.name,duration:clip.duration},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'K'})}).catch(()=>{});
          // #endregion
        }
      },
      (progress) => {
        // #region agent log
        const percent = (progress.loaded / progress.total * 100).toFixed(0);
        fetch('http://127.0.0.1:7242/ingest/8c83c568-9d4c-4d90-b85b-618686995722',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Character.tsx:66',message:'Loading progress',data:{percent:percent,loaded:progress.loaded,total:progress.total},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'K'})}).catch(()=>{});
        // #endregion
        console.log('Loading:', percent + '%');
      },
      (error) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/8c83c568-9d4c-4d90-b85b-618686995722',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Character.tsx:72',message:'ERROR loading model',data:{error:error.message||String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'K,O'})}).catch(()=>{});
        // #endregion
        console.error('Error loading model:', error);
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
  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });
  
  // #region agent log
  useEffect(() => {
    if (model) {
      fetch('http://127.0.0.1:7242/ingest/8c83c568-9d4c-4d90-b85b-618686995722',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Character.tsx:95',message:'Model state set, should render',data:{hasModel:!!model,position:position.toArray(),scale:0.01,groupAttached:!!group.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'L,M,N'})}).catch(()=>{});
    }
  }, [model, position]);
  // #endregion

  if (!model) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8c83c568-9d4c-4d90-b85b-618686995722',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Character.tsx:103',message:'Rendering null - no model loaded yet',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'K'})}).catch(()=>{});
    // #endregion
    return null; // Or return a loading placeholder
  }

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/8c83c568-9d4c-4d90-b85b-618686995722',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Character.tsx:110',message:'Rendering character group',data:{position:position.toArray(),scale:0.01},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'L,M'})}).catch(()=>{});
  // #endregion

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

