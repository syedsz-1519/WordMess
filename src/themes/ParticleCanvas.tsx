import React, { useRef } from 'react';
import { useTheme } from './useTheme';

interface ParticleCanvasProps {
  modeId: string;
}

export const ParticleCanvas = ({ modeId }: ParticleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useTheme(modeId, canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[-1] w-full h-full"
    />
  );
};

export default ParticleCanvas;
