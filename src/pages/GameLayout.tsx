import React, { useState } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { GameId } from '../constants/games';
import { StatsModal } from '../components/Modals/StatsModal';
import { SettingsModal } from '../components/Modals/SettingsModal';

export const GameLayout = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  
  const [activeModal, setActiveModal] = useState<'stats' | 'settings' | null>(null);

  const handleGameSelect = (newGameId: GameId) => {
    navigate(`/game/${newGameId}`);
  };

  return (
    <div className="min-h-screen bg-[var(--wm-bg)] text-[var(--wm-text)] flex flex-col">
      <Header 
        currentGameId={(gameId as GameId) || 'classic'}
        onGameSelect={handleGameSelect}
        onOpenStats={() => setActiveModal('stats')}
        onOpenSettings={() => setActiveModal('settings')}
      />
      
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <Outlet />
      </main>

      <StatsModal isOpen={activeModal === 'stats'} onClose={() => setActiveModal(null)} />
      <SettingsModal isOpen={activeModal === 'settings'} onClose={() => setActiveModal(null)} />
    </div>
  );
};
