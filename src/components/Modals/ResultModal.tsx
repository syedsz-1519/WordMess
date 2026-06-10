import React from 'react';
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

  const handleShare = () => {
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
      <div className="text-center">
        <p className="text-[var(--wm-text-muted)] mb-2 uppercase text-sm font-bold tracking-widest">
          Level {currentLevel}
        </p>
        <p className="text-gray-300 mb-6 text-lg">
          The word was: <strong className="text-white tracking-widest">{targetWord}</strong>
        </p>
        
        <div className="flex flex-col gap-3">
          {status === 'won' ? (
            <Button variant="primary" onClick={onNextLevel} fullWidth>
              Next Level ➔
            </Button>
          ) : (
            <Button variant="primary" onClick={onRestart} fullWidth>
              Restart Level ↻
            </Button>
          )}
          
          <Button variant="outline" onClick={handleShare} fullWidth>
            Share Result
          </Button>
          <Button variant="secondary" onClick={onClose} fullWidth>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
