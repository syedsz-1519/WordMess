import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaign } from './useCampaign';
import { LevelNode } from './LevelNode';
import { Wordy } from '../assets/characters/Wordy';
import { Messy } from '../assets/characters/Messy';
import { ArrowLeft, Coins } from 'lucide-react';
import { useUserStore } from '../store/userStore';

export const CampaignMap = () => {
  const navigate = useNavigate();
  const { currentLevel } = useCampaign();
  const { coins } = useUserStore();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Derive initial active section (30 levels per section)
  const initialSection = Math.ceil(currentLevel / 30);
  const [selectedSection, setSelectedSection] = useState<number>(initialSection);

  // Sync selected section with current level if it updates
  useEffect(() => {
    setSelectedSection(Math.ceil(currentLevel / 30));
  }, [currentLevel]);

  // Section level range boundaries
  const sectionStartLevel = (selectedSection - 1) * 30 + 1;
  const sectionEndLevel = Math.min(1000, selectedSection * 30);
  const levelsRange = Array.from(
    { length: sectionEndLevel - sectionStartLevel + 1 },
    (_, i) => sectionStartLevel + i
  );

  // Winding sine wave path coordinates relative to section starting level index
  const getCoordinates = (lvl: number) => {
    const localIndex = lvl - sectionStartLevel + 1;
    const x = localIndex * 120 - 60;
    const y = 140 + Math.sin(localIndex * 0.8) * 60;
    return { x, y };
  };

  // Determine theme zone name based on current level range
  const getZoneInfo = (lvl: number) => {
    if (lvl <= 100) return { name: 'Jungle Canopy', color: 'text-emerald-400', bg: 'from-emerald-950/20 to-teal-900/10' };
    if (lvl <= 200) return { name: 'Sunken Desert', color: 'text-amber-400', bg: 'from-amber-950/20 to-orange-950/10' };
    if (lvl <= 300) return { name: 'Coral Depths', color: 'text-sky-400', bg: 'from-sky-950/20 to-indigo-950/10' };
    if (lvl <= 400) return { name: 'Neon Caverns', color: 'text-purple-400', bg: 'from-purple-950/20 to-fuchsia-950/10' };
    if (lvl <= 500) return { name: 'Frozen Peak', color: 'text-slate-400', bg: 'from-slate-800/20 to-zinc-900/10' };
    if (lvl <= 600) return { name: 'Word City', color: 'text-teal-400', bg: 'from-teal-950/20 to-cyan-900/10' };
    if (lvl <= 700) return { name: 'Cosmic Caverns', color: 'text-purple-400', bg: 'from-purple-950/20 to-violet-950/10' };
    if (lvl <= 800) return { name: 'Glacier Glade', color: 'text-cyan-400', bg: 'from-cyan-950/20 to-blue-900/10' };
    if (lvl <= 900) return { name: 'Lava Volcano', color: 'text-red-400', bg: 'from-red-950/20 to-orange-900/10' };
    return { name: 'Paradise Sky', color: 'text-indigo-400', bg: 'from-indigo-950/20 to-violet-950/10' };
  };

  const zone = getZoneInfo(sectionStartLevel);

  // Generate dotted path SVG connector data
  let pathD = '';
  levelsRange.forEach((lvl, idx) => {
    const { x, y } = getCoordinates(lvl);
    if (idx === 0) {
      pathD += `M ${x} ${y}`;
    } else {
      const prev = getCoordinates(levelsRange[idx - 1]);
      pathD += ` C ${prev.x + 60} ${prev.y}, ${x - 60} ${y}, ${x} ${y}`;
    }
  });

  // Auto scroll to current level node on load or section switch
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const isLevelInSection = currentLevel >= sectionStartLevel && currentLevel <= sectionEndLevel;
      const scrollLvl = isLevelInSection ? currentLevel : sectionStartLevel;
      const currentPos = getCoordinates(scrollLvl).x;
      container.scrollLeft = currentPos - window.innerWidth / 2 + 100;
    }
  }, [selectedSection, currentLevel]);

  const handleNodeClick = (lvl: number) => {
    navigate(`/game/campaign?level=${lvl}`);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#0a1628] via-[#065f46] to-[#0891b2] relative flex flex-col justify-between select-none">
      {/* Top Navbar */}
      <header className="w-full max-w-4xl mx-auto flex justify-between items-center p-4 z-10">
        <button
          onClick={() => navigate('/hub')}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 text-white transition-all active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-sky-300">Campaign Mode</span>
          <h1 className={`text-xl font-black uppercase tracking-wide ${zone.color}`}>
            {zone.name}
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 px-3 py-1.5 rounded-2xl text-yellow-300 font-bold">
          <Coins size={16} className="animate-bounce" />
          <span className="text-sm">{coins}</span>
        </div>
      </header>

      {/* Horizontal Section List */}
      <div className="flex gap-2 overflow-x-auto py-2 px-4 max-w-4xl mx-auto hide-scrollbar z-10 w-full justify-start sm:justify-center">
        {Array.from({ length: 34 }).map((_, i) => {
          const secNum = i + 1;
          const isActive = selectedSection === secNum;
          const isLocked = secNum > Math.ceil(currentLevel / 30);
          
          return (
            <button
              key={secNum}
              disabled={isLocked}
              onClick={() => setSelectedSection(secNum)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500 text-[#0a1628] border-emerald-400 font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : isLocked
                  ? 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed opacity-50'
                  : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/20'
              }`}
            >
              Sec {secNum} ({secNum * 30 - 29}-{Math.min(1000, secNum * 30)})
            </button>
          );
        })}
      </div>

      {/* Horizontally Scrollable SVG Trail */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 w-full overflow-x-auto overflow-y-hidden hide-scrollbar py-8 flex items-center relative"
      >
        <div 
          style={{ width: levelsRange.length * 120 + 200 }} 
          className="h-[320px] relative"
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Trail Path */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="6"
              strokeDasharray="10, 10"
            />
            {/* Active completed trail highlighting */}
            {currentLevel > sectionStartLevel && (
              <path
                d={pathD.split(' ').slice(0, Math.min(levelsRange.length, currentLevel - sectionStartLevel) * 8 + 3).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeDasharray="10, 10"
              />
            )}
          </svg>

          {/* Render Level Nodes */}
          {levelsRange.map((lvl) => {
            const { x, y } = getCoordinates(lvl);
            const status = lvl < currentLevel ? 'completed' : lvl === currentLevel ? 'current' : 'locked';

            return (
              <div 
                key={lvl}
                style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)' }}
              >
                <svg width="100" height="100" className="overflow-visible">
                  <LevelNode
                    level={lvl}
                    status={status}
                    x={50}
                    y={50}
                    onClick={() => handleNodeClick(lvl)}
                  />
                </svg>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Mascot Cheers */}
      <footer className="w-full max-w-lg mx-auto flex justify-between items-end px-8 pb-4 pointer-events-none">
        <div className="flex flex-col items-center gap-1">
          <Wordy emotion={currentLevel % 2 === 0 ? 'happy' : 'idle'} size={72} />
          <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">WORDY</span>
        </div>
        <div className="text-center text-xs text-white/50 pb-2">
          Levels 1-500: Word Search • Levels 501-1000: Anagram Connect
        </div>
        <div className="flex flex-col items-center gap-1">
          <Messy emotion={currentLevel % 3 === 0 ? 'laugh' : 'idle'} size={72} />
          <span className="text-[10px] font-black text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full border border-orange-500/20">MESSY</span>
        </div>
      </footer>
    </div>
  );
};

export default CampaignMap;
