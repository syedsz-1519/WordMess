import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { SEARCH_LEVELS } from '../../constants/levels';
import { playClick, playSuccess, playFailure, playWin } from '../../utils/audio';
import { Button } from '../../components/UI/Button';
import { ResultModal } from '../../components/Modals/ResultModal';
import { Volume2, VolumeX, ArrowLeft, Coins, Star } from 'lucide-react';

export const ClassicGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawLevel = parseInt(searchParams.get('level') || '1', 10);
  // Loop levels if they exceed available levels
  const levelIndex = (rawLevel - 1) % SEARCH_LEVELS.length;
  const levelData = SEARCH_LEVELS[levelIndex];

  const { coins, addCoins, spendCoins, nextLevel } = useUserStore();

  // Audio mute state
  const [isMuted, setIsMuted] = useState(false);

  // Gameplay State
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [startCell, setStartCell] = useState<{ r: number; c: number } | null>(null);
  const [endCell, setEndCell] = useState<{ r: number; c: number } | null>(null);
  const [selectedCells, setSelectedCells] = useState<{ r: number; c: number }[]>([]);
  const [catSpeech, setCatSpeech] = useState('Welcome to the Beach! Find all the hidden words!');
  const [showResult, setShowResult] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // Reset state on level change
  useEffect(() => {
    setFoundWords([]);
    setStartCell(null);
    setEndCell(null);
    setSelectedCells([]);
    setCatSpeech('Can you find all the beach words? Drag or tap start & end tiles!');
    setGameStatus('playing');
    setShowResult(false);
  }, [rawLevel]);

  // Helper to trace path between two points
  const getLineCells = (start: { r: number; c: number }, end: { r: number; c: number }) => {
    const cells: { r: number; c: number }[] = [];
    const dr = end.r - start.r;
    const dc = end.c - start.c;
    
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    if (steps === 0) return [start];

    // Check if path is straight (horizontal, vertical, or 45-deg diagonal)
    const isHorizontal = dr === 0;
    const isVertical = dc === 0;
    const isDiagonal = Math.abs(dr) === Math.abs(dc);

    if (!isHorizontal && !isVertical && !isDiagonal) return [];

    const stepR = dr / steps;
    const stepC = dc / steps;

    for (let i = 0; i <= steps; i++) {
      cells.push({
        r: Math.round(start.r + i * stepR),
        c: Math.round(start.c + i * stepC)
      });
    }
    return cells;
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameStatus !== 'playing') return;
    if (!isMuted) playClick();

    if (!startCell) {
      setStartCell({ r, c });
      setSelectedCells([{ r, c }]);
    } else if (!endCell) {
      const line = getLineCells(startCell, { r, c });
      if (line.length > 0) {
        // Evaluate the word spelled by the path
        const word = line.map(cell => levelData.grid[cell.r][cell.c]).join('');
        const revWord = [...word].reverse().join('');
        
        let matchedWord = '';
        if (levelData.targetWords.includes(word) && !foundWords.includes(word)) {
          matchedWord = word;
        } else if (levelData.targetWords.includes(revWord) && !foundWords.includes(revWord)) {
          matchedWord = revWord;
        }

        if (matchedWord) {
          // Success!
          const newFound = [...foundWords, matchedWord];
          setFoundWords(newFound);
          if (!isMuted) playSuccess();
          addCoins(10);
          setCatSpeech(`OMG! You found ${matchedWord}! Keep it up! 🥳`);
          
          if (newFound.length === levelData.targetWords.length) {
            setGameStatus('won');
            if (!isMuted) playWin();
            setTimeout(() => setShowResult(true), 800);
          }
        } else {
          // Failure
          if (!isMuted) playFailure();
          setCatSpeech('No luck! Try selecting a different line! 🧐');
        }
      }
      // Reset selection
      setStartCell(null);
      setSelectedCells([]);
    }
  };

  const handleHoverCell = (r: number, c: number) => {
    if (startCell && !endCell) {
      const line = getLineCells(startCell, { r, c });
      if (line.length > 0) {
        setSelectedCells(line);
      }
    }
  };

  const isCellSelected = (r: number, c: number) => {
    return selectedCells.some(cell => cell.r === r && cell.c === c);
  };

  // Helper to check if a cell is part of an already found word
  // For simplicity, we check if the letter is in any of the found words (visual highlight)
  const isCellPartOFAlreadyFoundWord = (r: number, c: number) => {
    // This is optional but looks beautiful
    return false;
  };

  const handleNextLevel = () => {
    nextLevel('classic');
    navigate(`/game/classic?level=${rawLevel + 1}`);
  };

  const handleRestart = () => {
    setFoundWords([]);
    setStartCell(null);
    setEndCell(null);
    setSelectedCells([]);
    setCatSpeech('Let\'s restart! Spot those beach words!');
    setGameStatus('playing');
    setShowResult(false);
  };

  // Calculate completion stars
  const percentSolved = foundWords.length / levelData.targetWords.length;
  const starsCount = percentSolved === 1 ? 3 : percentSolved >= 0.6 ? 2 : percentSolved >= 0.3 ? 1 : 0;

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-lg mx-auto beach-background min-h-screen text-white select-none px-4">
      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
        <button onClick={() => navigate('/')} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-1.5">
          <span className="font-black tracking-widest text-sm uppercase">Level {rawLevel}</span>
          <div className="flex gap-0.5 text-yellow-300">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star key={i} size={14} fill={i < starsCount ? 'currentColor' : 'none'} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 bg-white/10 rounded-xl hover:scale-105 active:scale-95 transition-transform">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="flex items-center gap-1 font-bold text-yellow-300 bg-yellow-500/20 px-2.5 py-1 rounded-xl border border-yellow-500/30">
            <Coins size={16} className="animate-bounce" />
            <span className="text-xs">{coins}</span>
          </div>
        </div>
      </div>

      {/* Guide Cat thought bubble & Cat */}
      <div className="w-full flex gap-3 items-center my-3 max-w-sm">
        <div className="flex-1 bg-white text-slate-800 rounded-2xl p-2.5 text-xs font-semibold relative shadow-lg shadow-black/10 border-2 border-sky-300">
          <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white border-r-2 border-b-2 border-sky-300 rotate-45 transform -translate-y-1/2"></div>
          {catSpeech}
        </div>
        <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-4xl animate-float">
          🐈‍⬛
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="w-full max-w-[340px] aspect-square bg-sky-950/40 backdrop-blur-md border border-white/20 rounded-3xl p-3 shadow-2xl relative overflow-hidden flex flex-col gap-1 select-none">
        {levelData.grid.map((row, rIdx) => (
          <div key={rIdx} className="flex-1 flex gap-1">
            {row.map((char, cIdx) => {
              const isSelected = isCellSelected(rIdx, cIdx);
              return (
                <button
                  key={cIdx}
                  onMouseDown={() => handleCellClick(rIdx, cIdx)}
                  onTouchStart={() => handleCellClick(rIdx, cIdx)}
                  onMouseEnter={() => handleHoverCell(rIdx, cIdx)}
                  className={`flex-1 aspect-square rounded-lg font-black text-sm flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-amber-400 border border-amber-300 text-sky-950 scale-105 shadow-md shadow-amber-400/30'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/5 active:scale-95'
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Targets List */}
      <div className="w-full mt-4 flex-1 flex flex-col justify-end">
        <div className="text-[10px] uppercase font-black tracking-widest text-sky-200/80 mb-2 text-center">Words to Find ({foundWords.length}/{levelData.targetWords.length})</div>
        <div className="flex flex-wrap justify-center gap-1.5 max-h-36 overflow-y-auto pb-4">
          {levelData.targetWords.map((word) => {
            const isSolved = foundWords.includes(word);
            return (
              <span
                key={word}
                className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1.5 rounded-full border transition-all ${
                  isSolved
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 line-through decoration-2 opacity-60'
                    : 'bg-white/5 text-white/90 border-white/10 hover:border-white/30'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      <ResultModal 
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        status={gameStatus}
        guesses={[]}
        targetWord={`all beach words solved!`}
        hardMode={false}
        gameId="classic"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
