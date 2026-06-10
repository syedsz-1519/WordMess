import { motion } from 'framer-motion';
import { Tile } from './Tile';
import { LetterState } from '../../utils/evaluateGuess';

interface RowProps {
  guess: string;
  result?: LetterState[];
  isCurrent?: boolean;
  isInvalid?: boolean;
}

export const Row = ({ guess, result, isCurrent, isInvalid }: RowProps) => {
  const letters = guess.padEnd(5, ' ').split('');
  const defaultResult: LetterState[] = Array(5).fill('empty');

  return (
    <motion.div
      animate={isInvalid ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="flex gap-1 md:gap-[5px] mb-1 md:mb-[6px] justify-center"
    >
      {letters.map((letter, i) => (
        <Tile
          key={i}
          letter={letter === ' ' ? '' : letter}
          state={result ? result[i] : defaultResult[i]}
          isCompleted={!!result}
          position={i}
        />
      ))}
    </motion.div>
  );
};
