import { useEffect } from 'react';
import { useAchievementStore } from '../store/achievementStore';
import { useUserStore } from '../store/userStore';

export const useAchievements = () => {
  const { unlockAchievement, hasAchievement, unlockedIds } = useAchievementStore();
  const { totalSolved, streak, history } = useUserStore();

  // Passive achievement checks
  useEffect(() => {
    if (totalSolved === 1) unlockAchievement('first_blood');
    if (streak >= 30) unlockAchievement('iron_streak');
    
    // Check Genius (1 guess win)
    const hasGenius = history.some(h => h.result === 'won' && h.guesses === 1);
    if (hasGenius) unlockAchievement('genius');

  }, [totalSolved, streak, history, unlockAchievement]);

  const triggerAchievement = (id: string) => {
    const wasNew = unlockAchievement(id);
    if (wasNew) {
      // In a real app, fire a toast notification here
      console.log(`Unlocked Achievement: ${id}!`);
    }
  };

  return {
    unlockedIds,
    hasAchievement,
    triggerAchievement
  };
};
