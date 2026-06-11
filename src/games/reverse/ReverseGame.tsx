import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { ANAGRAM_LEVELS } from '../../constants/levels';
import { playClick, playSuccess, playFailure, playWin } from '../../utils/audio';
import { ResultModal } from '../../components/Modals/ResultModal';
import { Volume2, VolumeX, ArrowLeft, Coins, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';

export const ReverseGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawLevel = parseInt(searchParams.get('level') || '1', 10);
  const levelIndex = (rawLevel - 1) % ANAGRAM_LEVELS.length;
  const levelData = ANAGRAM_LEVELS[levelIndex];

  const { coins, addCoins, spendCoins, nextLevel } = useUserStore();
  const [isMuted, setIsMuted] = useState(false);

  // Gameplay State
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [catSpeech, setCatSpeech] = useState('Reverse Anagram Mode! Solve the hidden big word using the sub-word clues!');
  const [showResult, setShowResult] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const shuffle = (array: string[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    setSelectedIndices([]);
    setShuffledLetters(shuffle(levelData.bigWord.split('')));
    setCatSpeech('Look at the list of makeable words above, and spell the big word!');
    setGameStatus('playing');
    setShowResult(false);
  }, [rawLevel]);

  const handleLetterClick = (index: number) => {
    if (gameStatus !== 'playing') return;
    if (!isMuted) playClick();

    if (selectedIndices.includes(index)) {
      setSelectedIndices(prev => prev.filter(i => i !== index));
    } else {
      setSelectedIndices(prev => [...prev, index]);
    }
  };

  const handleShuffle = () => {
    if (!isMuted) playClick();
    setShuffledLetters(shuffle(shuffledLetters));
    setSelectedIndices([]);
  };

  const handleClear = () => {
    if (!isMuted) playClick();
    setSelectedIndices([]);
  };

  const currentInputWord = selectedIndices.map(idx => shuffledLetters[idx]).join('');

  const handleSubmit = () => {
    if (gameStatus !== 'playing' || currentInputWord.length !== levelData.bigWord.length) return;

    const word = currentInputWord;
    if (word === levelData.bigWord) {
      setGameStatus('won');
      if (!isMuted) playWin();
      addCoins(20); // Bonus coins for Reverse Mode!
      setCatSpeech(`OMG! Correct! The big word was indeed "${levelData.bigWord}"! 🎉`);
      setTimeout(() => setShowResult(true), 1200);
    } else {
      if (!isMuted) playFailure();
      setCatSpeech(`"${word}" is not the hidden big word! Look at the clues again.`);
      setSelectedIndices([]);
    }
  };

  const handleRevealHint = () => {
    if (gameStatus !== 'playing') return;
    // Reveal first letter for 20 coins
    if (coins >= 20) {
      spendCoins(20);
      setCatSpeech(`Hint: The big word starts with "${levelData.bigWord[0]}"! 💡`);
    } else {
      setCatSpeech('You need 20 coins to reveal a letter! 🪙');
    }
  };

  const handleNextLevel = () => {
    nextLevel('reverse');
    navigate(`/game/reverse?level=${rawLevel + 1}`);
  };

  const handleRestart = () => {
    setSelectedIndices([]);
    setGameStatus('playing');
    setShowResult(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-lg mx-auto beach-background min-h-screen text-white select-none px-4">
      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
        <button onClick={() => navigate('/')} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <span className="font-black tracking-widest text-sm uppercase">Reverse Lvl {rawLevel}</span>
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

      {/* Guide Cat thought bubble */}
      <div className="w-full flex gap-3 items-center my-3 max-w-sm">
        <div className="flex-1 bg-white text-slate-800 rounded-2xl p-2.5 text-xs font-semibold relative shadow-lg border-2 border-sky-300">
          <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white border-r-2 border-b-2 border-sky-300 rotate-45 transform -translate-y-1/2"></div>
          {catSpeech}
        </div>
        <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-4xl animate-float">
          ⏪
        </div>
      </div>

      {/* Clues Card: Shows all sub-words solved */}
      <div className="w-full bg-sky-950/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 my-2 flex flex-col items-center flex-1 justify-center max-h-60">
        <div className="text-[9px] uppercase font-black tracking-widest text-sky-200 mb-2">Clues (Sub-words derived from target)</div>
        <div className="flex flex-wrap justify-center gap-1.5 max-h-48 overflow-y-auto w-full">
          {levelData.targetWords.filter(w => w !== levelData.bigWord).map((word) => (
            <span key={word} className="text-[10px] font-black tracking-wider uppercase px-2 py-1 rounded bg-white/10 border border-white/10 text-emerald-300">
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Display Hidden Big Word placeholders */}
      <div className="flex gap-1.5 justify-center my-3">
        {levelData.bigWord.split('').map((char, index) => {
          const isSelected = selectedIndices.length > index;
          return (
            <div
              key={index}
              className={`w-9 h-9 rounded-lg border font-black text-lg flex items-center justify-center transition-all ${
                isSelected 
                  ? 'bg-amber-400 border-amber-300 text-sky-950 scale-105' 
                  : 'bg-white/5 border-white/20 text-transparent'
              }`}
            >
              {isSelected ? currentInputWord[index] : '_'}
            </div>
          );
        })}
      </div>

      {/* Controls panel */}
      <div className="w-full flex flex-col items-center gap-3">
        <div className="flex gap-2 justify-center">
          <button onClick={handleClear} className="px-4 py-2 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all border border-rose-400/30">
            Clear
          </button>
          <button onClick={handleShuffle} className="p-2.5 bg-sky-500/80 hover:bg-sky-600 text-white rounded-xl transition-all border border-sky-400/30">
            <RefreshCw size={14} />
          </button>
          <button 
            onClick={handleRevealHint} 
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-[var(--wm-bg)] rounded-xl text-xs font-black transition-all border border-yellow-400/30 flex items-center gap-1"
            title="Reveal first letter (-20 coins)"
          >
            <HelpCircle size={13} /> Hint
          </button>
          <button onClick={handleSubmit} className="px-5 py-2 beach-button-green text-white rounded-xl text-xs font-black transition-all border border-emerald-400/30 flex items-center gap-1">
            <Sparkles size={12} /> Submit
          </button>
        </div>

        {/* Letter tiles */}
        <div className="flex flex-wrap justify-center gap-2 max-w-sm px-4 pb-4">
          {shuffledLetters.map((char, index) => {
            const isUsed = selectedIndices.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleLetterClick(index)}
                className={`w-11 h-11 rounded-full text-base font-black uppercase flex items-center justify-center transition-all ${
                  isUsed
                    ? 'bg-slate-700/50 text-white/40 border-2 border-slate-700/80 scale-95 shadow-inner'
                    : 'beach-tile-orange text-white hover:scale-105 active:scale-95'
                }`}
              >
                {char}
              </button>
            );
          })}
        </div>
      </div>

      <ResultModal 
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        status={gameStatus}
        guesses={[]}
        targetWord={levelData.bigWord}
        hardMode={false}
        gameId="reverse"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
