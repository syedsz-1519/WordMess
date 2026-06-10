import React, { useState } from 'react';
import { Flame, Settings, BarChart2 } from 'lucide-react';
import { useStreak } from '../../hooks/useStreak';
import { GameSwitcher } from './GameSwitcher';
import { GameId } from '../../constants/games';

interface HeaderProps {
  currentGameId: GameId;
  onGameSelect: (id: GameId) => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

export const Header = ({ currentGameId, onGameSelect, onOpenStats, onOpenSettings }: HeaderProps) => {
  const { streak } = useStreak();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  return (
    <header className="h-[var(--header-height)] border-b border-[var(--wm-border)] flex items-center justify-between px-4 relative z-30">
      <div className="flex items-center gap-4">
        <GameSwitcher 
          currentGameId={currentGameId} 
          onSelect={onGameSelect}
          isOpen={isSwitcherOpen}
          setIsOpen={setIsSwitcherOpen}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 font-bold text-orange-500">
          <Flame size={18} />
          <span>{streak}</span>
        </div>
        
        <button onClick={onOpenStats} className="text-[var(--wm-text-muted)] hover:text-white transition-colors">
          <BarChart2 size={20} />
        </button>
        
        <button onClick={onOpenSettings} className="text-[var(--wm-text-muted)] hover:text-white transition-colors">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};
