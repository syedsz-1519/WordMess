import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AchievementStore {
  unlockedIds: string[];
  unlockAchievement: (id: string) => boolean; // returns true if newly unlocked
  hasAchievement: (id: string) => boolean;
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      unlockedIds: [],
      
      unlockAchievement: (id: string) => {
        const { unlockedIds } = get();
        if (unlockedIds.includes(id)) return false;
        
        set({ unlockedIds: [...unlockedIds, id] });
        return true;
      },
      
      hasAchievement: (id: string) => {
        return get().unlockedIds.includes(id);
      }
    }),
    {
      name: 'wordmess-achievements-storage',
    }
  )
);
