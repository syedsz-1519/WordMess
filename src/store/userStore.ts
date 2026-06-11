import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlanTier } from '../constants/plans';
import { syncUserStats } from '../lib/firebase';
import { GameId } from '../constants/games';

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
  levels: Record<GameId, number>; // Tracks level 1-1000 for each game
  coins: number;
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
  nextLevel: (gameId: GameId) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
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
  levels: {
    classic: 1,
    double: 1,
    quad: 1,
    speed: 1,
    reverse: 1,
    number: 1,
    duel: 1,
    ai: 1
  },
  coins: 100
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
        const history = [entry, ...state.history].slice(0, 100);
        return { history };
      }),
      
      toggleHaptic: () => set((state) => ({ isHapticEnabled: !state.isHapticEnabled })),
      
      setNotifTime: (notifTime) => set({ notifTime }),
      
      setTheme: (theme) => set({ theme }),

      nextLevel: (gameId) => set((state) => {
        const current = state.levels[gameId] || 1;
        // Cap at 1000 levels
        const next = Math.min(1000, current + 1);
        return {
          levels: { ...state.levels, [gameId]: next }
        };
      }),

      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),

      spendCoins: (amount) => {
        const state = get();
        if (state.coins >= amount) {
          set({ coins: state.coins - amount });
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
