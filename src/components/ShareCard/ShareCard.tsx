import { forwardRef } from 'react';
import type { LetterState } from '../../utils/evaluateGuess';

interface ShareCardProps {
  guesses: LetterState[][];
  targetWord: string;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ guesses }, ref) => {
  return (
    <div 
      ref={ref} 
      className="w-[1080px] h-[1080px] bg-[var(--wm-bg-dark)] flex flex-col items-center justify-center absolute -left-[9999px]"
    >
      <h1 className="text-8xl font-black tracking-widest mb-20 text-white">
        WORD <span className="text-[#3B6D11]">MESS</span>
      </h1>
      
      <div className="flex flex-col gap-4 mb-20">
        {guesses.map((row, i) => (
          <div key={i} className="flex gap-4">
            {row.map((state, j) => {
              const bg = state === 'correct' ? '#3B6D11' : state === 'present' ? '#854F0B' : '#3a3a3c';
              return (
                <div key={j} className="w-24 h-24 rounded border-4 border-[#3a3a3c]" style={{ backgroundColor: bg }} />
              );
            })}
          </div>
        ))}
      </div>

      <p className="text-4xl text-gray-400 font-bold tracking-widest">
        wordmess.in
      </p>
    </div>
  );
});
