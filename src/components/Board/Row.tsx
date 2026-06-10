import React from 'react';
import { motion } from 'framer-motion';
import { Tile } from './Tile';
import { LetterState } from '../../utils/evaluateGuess';

interface RowProps {
  guess: string;
  result?: LetterState[];
  isInvalid?: boolean;
}

export const Row = ({ guess, result, isInvalid = false }: RowProps) => {
  const letters = guess.split('').concat(Array(5 - guess.length).fill(''));

  return (
    <motion.div 
      className="flex gap-[var(--tile-gap)] justify-center"
      animate={isInvalid ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {letters.map((letter, i) => (
        <Tile 
          key={i} 
          letter={letter} 
          state={result?.[i]} 
          delay={result ? i * 0.1 : 0} 
        />
      ))}
    </motion.div>
  );
};
