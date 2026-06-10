import React from 'react';
import { useUserStore } from '../../store/userStore';

interface KeyProps {
  value: string;
  status?: 'correct' | 'present' | 'absent' | 'empty';
  onClick: (value: string) => void;
  flex?: number;
}

export const Key = ({ value, status = 'empty', onClick, flex = 1 }: KeyProps) => {
  const { isHapticEnabled } = useUserStore();

  const handleClick = () => {
    if (isHapticEnabled && navigator.vibrate) {
      navigator.vibrate(50);
    }
    onClick(value);
  };

  const bgColors = {
    empty: 'bg-[var(--wm-border)] text-white hover:bg-gray-600',
    absent: 'bg-[var(--wm-absent)] text-white opacity-60',
    present: 'bg-[var(--wm-present)] text-white',
    correct: 'bg-[var(--wm-correct)] text-white',
  };

  return (
    <button
      onClick={handleClick}
      className={`${bgColors[status]} h-14 rounded flex items-center justify-center font-bold uppercase text-sm sm:text-base transition-colors`}
      style={{ flex }}
    >
      {value === 'Backspace' ? '⌫' : value === 'Enter' ? 'ENTER' : value}
    </button>
  );
};
