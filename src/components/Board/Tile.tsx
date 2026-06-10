import React from 'react';
import { motion } from 'framer-motion';
import { LetterState } from '../../utils/evaluateGuess';

interface TileProps {
  letter?: string;
  state?: LetterState;
  delay?: number;
}

export const Tile = ({ letter, state = 'empty', delay = 0 }: TileProps) => {
  const isFilled = letter && letter !== '';
  const isRevealed = state !== 'empty';

  const variants = {
    empty: 'border-2 border-[var(--wm-border)] bg-transparent text-transparent',
    tbd: 'border-2 border-[var(--wm-text-muted)] bg-transparent text-[var(--wm-text)]',
    absent: 'border-2 border-[var(--wm-absent)] bg-[var(--wm-absent)] text-white',
    present: 'border-2 border-[var(--wm-present)] bg-[var(--wm-present)] text-white',
    correct: 'border-2 border-[var(--wm-correct)] bg-[var(--wm-correct)] text-white',
  };

  const currentState = isRevealed ? state : (isFilled ? 'tbd' : 'empty');

  return (
    <motion.div
      initial={false}
      animate={isRevealed ? { rotateX: [0, 90, 0] } : (isFilled ? { scale: [1, 1.08, 1] } : {})}
      transition={
        isRevealed 
          ? { duration: 0.5, delay, times: [0, 0.5, 1] } 
          : { duration: 0.1 }
      }
      className={`w-[var(--tile-size-mobile)] h-[var(--tile-size-mobile)] sm:w-[var(--tile-size-desktop)] sm:h-[var(--tile-size-desktop)] flex items-center justify-center text-3xl font-bold uppercase rounded-[var(--tile-radius)] ${variants[currentState]}`}
    >
      <motion.span
        animate={isRevealed ? { opacity: [1, 0, 1] } : {}}
        transition={{ duration: 0.5, delay, times: [0, 0.5, 1] }}
      >
        {letter}
      </motion.span>
    </motion.div>
  );
};
