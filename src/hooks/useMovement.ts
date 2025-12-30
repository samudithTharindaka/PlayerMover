import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface MovementState {
  position: THREE.Vector3;
  isMoving: boolean;
  isRunning: boolean;
}

export const useMovement = (walkSpeed: number = 0.1, runSpeed: number = 0.25) => {
  const [state, setState] = useState<MovementState>({
    position: new THREE.Vector3(0, 0.5, 0),
    isMoving: false,
    isRunning: false,
  });
  
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const keys = keysPressed.current;
    const newPosition = state.position.clone();
    
    // Check if Shift is pressed for running
    const isRunning = keys.has('shift');
    const speed = isRunning ? runSpeed : walkSpeed;
    
    let moved = false;

    // Forward/Backward
    if (keys.has('w') || keys.has('arrowup')) {
      newPosition.z -= speed;
      moved = true;
    }
    if (keys.has('s') || keys.has('arrowdown')) {
      newPosition.z += speed;
      moved = true;
    }

    // Left/Right
    if (keys.has('a') || keys.has('arrowleft')) {
      newPosition.x -= speed;
      moved = true;
    }
    if (keys.has('d') || keys.has('arrowright')) {
      newPosition.x += speed;
      moved = true;
    }

    // Update state if anything changed
    const stateChanged = 
      !newPosition.equals(state.position) || 
      moved !== state.isMoving || 
      (moved && isRunning) !== state.isRunning;

    if (stateChanged) {
      setState({
        position: newPosition,
        isMoving: moved,
        isRunning: moved && isRunning,
      });
    }
  });

  return state;
};


