import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

export const useKeyboard = (onKeyPress: (key: string) => void) => {
  const { isHapticEnabled } = useUserStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const key = e.key;
      if (key === 'Enter' || key === 'Backspace') {
        triggerHaptic();
        onKeyPress(key);
      } else if (/^[a-zA-Z0-9]$/.test(key)) {
        triggerHaptic();
        onKeyPress(key.toUpperCase());
      }
    };

    const triggerHaptic = () => {
      if (isHapticEnabled && navigator.vibrate) {
        navigator.vibrate(50);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress, isHapticEnabled]);
};
