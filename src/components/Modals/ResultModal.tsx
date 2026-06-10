import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { LetterState } from '../../utils/evaluateGuess';
import { generateShareText } from '../../utils/shareResult';
import { useUserStore } from '../../store/userStore';
import { GameId } from '../../constants/games';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'won' | 'lost';
  guesses: LetterState[][];
  targetWord: string;
  hardMode: boolean;
  gameId: GameId;
  onRestart: () => void;
  onNextLevel: () => void;
}

export const ResultModal = ({ 
  isOpen, onClose, status, guesses, targetWord, hardMode, gameId, onRestart, onNextLevel 
}: ResultModalProps) => {
  const { levels } = useUserStore();
  const currentLevel = levels[gameId] || 1;
  const nextLevelNumber = status === 'won' ? currentLevel + 1 : currentLevel;
  
  const [timeLeft, setTimeLeft] = useState(3);
  const [autoAdvancePaused, setAutoAdvancePaused] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(3);
      setAutoAdvancePaused(false);
      return;
    }

    if (autoAdvancePaused) return;

    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      // Auto-advance when time is up
      if (status === 'won') {
        onNextLevel();
      } else {
        onRestart();
      }
    }
  }, [isOpen, timeLeft, autoAdvancePaused, status, onNextLevel, onRestart]);

  const handleShare = () => {
    setAutoAdvancePaused(true);
    const text = generateShareText(`WORDLE MESS Level ${currentLevel}`, guesses, status === 'won', hardMode);
    if (navigator.share) {
      navigator.share({
        title: 'WORDLE MESS Result',
        text: text
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={status === 'won' ? 'Magnificent!' : 'Game Over'}>
      <div className="text-center flex flex-col items-center">
        <p className="text-[var(--wm-text-muted)] mb-2 uppercase text-sm font-bold tracking-widest">
          Level {currentLevel} Completed
        </p>
        <p className="text-gray-300 mb-6 text-lg">
          The word was: <strong className="text-white tracking-widest">{targetWord}</strong>
        </p>
        
        {/* Circle Timer */}
        {!autoAdvancePaused && (
          <div className="relative w-20 h-20 mb-6 cursor-pointer group" onClick={() => setAutoAdvancePaused(true)} title="Click to pause auto-advance">
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="40" cy="40" r="36" 
                className="stroke-[var(--wm-border)] fill-transparent" 
                strokeWidth="4" 
              />
              <motion.circle 
                cx="40" cy="40" r="36" 
                className={`fill-transparent ${status === 'won' ? 'stroke-[var(--wm-correct)]' : 'stroke-[var(--wm-absent)]'}`}
                strokeWidth="4"
                strokeDasharray="226" // 2 * Math.PI * 36
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: 226 }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl group-hover:hidden">
              {timeLeft}
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase font-bold text-[var(--wm-text-muted)] opacity-0 group-hover:opacity-100">
              Pause
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-3 w-full">
          {status === 'won' ? (
            <Button variant="primary" onClick={onNextLevel} fullWidth>
              Start Level {nextLevelNumber} ➔
            </Button>
          ) : (
            <Button variant="primary" onClick={onRestart} fullWidth>
              Restart Level {nextLevelNumber} ↻
            </Button>
          )}
          
          <Button variant="outline" onClick={handleShare} fullWidth>
            Share Result
          </Button>
          <Button variant="secondary" onClick={() => { setAutoAdvancePaused(true); onClose(); }} fullWidth>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
