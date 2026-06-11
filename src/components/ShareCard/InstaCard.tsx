import React, { useRef } from 'react';
import { Button } from '../UI/Button';
import { generateInstaCard } from '../../utils/canvasShare';
import { LetterState } from '../../utils/evaluateGuess';

interface ShareCardProps {
  gameName: string;
  level: number;
  guesses: LetterState[][];
  hardMode: boolean;
  isWon: boolean;
}

export const InstaCard = ({ gameName, level, guesses, hardMode, isWon }: ShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const EMOJI_MAP: Record<LetterState, string> = {
    correct: 'bg-[var(--wm-correct)]',
    present: 'bg-[var(--wm-present)]',
    absent: 'bg-[var(--wm-absent)]',
    empty: 'bg-transparent',
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const dataUrl = await generateInstaCard('insta-share-card');
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `wordmess-${gameName}-level${level}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        id="insta-share-card"
        ref={cardRef}
        className="w-[300px] h-[300px] bg-[#121213] p-6 flex flex-col justify-between items-center text-white relative border border-[#3a3a3c]"
      >
        <div className="font-black text-2xl tracking-widest flex items-center">
          <span>WORD</span><span className="text-[#4ade80] ml-1">MESS</span>
        </div>
        
        <div className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">
          {gameName} Lvl {level}
        </div>

        <div className="flex flex-col gap-1 mb-6">
          {guesses.map((row, i) => (
            <div key={i} className="flex gap-1">
              {row.map((state, j) => (
                <div key={j} className={`w-8 h-8 rounded-sm ${EMOJI_MAP[state]}`} />
              ))}
            </div>
          ))}
        </div>

        <div className="text-[#818384] text-[10px] font-bold tracking-widest">
          wordmess.in
        </div>
      </div>
      
      <Button variant="primary" onClick={handleDownload} className="mt-4 w-[300px]">
        Download for Instagram
      </Button>
    </div>
  );
};
