import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlanTier } from '../constants/plans';
import { syncUserStats } from '../lib/firebase';

export interface GameHistory {
  date: string;
  gameId: string;
  word: string;
  guesses: number;
  result: 'won' | 'lost';
  timeMs?: number;
}

export interface UserState {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  plan: PlanTier;
  streak: number;
  bestStreak: number;
  totalSolved: number;
  streakShieldUsed: boolean;
  isHapticEnabled: boolean;
  history: GameHistory[];
  notifTime: string;
  theme: string;
}

interface UserActions {
  setUser: (data: Partial<UserState>) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  useShield: () => boolean;
  addHistory: (entry: GameHistory) => void;
  toggleHaptic: () => void;
  setNotifTime: (time: string) => void;
  setTheme: (theme: string) => void;
}

const initialState: UserState = {
  uid: null,
  displayName: null,
  email: null,
  plan: 'free',
  streak: 0,
  bestStreak: 0,
  totalSolved: 0,
  streakShieldUsed: false,
  isHapticEnabled: false,
  history: [],
  notifTime: '08:00',
  theme: 'dark',
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setUser: (data) => set((state) => ({ ...state, ...data })),
      
      incrementStreak: () => set((state) => {
        const newStreak = state.streak + 1;
        const updates = {
          streak: newStreak,
          bestStreak: Math.max(state.bestStreak, newStreak),
          totalSolved: state.totalSolved + 1
        };
        
        if (state.uid) syncUserStats(state.uid, updates);
        return updates;
      }),
      
      resetStreak: () => set((state) => {
        if (state.plan !== 'free' && !state.streakShieldUsed) {
          if (state.uid) syncUserStats(state.uid, { streakShieldUsed: true });
          return { streakShieldUsed: true };
        }
        if (state.uid) syncUserStats(state.uid, { streak: 0 });
        return { streak: 0 };
      }),
      
      useShield: () => {
        const state = get();
        if (state.plan !== 'free' && !state.streakShieldUsed) {
          set({ streakShieldUsed: true });
          if (state.uid) syncUserStats(state.uid, { streakShieldUsed: true });
          return true;
        }
        return false;
      },
      
      addHistory: (entry) => set((state) => {
        // Keep last 100 games
        const history = [entry, ...state.history].slice(0, 100);
        return { history };
      }),
      
      toggleHaptic: () => set((state) => ({ isHapticEnabled: !state.isHapticEnabled })),
      
      setNotifTime: (notifTime) => set({ notifTime }),
      
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'wordmess-user-storage',
    }
  )
);
