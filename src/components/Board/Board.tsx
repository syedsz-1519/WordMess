import { Row } from './Row';
import type { LetterState } from '../../utils/evaluateGuess';

interface BoardProps {
  guesses: string[];
  results: LetterState[][];
  currentGuess: string;
  isInvalid: boolean;
}

export const Board = ({ guesses, results, currentGuess, isInvalid }: BoardProps) => {
  const empties = guesses.length < 5 ? Array(5 - guesses.length).fill('') : [];

  return (
    <div className="flex flex-col items-center max-w-[350px] mx-auto">
      {guesses.map((guess, i) => (
        <Row key={i} guess={guess} result={results[i]} />
      ))}
      
      {guesses.length < 6 && (
        <Row guess={currentGuess} isCurrent isInvalid={isInvalid} />
      )}
      
      {empties.map((_, i) => (
        <Row key={`empty-${i}`} guess="" />
      ))}
    </div>
  );
};
