import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { WordSearchLevel } from './campaignData';
import { useCharacterEmotions } from '../hooks/useCharacterEmotions';
import { Confetti } from '../engine/Confetti';
import { Star, ArrowLeft, Coins, Timer as TimerIcon } from 'lucide-react';

interface WordSearchProps {
  levelData: WordSearchLevel;
  onComplete: () => void;
  onBack: () => void;
}

const HIGHLIGHT_COLORS = [
  'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
  'bg-orange-500/30 border-orange-400 text-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.2)]',
  'bg-sky-500/30 border-sky-400 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.2)]',
  'bg-purple-500/30 border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
  'bg-pink-500/30 border-pink-400 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.2)]',
  'bg-yellow-500/30 border-yellow-400 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.2)]',
  'bg-indigo-500/30 border-indigo-400 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
];

export const WordSearch = ({ levelData, onComplete, onBack }: WordSearchProps) => {
  const { coins, addCoins } = useUserStore();
  const emotions = useCharacterEmotions();

  // Gameplay State
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [solvedPaths, setSolvedPaths] = useState<{ word: string; cells: { r: number; c: number }[]; colorClass: string }[]>([]);
  const [startCell, setStartCell] = useState<{ r: number; c: number } | null>(null);
  const [hoverCell, setHoverCell] = useState<{ r: number; c: number } | null>(null);
  const [selectedCells, setSelectedCells] = useState<{ r: number; c: number }[]>([]);
  const [speechText, setSpeechText] = useState(`Level ${levelData.level}: Find all hidden words!`);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [isBonusEligible, setIsBonusEligible] = useState(true);

  // Restart/Reset on levelData change
  useEffect(() => {
    setFoundWords([]);
    setSolvedPaths([]);
    setStartCell(null);
    setHoverCell(null);
    setSelectedCells([]);
    setSpeechText(`Category: ${levelData.category}. Spot all ${levelData.targetWords.length} words!`);
    setGameStatus('playing');
    setSecondsLeft(120);
    setIsBonusEligible(true);
  }, [levelData]);

  // Timer loop
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setIsBonusEligible(false);
          return 0;
        }
        if (s <= 15) {
          emotions.onPanic();
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStatus, emotions]);

  // Helper to trace path between two points (straight lines only)
  const getLineCells = (start: { r: number; c: number }, end: { r: number; c: number }) => {
    const cells: { r: number; c: number }[] = [];
    const dr = end.r - start.r;
    const dc = end.c - start.c;
    
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    if (steps === 0) return [start];

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
    emotions.onKeyPress();

    if (!startCell) {
      setStartCell({ r, c });
      setHoverCell({ r, c });
      setSelectedCells([{ r, c }]);
    } else {
      const line = getLineCells(startCell, { r, c });
      if (line.length > 0) {
        const word = line.map(cell => levelData.grid[cell.r][cell.c]).join('');
        const revWord = [...word].reverse().join('');
        
        let matchedWord = '';
        if (levelData.targetWords.includes(word) && !foundWords.includes(word)) {
          matchedWord = word;
        } else if (levelData.targetWords.includes(revWord) && !foundWords.includes(revWord)) {
          matchedWord = revWord;
        }

        if (matchedWord) {
          const newFound = [...foundWords, matchedWord];
          const colorClass = HIGHLIGHT_COLORS[solvedPaths.length % HIGHLIGHT_COLORS.length];
          const newPath = { word: matchedWord, cells: line, colorClass };
          
          setFoundWords(newFound);
          setSolvedPaths([...solvedPaths, newPath]);
          emotions.onCorrect(matchedWord);
          addCoins(10);
          setSpeechText(`Awesome! Found "${matchedWord}"! 🥳`);

          if (newFound.length === levelData.targetWords.length) {
            setGameStatus('won');
            emotions.onWin(matchedWord);
            
            // Pro users timer bonus check
            const bonus = isBonusEligible ? 30 : 0;
            if (bonus > 0) {
              addCoins(bonus);
              setSpeechText(`Victory! Completed in time! Bonus +${bonus} coins! 🎉`);
            } else {
              setSpeechText(`Victory! All words found! 🎉`);
            }
          }
        } else {
          emotions.onIncorrect();
          setSpeechText('No match! Try selecting a different line. 🧐');
        }
      } else {
        emotions.onInvalid();
      }
      setStartCell(null);
      setHoverCell(null);
      setSelectedCells([]);
    }
  };

  const handleCellHover = (r: number, c: number) => {
    if (startCell && gameStatus === 'playing') {
      setHoverCell({ r, c });
      const line = getLineCells(startCell, { r, c });
      if (line.length > 0) {
        setSelectedCells(line);
      }
    }
  };

  const getCellStateClass = (r: number, c: number) => {
    // 1. Check if cell is in active selection
    const isSelected = selectedCells.some(cell => cell.r === r && cell.c === c);
    if (isSelected) {
      return 'bg-amber-400 border border-amber-300 text-sky-950 scale-105 shadow-md shadow-amber-400/30';
    }

    // 2. Check if cell is part of any solved paths
    for (const path of solvedPaths) {
      if (path.cells.some(cell => cell.r === r && cell.c === c)) {
        return path.colorClass;
      }
    }

    return 'bg-white/10 hover:bg-white/20 text-white border border-white/5 active:scale-95';
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-lg mx-auto min-h-screen text-white select-none px-4 relative">
      <Confetti active={gameStatus === 'won'} word={levelData.targetWords[0] || 'WIN'} />

      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
        <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-black tracking-widest text-[10px] uppercase text-sky-300">Level {levelData.level}</span>
          <span className="text-xs text-white/60 font-semibold">{levelData.category}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-bold text-sky-300 bg-sky-500/20 px-2.5 py-1 rounded-xl border border-sky-500/30 text-xs">
            <TimerIcon size={14} className={secondsLeft < 20 ? 'text-rose-400 animate-pulse' : ''} />
            <span className={secondsLeft < 20 ? 'text-rose-400 font-black' : ''}>{secondsLeft}s</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-yellow-300 bg-yellow-500/20 px-2.5 py-1 rounded-xl border border-yellow-500/30 text-xs">
            <Coins size={14} className="animate-bounce" />
            <span>{coins}</span>
          </div>
        </div>
      </div>

      {/* Bubble Info */}
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-center text-xs font-semibold my-2 text-white/90">
        {speechText}
      </div>

      {/* Word Search Grid Container */}
      <div 
        className="w-full aspect-square max-w-[340px] bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-3.5 shadow-2xl relative flex flex-col gap-1 select-none"
      >
        {levelData.grid.map((row, rIdx) => (
          <div key={rIdx} className="flex-1 flex gap-1">
            {row.map((char, cIdx) => (
              <button
                key={cIdx}
                onMouseDown={() => handleCellClick(rIdx, cIdx)}
                onTouchStart={() => handleCellClick(rIdx, cIdx)}
                onMouseEnter={() => handleCellHover(rIdx, cIdx)}
                className={`flex-1 aspect-square rounded-lg font-black text-xs sm:text-sm flex items-center justify-center transition-all ${getCellStateClass(rIdx, cIdx)}`}
              >
                {char}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Targets List */}
      <div className="w-full mt-4 flex-1 flex flex-col justify-end">
        <div className="text-[10px] uppercase font-black tracking-widest text-sky-200/80 mb-2 text-center">
          Words to Find ({foundWords.length}/{levelData.targetWords.length})
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 max-h-36 overflow-y-auto pb-4">
          {levelData.targetWords.map((word) => {
            const isSolved = foundWords.includes(word);
            return (
              <span
                key={word}
                className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1.5 rounded-full border transition-all ${
                  isSolved
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 line-through decoration-2 opacity-50'
                    : 'bg-white/5 text-white/90 border-white/10 hover:border-white/30'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Victory Footer Control */}
      {gameStatus === 'won' && (
        <button
          onClick={onComplete}
          className="w-full max-w-xs py-3 bg-[var(--wm-correct)] text-[var(--wm-bg)] rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[var(--wm-correct)]/30 hover:scale-105 transition-transform my-3"
        >
          Next Level
        </button>
      )}
    </div>
  );
};

export default WordSearch;
