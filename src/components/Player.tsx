import { useMovement } from '../hooks/useMovement';
import { Character } from './Character';
import { CameraController } from './CameraController';

export const Player = () => {
  const { position, isMoving, isRunning } = useMovement(0.1, 0.25);

  return (
    <>
      <Character 
        position={position} 
        isMoving={isMoving}
        isRunning={isRunning}
      />
      <CameraController target={position} />
    </>
  );
};

