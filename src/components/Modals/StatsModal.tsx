import React from 'react';
import { Modal } from '../UI/Modal';
import { useStats } from '../../hooks/useStats';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal = ({ isOpen, onClose }: StatsModalProps) => {
  const { totalPlayed, winPercentage, guessDistribution, averageGuesses, recentHistory } = useStats();

  const maxDistribution = Math.max(...guessDistribution, 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Statistics">
      <div className="flex flex-col gap-6">
        
        {/* Top level stats */}
        <div className="flex justify-between text-center px-4">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{totalPlayed}</span>
            <span className="text-xs text-[var(--wm-text-muted)] uppercase">Played</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{winPercentage}</span>
            <span className="text-xs text-[var(--wm-text-muted)] uppercase">Win %</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{averageGuesses}</span>
            <span className="text-xs text-[var(--wm-text-muted)] uppercase">Avg Guesses</span>
          </div>
        </div>

        {/* Guess Distribution */}
        <div>
          <h3 className="font-bold uppercase tracking-wider mb-3 text-sm">Guess Distribution</h3>
          <div className="flex flex-col gap-1">
            {guessDistribution.map((count, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="w-3 text-right font-bold">{i + 1}</div>
                <div className="flex-1 bg-[var(--wm-border)] h-5 rounded overflow-hidden">
                  <div 
                    className={`h-full ${count > 0 ? 'bg-[var(--wm-correct)]' : 'bg-transparent'} flex items-center justify-end px-2 font-bold text-xs`}
                    style={{ width: `${(count / maxDistribution) * 100}%`, minWidth: count > 0 ? '8%' : '0' }}
                  >
                    {count > 0 && count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Performance (Last 10 games) */}
        <div>
          <h3 className="font-bold uppercase tracking-wider mb-3 text-sm">Recent Performance</h3>
          <div className="flex items-end gap-1 h-24 pt-4 border-b border-[var(--wm-border)]">
            {recentHistory.slice().reverse().map((game, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-1 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                  Level {game.word} ({game.guesses} guesses)
                </div>
                
                <div 
                  className={`w-full rounded-t-sm transition-all duration-300 ${game.result === 'won' ? 'bg-[var(--wm-correct)]' : 'bg-[var(--wm-absent)]'}`}
                  style={{ height: game.result === 'won' ? `${(game.guesses / 6) * 100}%` : '10%' }}
                />
              </div>
            ))}
            {recentHistory.length === 0 && (
              <div className="w-full text-center text-sm text-[var(--wm-text-muted)] pb-4">
                No games played yet.
              </div>
            )}
          </div>
          <div className="flex justify-between text-[10px] text-[var(--wm-text-muted)] mt-1 uppercase font-bold">
            <span>Older</span>
            <span>Newer</span>
          </div>
        </div>

      </div>
    </Modal>
  );
};
