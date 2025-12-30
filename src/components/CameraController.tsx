import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  target: THREE.Vector3;
  offset?: THREE.Vector3;
  smoothness?: number;
}

export const CameraController = ({ 
  target, 
  offset = new THREE.Vector3(5, 5, 10),
  smoothness = 0.1 
}: CameraControllerProps): null => {
  const { camera } = useThree();
  const currentPosition = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  useFrame(() => {
    // Calculate desired camera position (player position + offset)
    const desiredPosition = new THREE.Vector3(
      target.x + offset.x,
      target.y + offset.y,
      target.z + offset.z
    );

    // Smoothly interpolate camera position
    currentPosition.current.lerp(desiredPosition, smoothness);
    camera.position.copy(currentPosition.current);

    // Smoothly look at the player
    currentLookAt.current.lerp(target, smoothness);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};