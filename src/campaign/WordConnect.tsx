import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { AnagramLevel } from './campaignData';
import { useCharacterEmotions } from '../hooks/useCharacterEmotions';
import { Confetti } from '../engine/Confetti';
import { Star, ArrowLeft, Coins, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WordConnectProps {
  levelData: AnagramLevel;
  onComplete: () => void;
  onBack: () => void;
}

export const WordConnect = ({ levelData, onComplete, onBack }: WordConnectProps) => {
  const { coins, addCoins } = useUserStore();
  const emotions = useCharacterEmotions();

  // Gameplay State
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [speechText, setSpeechText] = useState(`Level ${levelData.level}: Connect letters to form words!`);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');

  // Shuffle letters helper
  const shuffleArray = (arr: string[]) => {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    setFoundWords([]);
    setSelectedIndices([]);
    setShuffledLetters(shuffleArray(levelData.bigWord.split('')));
    setSpeechText(`Form words of 3+ letters. Can you find all ${levelData.targetWords.length} words?`);
    setGameStatus('playing');
  }, [levelData]);

  const currentInputWord = selectedIndices.map((idx) => shuffledLetters[idx]).join('');

  // Calculate coordinates for circle wheel
  const wheelRadius = 110;
  const cx = 150;
  const cy = 150;

  const getLetterCoords = (idx: number) => {
    const angle = (idx * 2 * Math.PI) / shuffledLetters.length - Math.PI / 2;
    const x = cx + wheelRadius * Math.cos(angle);
    const y = cy + wheelRadius * Math.sin(angle);
    return { x, y };
  };

  const handleLetterClick = (idx: number) => {
    if (gameStatus !== 'playing') return;
    emotions.onKeyPress();

    const clickedPos = selectedIndices.indexOf(idx);
    if (clickedPos !== -1) {
      // If clicked, and it's the last selected letter, deselect it
      if (clickedPos === selectedIndices.length - 1) {
        setSelectedIndices((prev) => prev.slice(0, -1));
      }
    } else {
      setSelectedIndices((prev) => [...prev, idx]);
    }
  };

  const handleShuffle = () => {
    emotions.onKeyPress();
    setShuffledLetters(shuffleArray(shuffledLetters));
    setSelectedIndices([]);
  };

  const handleClear = () => {
    emotions.onKeyPress();
    setSelectedIndices([]);
  };

  const handleSubmit = () => {
    if (gameStatus !== 'playing') return;
    if (currentInputWord.length < 3) {
      emotions.onInvalid();
      setSpeechText('Too short! Words must be at least 3 letters.');
      return;
    }

    const word = currentInputWord;
    const targetWords = levelData.targetWords.map(w => w.toUpperCase());
    const upperWord = word.toUpperCase();

    if (foundWords.includes(upperWord)) {
      emotions.onInvalid();
      setSpeechText(`"${upperWord}" is already found!`);
      setSelectedIndices([]);
      return;
    }

    if (targetWords.includes(upperWord)) {
      const isPangram = upperWord.length === levelData.bigWord.length;
      const newFound = [...foundWords, upperWord];
      
      setFoundWords(newFound);
      
      let reward = 10;
      let speech = `Correct! Spelled "${upperWord}"!`;
      
      if (isPangram) {
        reward = 30; // Pangram bonus!
        speech = `Pangram Bonus! Spelled "${upperWord}"! +30 coins! 🌟`;
      }
      
      addCoins(reward);
      emotions.onCorrect(upperWord);
      setSpeechText(speech);

      if (newFound.length === levelData.targetWords.length) {
        setGameStatus('won');
        emotions.onWin(upperWord);
        setSpeechText('Phenomenal! You solved all words for this level! 🎉');
      }
    } else {
      emotions.onIncorrect();
      setSpeechText(`"${upperWord}" is not in the list!`);
    }

    setSelectedIndices([]);
  };

  // Generate SVG path for connecting lines
  const getConnectingPath = () => {
    if (selectedIndices.length === 0) return '';
    return selectedIndices.map((idx, index) => {
      const { x, y } = getLetterCoords(idx);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-lg mx-auto min-h-screen text-white select-none px-4 relative">
      <Confetti active={gameStatus === 'won'} word={levelData.bigWord} />

      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
        <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-black tracking-widest text-[10px] uppercase text-sky-300">Level {levelData.level}</span>
          <span className="text-xs text-white/60 font-semibold">Word Connect</span>
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 px-3 py-1 rounded-xl text-yellow-300 font-bold text-xs">
          <Coins size={14} className="animate-bounce" />
          <span>{coins}</span>
        </div>
      </div>

      {/* Word Slots display */}
      <div className="w-full bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center flex-1 my-3 max-h-52 overflow-y-auto">
        <div className="text-[10px] uppercase font-black tracking-widest text-sky-200/80 mb-2.5">
          Solved Words ({foundWords.length}/{levelData.targetWords.length})
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {levelData.targetWords.map((word) => {
            const isSolved = foundWords.includes(word.toUpperCase());
            return (
              <span 
                key={word} 
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                  isSolved 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-white/5 text-transparent border-white/10 select-none'
                }`}
              >
                {isSolved ? word : Array(word.length).fill('_').join(' ')}
              </span>
            );
          })}
        </div>
      </div>

      {/* active word bubble */}
      <div className="h-12 flex items-center justify-center font-black text-2xl uppercase tracking-widest text-amber-300 bg-white/5 px-6 rounded-full border border-white/10 min-w-[200px] mb-4">
        {currentInputWord || <span className="text-white/30 text-xs font-semibold tracking-normal">Spell a word...</span>}
      </div>

      {/* Bubble Info */}
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-2.5 text-center text-xs font-semibold mb-4 text-white/90">
        {speechText}
      </div>

      {/* Hex Wheel */}
      <div className="relative w-[300px] h-[300px] bg-slate-900/30 border border-white/10 rounded-full flex items-center justify-center shadow-inner">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <path
            d={getConnectingPath()}
            fill="none"
            stroke="rgba(251, 146, 60, 0.7)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]"
          />
        </svg>

        {shuffledLetters.map((char, index) => {
          const { x, y } = getLetterCoords(index);
          const isSelected = selectedIndices.includes(index);

          return (
            <button
              key={index}
              style={{ left: x - 22, top: y - 22 }}
              onClick={() => handleLetterClick(index)}
              className={`absolute w-11 h-11 rounded-full text-lg font-black uppercase flex items-center justify-center transition-all duration-150 z-20 ${
                isSelected
                  ? 'bg-orange-500 text-white border-2 border-orange-300 scale-95 shadow-[0_0_12px_rgba(249,115,22,0.6)]'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:scale-105 active:scale-95'
              }`}
            >
              {char}
            </button>
          );
        })}

        {/* Center Actions */}
        <div className="flex flex-col gap-2 z-30">
          <button 
            onClick={handleShuffle}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-transform active:scale-90 border border-white/20"
            title="Shuffle"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="w-full flex gap-3 max-w-sm justify-center my-4">
        <button 
          onClick={handleClear} 
          className="flex-1 py-3.5 bg-rose-500/80 hover:bg-rose-600 text-white rounded-2xl font-bold transition-all border border-rose-400/20 uppercase text-xs tracking-wider"
        >
          Clear
        </button>
        <button 
          onClick={handleSubmit} 
          className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black transition-all border border-emerald-400/20 uppercase text-xs tracking-widest"
        >
          Submit
        </button>
      </div>

      {/* Next Level button */}
      {gameStatus === 'won' && (
        <button
          onClick={onComplete}
          className="w-full max-w-xs py-3 bg-[var(--wm-correct)] text-[var(--wm-bg)] rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[var(--wm-correct)]/30 hover:scale-105 transition-transform mb-3"
        >
          Next Level
        </button>
      )}
    </div>
  );
};

export default WordConnect;
