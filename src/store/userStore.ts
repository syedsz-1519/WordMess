import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserPlan = 'free' | 'pro' | 'plus';

export interface UserData {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  plan: UserPlan;
  streak: number;
  bestStreak: number;
  totalSolved: number;
  streakShieldUsed: boolean;
}

export interface UserStore extends UserData {
  setUser: (data: Partial<UserData>) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  useShield: () => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set: any, get: any) => ({
      uid: null as string | null,
      displayName: null as string | null,
      email: null as string | null,
      plan: 'free' as UserPlan,
      streak: 0,
      bestStreak: 0,
      totalSolved: 0,
      streakShieldUsed: false as boolean,
      
      setUser: (data: any) => set((state: any) => ({ ...state, ...data })),
      incrementStreak: () => set((state: any) => {
        const newStreak = state.streak + 1;
        return {
          streak: newStreak,
          bestStreak: Math.max(state.bestStreak, newStreak),
          totalSolved: state.totalSolved + 1
        };
      }),
      resetStreak: () => set((state: any) => {
        if (state.plan !== 'free' && !state.streakShieldUsed) {
          // Auto use shield
          return { streakShieldUsed: true };
        }
        return { streak: 0 };
      }),
      useShield: () => {
        const state = get();
        if (state.plan !== 'free' && !state.streakShieldUsed) {
          set({ streakShieldUsed: true });
          return true;
        }
        return false;
      }
    }),
    {
      name: 'wordmess-user-storage',
    }
  )
);
