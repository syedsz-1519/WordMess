import React from 'react';
import { Key } from './Key';
import { LetterState } from '../../utils/evaluateGuess';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  results: LetterState[][];
  guesses: string[];
}

const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
];

export const Keyboard = ({ onKeyPress, results, guesses }: KeyboardProps) => {
  const charStatuses: Record<string, LetterState> = {};

  guesses.forEach((guess, i) => {
    guess.split('').forEach((letter, j) => {
      const currentStatus = charStatuses[letter];
      const newStatus = results[i]?.[j];
      
      if (!newStatus) return;
      
      if (newStatus === 'correct') {
        charStatuses[letter] = 'correct';
      } else if (newStatus === 'present' && currentStatus !== 'correct') {
        charStatuses[letter] = 'present';
      } else if (newStatus === 'absent' && currentStatus !== 'correct' && currentStatus !== 'present') {
        charStatuses[letter] = 'absent';
      }
    });
  });

  return (
    <div className="w-full max-w-[var(--max-keyboard-width)] mx-auto px-2 pb-4 flex flex-col gap-2">
      {KEYS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5 sm:gap-2">
          {i === 1 && <div className="flex-[0.5]"></div>}
          {row.map((key) => (
            <Key
              key={key}
              value={key}
              onClick={onKeyPress}
              status={charStatuses[key] || 'empty'}
              flex={key.length > 1 ? 1.5 : 1}
            />
          ))}
          {i === 1 && <div className="flex-[0.5]"></div>}
        </div>
      ))}
    </div>
  );
};
