export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export const evaluateGuess = (guess: string, target: string): LetterState[] => {
  const result: LetterState[] = Array(5).fill('absent');
  const targetLetters = target.split('');
  const guessLetters = guess.split('');

  // Pass 1: find exact matches
  guessLetters.forEach((letter, i) => {
    if (targetLetters[i] === letter) {
      result[i] = 'correct';
      targetLetters[i] = '#'; // mark as used
    }
  });

  // Pass 2: find present matches
  guessLetters.forEach((letter, i) => {
    if (result[i] !== 'correct' && targetLetters.includes(letter)) {
      result[i] = 'present';
      targetLetters[targetLetters.indexOf(letter)] = '#'; // mark as used
    }
  });

  return result;
};
