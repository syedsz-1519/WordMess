export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export const evaluateGuess = (guess: string, target: string): LetterState[] => {
  const result: LetterState[] = Array(5).fill('absent');
  const targetLetters = target.toUpperCase().split('');
  const guessLetters = guess.toUpperCase().split('');

  // Pass 1: find correct letters
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = 'correct';
      targetLetters[i] = null as any; // Mark as used
      guessLetters[i] = null as any; // Mark as processed
    }
  }

  // Pass 2: find present letters
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] !== null && targetLetters.includes(guessLetters[i])) {
      result[i] = 'present';
      const index = targetLetters.indexOf(guessLetters[i]);
      targetLetters[index] = null as any; // Mark as used
    }
  }

  return result;
};

export const isValidWord = (word: string, wordList: string[]): boolean => {
  return wordList.includes(word.toLowerCase());
};

export const validateHardMode = (
  guess: string,
  previousGuess: string,
  previousResult: LetterState[]
): { valid: boolean; message?: string } => {
  const guessLetters = guess.toUpperCase().split('');
  const prevLetters = previousGuess.toUpperCase().split('');

  // Green letters must be reused in same position
  for (let i = 0; i < 5; i++) {
    if (previousResult[i] === 'correct' && guessLetters[i] !== prevLetters[i]) {
      return { valid: false, message: `Must use ${prevLetters[i]} in position ${i + 1}` };
    }
  }

  // Yellow letters must appear somewhere
  for (let i = 0; i < 5; i++) {
    if (previousResult[i] === 'present' && !guessLetters.includes(prevLetters[i])) {
      return { valid: false, message: `Guess must contain ${prevLetters[i]}` };
    }
  }

  return { valid: true };
};
