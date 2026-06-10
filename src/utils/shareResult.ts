import { LetterState } from './evaluateGuess';

export const generateShareText = (
  guesses: LetterState[][],
  gameWon: boolean,
  hardMode: boolean
): string => {
  const numGuesses = gameWon ? guesses.length : 'X';
  const header = `WORDLE MESS · ${numGuesses}/6${hardMode ? '*' : ''} · wordle-mess.in\n\n`;
  
  const grid = guesses.map(row => {
    return row.map(state => {
      if (state === 'correct') return '🟩';
      if (state === 'present') return '🟨';
      return '⬜';
    }).join('');
  }).join('\n');
  
  return header + grid;
};
