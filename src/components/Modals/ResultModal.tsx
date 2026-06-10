import { motion } from 'framer-motion';
import type { LetterState } from '../../utils/evaluateGuess';
import { generateShareText } from '../../utils/shareResult';

interface ResultModalProps {
  status: 'won' | 'lost';
  guesses: LetterState[][];
  targetWord: string;
  hardMode: boolean;
  onClose: () => void;
}

export const ResultModal = ({ status, guesses, targetWord, hardMode, onClose }: ResultModalProps) => {
  const handleShare = () => {
    const text = generateShareText(guesses, status === 'won', hardMode);
    if (navigator.share) {
      navigator.share({
        title: 'WORDMESS Result',
        text: text
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--wm-surface)] p-6 rounded-lg text-center max-w-sm w-full border border-[var(--wm-border)]"
      >
        <h2 className="text-3xl font-black mb-2 uppercase">
          {status === 'won' ? 'Magnificent!' : 'Game Over'}
        </h2>
        <p className="text-gray-300 mb-6 text-lg">The word was: <strong className="text-white tracking-widest">{targetWord}</strong></p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleShare}
            className="w-full bg-[var(--wm-correct)] text-[var(--wm-bg-dark)] py-3 rounded font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Share Result
          </button>
          <button 
            onClick={onClose}
            className="w-full border border-[var(--wm-border)] text-white py-3 rounded font-bold uppercase tracking-wider hover:bg-[var(--wm-border)] transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
