import React from 'react';
import { GAMES, GameId } from '../../constants/games';
import { useSubscription } from '../../hooks/useSubscription';
import { FeatureGate } from '../../constants/plans';
import { Lock } from 'lucide-react';

interface GameSwitcherProps {
  currentGameId: GameId;
  onSelect: (id: GameId) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const GameSwitcher = ({ currentGameId, onSelect, isOpen, setIsOpen }: GameSwitcherProps) => {
  const { canAccess } = useSubscription();

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--wm-surface)] border border-[var(--wm-border)] hover:bg-[var(--wm-border)] transition-colors"
      >
        <span className="font-bold text-sm tracking-widest">
          {GAMES.find(g => g.id === currentGameId)?.name.toUpperCase()}
        </span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-56 bg-[var(--wm-surface)] border border-[var(--wm-border)] rounded-md shadow-xl z-50 overflow-hidden">
            {GAMES.map(game => {
              const access = canAccess(game.id as FeatureGate);
              return (
                <button
                  key={game.id}
                  onClick={() => {
                    if (access) {
                      onSelect(game.id as GameId);
                      setIsOpen(false);
                    } else {
                      // Trigger Pro Modal
                      alert(`Unlock ${game.tier.toUpperCase()} to play this game!`);
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                    currentGameId === game.id ? 'bg-[var(--wm-border)]' : 'hover:bg-[var(--wm-border)]'
                  } ${!access ? 'opacity-50' : ''}`}
                >
                  <span className="font-semibold text-sm tracking-wider">{game.name.toUpperCase()}</span>
                  {!access && <Lock size={14} className="text-[var(--wm-text-muted)]" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
