import { useEffect } from 'react';

export const useKeyboard = (onKeyPress: (key: string) => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const key = e.key;
      if (key === 'Enter' || key === 'Backspace') {
        onKeyPress(key);
      } else if (/^[a-zA-Z]$/.test(key)) {
        onKeyPress(key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);
};
