import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getDailyDateString } from '../utils/dailyWord';
import type { LetterState } from '../utils/evaluateGuess';

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  guesses: string[];
  results: LetterState[][];
  currentGuess: string;
  status: GameStatus;
  hardMode: boolean;
  lastPlayedDate: string;
  practiceMode: boolean;
  
  addGuess: (guess: string, result: LetterState[]) => void;
  setCurrentGuess: (guess: string) => void;
  setHardMode: (enabled: boolean) => void;
  setPracticeMode: (enabled: boolean) => void;
  resetGame: (isPractice: boolean) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set: any) => ({
      guesses: [],
      results: [],
      currentGuess: '',
      status: 'playing',
      hardMode: false,
      lastPlayedDate: getDailyDateString(),
      practiceMode: false,
      
      addGuess: (guess: any, result: any) => set((state: any) => {
        const newGuesses = [...state.guesses, guess];
        const newResults = [...state.results, result];
        let newStatus = state.status;
        
        const isWin = result.every((r: any) => r === 'correct');
        if (isWin) {
          newStatus = 'won';
        } else if (newGuesses.length >= 6) {
          newStatus = 'lost';
        }
        
        return {
          guesses: newGuesses,
          results: newResults,
          currentGuess: '',
          status: newStatus,
          lastPlayedDate: state.practiceMode ? state.lastPlayedDate : getDailyDateString(),
        };
      }),
      
      setCurrentGuess: (guess: any) => set({ currentGuess: guess }),
      setHardMode: (enabled: any) => set({ hardMode: enabled }),
      setPracticeMode: (enabled: any) => set({ practiceMode: enabled }),
      resetGame: (isPractice: any) => set({
        guesses: [],
        results: [],
        currentGuess: '',
        status: 'playing',
        practiceMode: isPractice,
        lastPlayedDate: isPractice ? getDailyDateString() : getDailyDateString()
      }),
    }),
    {
      name: 'wordmess-game-storage',
      partialize: (state: any) => ({
        guesses: state.guesses,
        results: state.results,
        status: state.status,
        hardMode: state.hardMode,
        lastPlayedDate: state.lastPlayedDate,
        practiceMode: state.practiceMode
      })
    }
  )
);
