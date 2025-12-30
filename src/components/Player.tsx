import { useMovement } from '../hooks/useMovement';
import { Character } from './Character';
import { CameraController } from './CameraController';

export const Player = () => {
  const position = useMovement(0.1);

  return (
    <>
      <Character position={position} />
      <CameraController target={position} />
    </>
  );
};

