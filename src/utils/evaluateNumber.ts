import { LetterState } from './evaluateGuess';

export const evaluateNumber = (guess: string, target: string): LetterState[] => {
  const result: LetterState[] = Array(5).fill('absent');
  const targetDigits = target.split('');
  const guessDigits = guess.split('');

  // Pass 1: find exact matches
  guessDigits.forEach((digit, i) => {
    if (targetDigits[i] === digit) {
      result[i] = 'correct';
      targetDigits[i] = '#'; // mark as used
    }
  });

  // Pass 2: find present matches
  guessDigits.forEach((digit, i) => {
    if (result[i] !== 'correct' && targetDigits.includes(digit)) {
      result[i] = 'present';
      targetDigits[targetDigits.indexOf(digit)] = '#'; // mark as used
    }
  });

  return result;
};
