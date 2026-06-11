import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WordmarkLogo } from '../assets/logos/WordmarkLogo';
import { GAMES, GameId } from '../constants/games';
import { FeatureGate } from '../constants/plans';
import { useSubscription } from '../hooks/useSubscription';
import { useUserStore } from '../store/userStore';
import { Badge } from '../components/UI/Badge';
import { SettingsModal } from '../components/Modals/SettingsModal';
import { StatsModal } from '../components/Modals/StatsModal';
import { AchievementsModal } from '../components/Modals/AchievementsModal';
import { ProModal } from '../components/Modals/ProModal';
import { LevelArena } from '../components/Modals/LevelArena';
import { Lock, Settings, BarChart2, Trophy, Flame, User, Globe } from 'lucide-react';
import { ParticleCanvas } from '../themes/ParticleCanvas';

export const Hub = () => {
  const navigate = useNavigate();
  const { canAccess } = useSubscription();
  const { streak, levels } = useUserStore();

  const [activeModal, setActiveModal] = useState<'settings' | 'stats' | 'achievements' | 'pro' | 'arena' | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);

  const handleGameClick = (game: any) => {
    if (!canAccess(game.id as FeatureGate)) {
      setActiveModal('pro');
    } else {
      setSelectedGame(game.id as GameId);
      setActiveModal('arena');
    }
  };

  const handleLevelSelect = (level: number) => {
    if (selectedGame) {
      navigate(`/game/${selectedGame}?level=${level}`);
    }
  };

  const currentCampaignLevel = localStorage.getItem('wm-campaign-level') || '1';

  return (
    <div className="min-h-screen bg-[var(--wm-bg)] text-[var(--wm-text)] p-4 sm:p-8 flex flex-col max-w-4xl mx-auto relative overflow-hidden">
      {/* Background stars */}
      <ParticleCanvas modeId="hub" />

      {/* Header */}
      <header className="flex justify-between items-center mb-10 z-10">
        <WordmarkLogo />
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/profile')} className="text-[var(--wm-text-muted)] hover:text-white transition-colors" title="Profile & Badges">
            <User size={20} />
          </button>
          <button onClick={() => navigate('/leaderboard')} className="text-[var(--wm-text-muted)] hover:text-white transition-colors" title="Leaderboard">
            <Globe size={20} />
          </button>
          <button onClick={() => setActiveModal('stats')} className="text-[var(--wm-text-muted)] hover:text-white transition-colors" title="Stats">
            <BarChart2 size={20} />
          </button>
          <button onClick={() => setActiveModal('settings')} className="text-[var(--wm-text-muted)] hover:text-white transition-colors" title="Settings">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-1 font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
            <Flame size={18} />
            <span>{streak}</span>
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 z-10">
        {/* Campaign Map Card */}
        <div 
          onClick={() => navigate('/campaign')}
          className="relative border border-emerald-500/30 bg-emerald-950/20 p-6 rounded-xl flex flex-col gap-3 transition-all cursor-pointer hover:border-emerald-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg text-2xl">
              🗺️
            </div>
            <Badge label="Campaign" variant="plus" />
          </div>
          
          <div>
            <h3 className="font-bold text-lg tracking-widest uppercase flex items-center gap-2 text-emerald-400">
              Campaign Map
            </h3>
            <p className="text-xs text-[var(--wm-text-muted)] mt-1">Journey across 1,000 unique levels of Word Search & Word Connect!</p>
          </div>

          <div className="mt-auto pt-4 border-t border-[var(--wm-border)] flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--wm-text-muted)]">Adventure progress</span>
            <span className="text-sm font-bold text-[var(--wm-correct)]">Level {currentCampaignLevel} / 1000</span>
          </div>
        </div>

        {GAMES.map(game => {
          const isLocked = !canAccess(game.id as FeatureGate);
          const currentLevel = levels[game.id as GameId] || 1;
          
          return (
            <div 
              key={game.id}
              onClick={() => handleGameClick(game)}
              className={`relative border border-[var(--wm-border)] bg-[var(--wm-surface)] p-6 rounded-xl flex flex-col gap-3 transition-all cursor-pointer ${
                isLocked ? 'opacity-70 hover:opacity-80 grayscale-[50%]' : 'hover:border-[var(--wm-correct)] hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--wm-correct)]/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-[var(--wm-border)] rounded-lg text-2xl">
                  {game.icon}
                </div>
                {game.tier !== 'free' && (
                  <Badge label={game.tier} variant={game.tier as any} />
                )}
              </div>
              
              <div>
                <h3 className="font-bold text-lg tracking-widest uppercase flex items-center gap-2">
                  {game.name}
                  {isLocked && <Lock size={14} className="text-[var(--wm-text-muted)]" />}
                </h3>
                <p className="text-xs text-[var(--wm-text-muted)] mt-1">{game.description}</p>
              </div>

              {!isLocked && (
                <div className="mt-auto pt-4 border-t border-[var(--wm-border)] flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--wm-text-muted)]">Progress</span>
                  <span className="text-sm font-bold text-[var(--wm-correct)]">Level {currentLevel}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <SettingsModal isOpen={activeModal === 'settings'} onClose={() => setActiveModal(null)} />
      <StatsModal isOpen={activeModal === 'stats'} onClose={() => setActiveModal(null)} />
      <AchievementsModal isOpen={activeModal === 'achievements'} onClose={() => setActiveModal(null)} />
      <ProModal isOpen={activeModal === 'pro'} onClose={() => setActiveModal(null)} />
      
      {selectedGame && (
        <LevelArena 
          isOpen={activeModal === 'arena'} 
          onClose={() => setActiveModal(null)} 
          gameId={selectedGame}
          onSelectLevel={handleLevelSelect}
        />
      )}
    </div>
  );
};
