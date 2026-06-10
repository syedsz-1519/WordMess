import { useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { getDailyWord } from '../utils/dailyWord';
import { evaluateGuess, isValidWord, validateHardMode } from '../utils/evaluateGuess';
import { WORDS } from '../utils/wordList';

export const useGame = () => {
  const { 
    guesses, 
    results, 
    currentGuess, 
    status, 
    hardMode, 
    addGuess, 
    setCurrentGuess, 
    practiceMode,
  } = useGameStore();

  const targetWord = useMemo(() => {
    return practiceMode 
      ? WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase() 
      : getDailyWord();
  }, [practiceMode, guesses.length === 0]); // only recalculate target when starting new practice

  const onKeyPress = useCallback((key: string) => {
    if (status !== 'playing') return;

    if (key === 'Enter') {
      if (currentGuess.length !== 5) return;
      
      if (!isValidWord(currentGuess, WORDS)) {
        alert('Not in word list');
        return;
      }

      if (hardMode && guesses.length > 0) {
        const prevGuess = guesses[guesses.length - 1];
        const prevResult = results[results.length - 1];
        const { valid, message } = validateHardMode(currentGuess, prevGuess, prevResult);
        if (!valid) {
          alert(message);
          return;
        }
      }

      const result = evaluateGuess(currentGuess, targetWord);
      addGuess(currentGuess, result);
    } else if (key === 'Backspace') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key);
    }
  }, [currentGuess, status, hardMode, guesses, results, targetWord, addGuess, setCurrentGuess]);

  return {
    guesses,
    results,
    currentGuess,
    status,
    onKeyPress,
    targetWord
  };
};
