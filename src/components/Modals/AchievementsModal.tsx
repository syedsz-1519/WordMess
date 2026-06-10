import React from 'react';
import { Modal } from '../UI/Modal';
import { ACHIEVEMENTS } from '../../constants/achievements';
import { useAchievements } from '../../hooks/useAchievements';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementsModal = ({ isOpen, onClose }: AchievementsModalProps) => {
  const { unlockedIds } = useAchievements();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Achievements">
      <div className="flex flex-col gap-4">
        <p className="text-center text-[var(--wm-text-muted)] text-sm mb-2">
          {unlockedIds.length} / {ACHIEVEMENTS.length} Unlocked
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map(achievement => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            return (
              <div 
                key={achievement.id}
                className={`p-3 rounded border flex items-center gap-3 transition-opacity ${
                  isUnlocked ? 'border-[var(--wm-correct)] bg-[var(--wm-correct)]/10 opacity-100' : 'border-[var(--wm-border)] opacity-40 grayscale'
                }`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <h4 className="font-bold text-sm leading-tight text-white">{achievement.name}</h4>
                  <p className="text-[10px] text-[var(--wm-text-muted)] leading-tight mt-1">{achievement.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
