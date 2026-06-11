import React, { useState } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { GameId } from '../constants/games';
import { StatsModal } from '../components/Modals/StatsModal';
import { SettingsModal } from '../components/Modals/SettingsModal';
import { ParticleCanvas } from '../themes/ParticleCanvas';

export const Game = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  
  const [activeModal, setActiveModal] = useState<'stats' | 'settings' | null>(null);

  const handleGameSelect = (newGameId: GameId) => {
    navigate(`/game/${newGameId}`);
  };

  const currentMode = (gameId as GameId) || 'classic';

  return (
    <div className="min-h-screen bg-[var(--wm-bg)] text-[var(--wm-text)] flex flex-col relative overflow-hidden">
      {/* Mode-specific ambient backdrop particles */}
      <ParticleCanvas modeId={currentMode} />

      <Header 
        currentGameId={currentMode}
        onGameSelect={handleGameSelect}
        onOpenStats={() => setActiveModal('stats')}
        onOpenSettings={() => setActiveModal('settings')}
      />
      
      <main className="flex-1 relative overflow-hidden flex flex-col z-10">
        <Outlet />
      </main>

      <StatsModal isOpen={activeModal === 'stats'} onClose={() => setActiveModal(null)} />
      <SettingsModal isOpen={activeModal === 'settings'} onClose={() => setActiveModal(null)} />
    </div>
  );
};

export default Game;
