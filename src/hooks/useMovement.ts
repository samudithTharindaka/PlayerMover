import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const useMovement = (speed: number = 0.1) => {
  const [position, setPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0.5, 0));
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
    const newPosition = position.clone();

    // Forward/Backward (W/S or ArrowUp/ArrowDown)
    if (keys.has('w') || keys.has('arrowup')) {
      newPosition.z -= speed;
    }
    if (keys.has('s') || keys.has('arrowdown')) {
      newPosition.z += speed;
    }

    // Left/Right (A/D or ArrowLeft/ArrowRight)
    if (keys.has('a') || keys.has('arrowleft')) {
      newPosition.x -= speed;
    }
    if (keys.has('d') || keys.has('arrowright')) {
      newPosition.x += speed;
    }

    // Only update if position changed
    if (!newPosition.equals(position)) {
      setPosition(newPosition);
    }
  });

  return position;
};

