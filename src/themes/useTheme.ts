import { useEffect } from 'react';
import { THEME_CONFIGS } from './themeConfig';
import { AmbientParticles } from '../engine/particles';

let globalParticles: AmbientParticles | null = null;

export const useTheme = (modeId: string, canvasRef?: React.RefObject<HTMLCanvasElement | null>) => {
  useEffect(() => {
    // Apply CSS Custom Variables to :root
    const config = THEME_CONFIGS[modeId] || THEME_CONFIGS.hub;
    const root = document.documentElement;
    root.style.setProperty('--wm-bg-start', config.start);
    root.style.setProperty('--wm-wm-bg-mid', config.mid); // backwards compat
    root.style.setProperty('--wm-bg-mid', config.mid);
    root.style.setProperty('--wm-bg-end', config.end);

    // Initialize or Update Particles Canvas
    if (canvasRef && canvasRef.current) {
      if (!globalParticles) {
        globalParticles = new AmbientParticles(canvasRef.current);
      }
      globalParticles.setType(config.particleType);
      globalParticles.start();
    }

    return () => {
      // We don't stop it immediately to allow smooth transitions,
      // but we will clean up if unmounting the entire app
    };
  }, [modeId, canvasRef]);

  const setMode = (mode: string) => {
    const config = THEME_CONFIGS[mode] || THEME_CONFIGS.hub;
    const root = document.documentElement;
    root.style.setProperty('--wm-bg-start', config.start);
    root.style.setProperty('--wm-bg-mid', config.mid);
    root.style.setProperty('--wm-bg-end', config.end);
    if (globalParticles) {
      globalParticles.setType(config.particleType);
    }
  };

  return { setMode };
};

export default useTheme;
