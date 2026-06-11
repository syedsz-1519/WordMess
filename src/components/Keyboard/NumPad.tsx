import React from 'react';
import { Key } from './Key';
import { LetterState } from '../../utils/evaluateGuess';

interface NumPadProps {
  onKeyPress: (key: string) => void;
  results: LetterState[][];
  guesses: string[];
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['Enter', 'Backspace']
];

export const NumPad = ({ onKeyPress, results, guesses }: NumPadProps) => {
  const charStatuses: Record<string, LetterState> = {};

  // Track statuses of the keys
  guesses.forEach((guess, i) => {
    guess.split('').forEach((digit, j) => {
      const currentStatus = charStatuses[digit];
      const newStatus = results[i]?.[j];
      
      if (!newStatus) return;
      
      if (newStatus === 'correct') {
        charStatuses[digit] = 'correct';
      } else if (newStatus === 'present' && currentStatus !== 'correct') {
        charStatuses[digit] = 'present';
      } else if (newStatus === 'absent' && currentStatus !== 'correct' && currentStatus !== 'present') {
        charStatuses[digit] = 'absent';
      }
    });
  });

  return (
    <div className="w-full max-w-[320px] mx-auto px-2 pb-4 flex flex-col gap-2 z-10">
      {KEYS.map((row, i) => (
        <div key={i} className="flex justify-center gap-2">
          {row.map((key) => (
            <Key
              key={key}
              value={key}
              onClick={onKeyPress}
              status={charStatuses[key] || 'empty'}
              flex={key.length > 1 ? 1.5 : 1}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default NumPad;
