import { LetterState } from './evaluateGuess';

const EMOJI_MAP: Record<LetterState, string> = {
  correct: '🟩',
  present: '🟨',
  absent: '⬛',
  empty: '⬜',
};

export const generateShareText = (
  gameName: string,
  guesses: LetterState[][],
  isWon: boolean,
  hardMode: boolean = false
): string => {
  const attemptCount = isWon ? guesses.length : 'X';
  const header = `${gameName} ${attemptCount}/6${hardMode ? '*' : ''}\n\n`;
  
  const grid = guesses
    .map(row => row.map(state => EMOJI_MAP[state]).join(''))
    .join('\n');
    
  return `${header}${grid}\n\nwordle-mess.in`;
};
