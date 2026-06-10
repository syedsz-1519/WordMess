import { Key } from './Key';
import { LetterState } from '../../utils/evaluateGuess';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  results: LetterState[][];
  guesses: string[];
}

export const Keyboard = ({ onKeyPress, results, guesses }: KeyboardProps) => {
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const keyStates: Record<string, LetterState> = {};
  
  guesses.forEach((guess, i) => {
    guess.split('').forEach((letter, j) => {
      const result = results[i][j];
      const current = keyStates[letter];
      
      if (result === 'correct') {
        keyStates[letter] = 'correct';
      } else if (result === 'present' && current !== 'correct') {
        keyStates[letter] = 'present';
      } else if (result === 'absent' && current !== 'correct' && current !== 'present') {
        keyStates[letter] = 'absent';
      }
    });
  });

  return (
    <div className="w-full max-w-[500px] mx-auto px-2 mt-8 flex flex-col gap-2">
      {keys.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 sm:gap-2">
          {row.map((key) => (
            <Key key={key} value={key} state={keyStates[key]} onClick={onKeyPress} />
          ))}
        </div>
      ))}
    </div>
  );
};
