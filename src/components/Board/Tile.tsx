import { motion } from 'framer-motion';
import { LetterState } from '../../utils/evaluateGuess';

interface TileProps {
  letter: string;
  state: LetterState;
  isCompleted: boolean;
  position: number;
}

export const Tile = ({ letter, state, isCompleted, position }: TileProps) => {
  const getColors = () => {
    switch (state) {
      case 'correct': return 'bg-[var(--wm-correct)] text-[var(--wm-text)] border-[var(--wm-correct)]';
      case 'present': return 'bg-[var(--wm-present)] text-[var(--wm-text)] border-[var(--wm-present)]';
      case 'absent': return 'bg-[var(--wm-absent)] text-[var(--wm-text)] border-[var(--wm-absent)]';
      default: return letter ? 'border-gray-500' : 'border-[var(--wm-border)]';
    }
  };

  return (
    <motion.div
      initial={false}
      animate={
        isCompleted
          ? { rotateX: [0, 90, 0] }
          : letter
          ? { scale: [1, 1.08, 1] }
          : {}
      }
      transition={{
        duration: isCompleted ? 0.3 : 0.1,
        delay: isCompleted ? position * 0.08 : 0,
      }}
      className={`w-12 h-12 md:w-[62px] md:h-[62px] border-2 flex items-center justify-center text-2xl md:text-3xl font-bold uppercase rounded ${getColors()}`}
    >
      <motion.span
        initial={false}
        animate={{ opacity: isCompleted ? [1, 0, 1] : 1 }}
        transition={{ duration: 0.3, delay: position * 0.08 }}
      >
        {letter}
      </motion.span>
    </motion.div>
  );
};
