import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LetterState } from '../utils/evaluateGuess';

// We make this flexible enough to support multiple boards (e.g. Double/Quad)
export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  guesses: string[]; // actual string guesses
  results: LetterState[][];
  status: GameStatus;
  hardMode: boolean;
  startTime: number | null;
}

export interface GameStore extends GameState {
  addGuess: (guess: string, result: LetterState[]) => void;
  setStatus: (status: GameStatus) => void;
  resetGame: () => void;
  setHardMode: (enabled: boolean) => void;
}

const initialState: GameState = {
  guesses: [],
  results: [],
  status: 'playing',
  hardMode: false,
  startTime: null,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      addGuess: (guess, result) => set((state) => {
        const isFirstGuess = state.guesses.length === 0;
        return {
          guesses: [...state.guesses, guess],
          results: [...state.results, result],
          startTime: isFirstGuess ? Date.now() : state.startTime
        };
      }),
      
      setStatus: (status) => set({ status }),
      
      resetGame: () => set((state) => ({ 
        ...initialState, 
        hardMode: state.hardMode // preserve hardmode setting across resets
      })),
      
      setHardMode: (hardMode) => set({ hardMode }),
    }),
    {
      name: 'wordmess-game-storage',
    }
  )
);
