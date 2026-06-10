import React from 'react';
import { Modal } from '../UI/Modal';
import { useUserStore } from '../../store/userStore';
import { GameId } from '../../constants/games';

interface LevelArenaProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: GameId;
  onSelectLevel: (level: number) => void;
}

export const LevelArena = ({ isOpen, onClose, gameId, onSelectLevel }: LevelArenaProps) => {
  const { levels } = useUserStore();
  const maxUnlocked = levels[gameId] || 1;

  // Render 1000 levels
  // We'll chunk them into pages or just a scrollable grid
  const levelsArray = Array.from({ length: 1000 }, (_, i) => i + 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Level Arena">
      <div className="flex flex-col h-[60vh]">
        <p className="text-center text-[var(--wm-text-muted)] text-sm mb-4 uppercase font-bold tracking-widest">
          {gameId} mode
        </p>
        
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-4 sm:grid-cols-5 gap-3 pb-4">
          {levelsArray.map(level => {
            const isUnlocked = level <= maxUnlocked;
            const isCompleted = level < maxUnlocked;
            const isCurrent = level === maxUnlocked;

            let bgColor = 'bg-[var(--wm-border)] text-gray-500 opacity-50'; // locked
            if (isCompleted) bgColor = 'bg-[var(--wm-correct)] text-white';
            if (isCurrent) bgColor = 'bg-orange-500 text-white animate-pulse';

            return (
              <button
                key={level}
                disabled={!isUnlocked}
                onClick={() => {
                  onSelectLevel(level);
                  onClose();
                }}
                className={`aspect-square rounded flex items-center justify-center font-bold text-sm sm:text-base transition-transform ${isUnlocked ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'} ${bgColor}`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
