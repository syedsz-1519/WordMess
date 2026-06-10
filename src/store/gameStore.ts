import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getDailyDateString } from '../utils/dailyWord';
import { LetterState } from '../utils/evaluateGuess';

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
    (set) => ({
      guesses: [],
      results: [],
      currentGuess: '',
      status: 'playing',
      hardMode: false,
      lastPlayedDate: getDailyDateString(),
      practiceMode: false,
      
      addGuess: (guess, result) => set((state) => {
        const newGuesses = [...state.guesses, guess];
        const newResults = [...state.results, result];
        let newStatus = state.status;
        
        const isWin = result.every(r => r === 'correct');
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
      
      setCurrentGuess: (guess) => set({ currentGuess: guess }),
      setHardMode: (enabled) => set({ hardMode: enabled }),
      setPracticeMode: (enabled) => set({ practiceMode: enabled }),
      resetGame: (isPractice) => set({
        guesses: [],
        results: [],
        currentGuess: '',
        status: 'playing',
        practiceMode: isPractice,
        lastPlayedDate: isPractice ? getDailyDateString() : getDailyDateString()
      }),
    }),
    {
      name: 'wordle-mess-game-storage',
      partialize: (state) => ({
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
