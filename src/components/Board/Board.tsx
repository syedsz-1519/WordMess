import React from 'react';
import { Row } from './Row';
import { LetterState } from '../../utils/evaluateGuess';

interface BoardProps {
  guesses: string[];
  results: LetterState[][];
  currentGuess: string;
  isInvalid?: boolean;
  maxGuesses?: number;
}

export const Board = ({ guesses, results, currentGuess, isInvalid = false, maxGuesses = 6 }: BoardProps) => {
  const empties = Math.max(0, maxGuesses - 1 - guesses.length);

  return (
    <div className="flex flex-col gap-[var(--row-gap)] items-center">
      {guesses.map((guess, i) => (
        <Row key={i} guess={guess} result={results[i]} />
      ))}
      
      {guesses.length < maxGuesses && (
        <Row guess={currentGuess} isInvalid={isInvalid} />
      )}
      
      {Array.from({ length: empties }).map((_, i) => (
        <Row key={`empty-${i}`} guess="" />
      ))}
    </div>
  );
};
