import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { ANAGRAM_LEVELS } from '../../constants/levels';
import { playClick, playSuccess, playFailure, playWin } from '../../utils/audio';
import { ResultModal } from '../../components/Modals/ResultModal';
import { Volume2, VolumeX, ArrowLeft, Coins, Star, RefreshCw, Sparkles } from 'lucide-react';

export const DoubleGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawLevel = parseInt(searchParams.get('level') || '1', 10);
  
  // Load 2 distinct big words for double mode
  const l1Index = ((rawLevel - 1) * 2) % ANAGRAM_LEVELS.length;
  const l2Index = ((rawLevel - 1) * 2 + 1) % ANAGRAM_LEVELS.length;
  const level1Data = ANAGRAM_LEVELS[l1Index];
  const level2Data = ANAGRAM_LEVELS[l2Index];

  const { coins, addCoins, spendCoins, nextLevel } = useUserStore();
  const [isMuted, setIsMuted] = useState(false);

  // Game States
  const [foundWords1, setFoundWords1] = useState<string[]>([]);
  const [foundWords2, setFoundWords2] = useState<string[]>([]);
  
  // Selected letters state
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentBoard, setCurrentBoard] = useState<1 | 2>(1); // Active input board
  const [catSpeech, setCatSpeech] = useState('Double Anagram Mode! Solve sub-words for both words!');
  const [showResult, setShowResult] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // Letter shuffles
  const [shuffledLetters1, setShuffledLetters1] = useState<string[]>([]);
  const [shuffledLetters2, setShuffledLetters2] = useState<string[]>([]);

  const shuffle = (array: string[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    setFoundWords1([]);
    setFoundWords2([]);
    setSelectedIndices([]);
    setShuffledLetters1(shuffle(level1Data.bigWord.split('')));
    setShuffledLetters2(shuffle(level2Data.bigWord.split('')));
    setCatSpeech('Tackle both boards at once! Tap letters to make words.');
    setGameStatus('playing');
    setShowResult(false);
  }, [rawLevel]);

  const activeLetters = currentBoard === 1 ? shuffledLetters1 : shuffledLetters2;
  const currentInputWord = selectedIndices.map(idx => activeLetters[idx]).join('');

  const handleLetterClick = (index: number) => {
    if (gameStatus !== 'playing') return;
    if (!isMuted) playClick();

    if (selectedIndices.includes(index)) {
      // De-select
      setSelectedIndices(prev => prev.filter(i => i !== index));
    } else {
      setSelectedIndices(prev => [...prev, index]);
    }
  };

  const handleShuffle = () => {
    if (!isMuted) playClick();
    if (currentBoard === 1) {
      setShuffledLetters1(shuffle(shuffledLetters1));
    } else {
      setShuffledLetters2(shuffle(shuffledLetters2));
    }
    setSelectedIndices([]);
  };

  const handleClear = () => {
    if (!isMuted) playClick();
    setSelectedIndices([]);
  };

  const handleSubmit = () => {
    if (gameStatus !== 'playing' || currentInputWord.length < 3) return;

    const word = currentInputWord;
    const targetData = currentBoard === 1 ? level1Data : level2Data;
    const foundList = currentBoard === 1 ? foundWords1 : foundWords2;
    const setFoundList = currentBoard === 1 ? setFoundWords1 : setFoundWords2;

    if (targetData.targetWords.includes(word) && !foundList.includes(word)) {
      // Correct!
      const newFound = [...foundList, word];
      setFoundList(newFound);
      if (!isMuted) playSuccess();
      addCoins(10);
      setCatSpeech(`Great! Spelled "${word}" on Board ${currentBoard}!`);

      // Check overall victory
      const allDone1 = currentBoard === 1 ? newFound.length === level1Data.targetWords.length : foundWords1.length === level1Data.targetWords.length;
      const allDone2 = currentBoard === 2 ? newFound.length === level2Data.targetWords.length : foundWords2.length === level2Data.targetWords.length;

      if (allDone1 && allDone2) {
        setGameStatus('won');
        if (!isMuted) playWin();
        setTimeout(() => setShowResult(true), 800);
      }
    } else {
      // Wrong
      if (!isMuted) playFailure();
      setCatSpeech(`"${word}" is not on Board ${currentBoard} list!`);
    }

    setSelectedIndices([]);
  };

  const handleNextLevel = () => {
    nextLevel('double');
    navigate(`/game/double?level=${rawLevel + 1}`);
  };

  const handleRestart = () => {
    setFoundWords1([]);
    setFoundWords2([]);
    setSelectedIndices([]);
    setGameStatus('playing');
    setShowResult(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-2xl mx-auto beach-background min-h-screen text-white select-none px-4">
      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
        <button onClick={() => navigate('/')} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <span className="font-black tracking-widest text-sm uppercase">Double Lvl {rawLevel}</span>
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
      <div className="w-full flex gap-3 items-center my-3 max-w-md">
        <div className="flex-1 bg-white text-slate-800 rounded-2xl p-2.5 text-xs font-semibold relative shadow-lg border-2 border-sky-300">
          <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white border-r-2 border-b-2 border-sky-300 rotate-45 transform -translate-y-1/2"></div>
          {catSpeech}
        </div>
        <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-4xl animate-float">
          👯
        </div>
      </div>

      {/* Grid List for 2 Boards */}
      <div className="w-full flex gap-4 my-2">
        {/* Board 1 */}
        <div 
          onClick={() => setCurrentBoard(1)}
          className={`flex-1 p-3 rounded-2xl border transition-all cursor-pointer ${
            currentBoard === 1 ? 'bg-sky-950/40 border-amber-400 scale-[1.02] shadow-lg shadow-amber-400/10' : 'bg-sky-950/20 border-white/10 opacity-70 hover:opacity-90'
          }`}
        >
          <div className="text-[9px] uppercase font-black text-center tracking-widest text-sky-200 mb-2">Board 1 ({level1Data.bigWord})</div>
          <div className="flex flex-wrap justify-center gap-1 max-h-48 overflow-y-auto">
            {level1Data.targetWords.map((word) => {
              const isSolved = foundWords1.includes(word);
              return (
                <span key={word} className={`text-[9px] font-bold px-2 py-1 rounded-lg border ${
                  isSolved ? 'beach-tile-solved' : 'beach-tile-placeholder text-transparent border-white/25'
                }`}>
                  {isSolved ? word : Array(word.length).fill('_').join(' ')}
                </span>
              );
            })}
          </div>
        </div>

        {/* Board 2 */}
        <div 
          onClick={() => setCurrentBoard(2)}
          className={`flex-1 p-3 rounded-2xl border transition-all cursor-pointer ${
            currentBoard === 2 ? 'bg-sky-950/40 border-amber-400 scale-[1.02] shadow-lg shadow-amber-400/10' : 'bg-sky-950/20 border-white/10 opacity-70 hover:opacity-90'
          }`}
        >
          <div className="text-[9px] uppercase font-black text-center tracking-widest text-sky-200 mb-2">Board 2 ({level2Data.bigWord})</div>
          <div className="flex flex-wrap justify-center gap-1 max-h-48 overflow-y-auto">
            {level2Data.targetWords.map((word) => {
              const isSolved = foundWords2.includes(word);
              return (
                <span key={word} className={`text-[9px] font-bold px-2 py-1 rounded-lg border ${
                  isSolved ? 'beach-tile-solved' : 'beach-tile-placeholder text-transparent border-white/25'
                }`}>
                  {isSolved ? word : Array(word.length).fill('_').join(' ')}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Input Display Area */}
      <div className="h-10 my-1 font-black text-xl uppercase tracking-widest text-amber-300 flex items-center justify-center bg-black/10 px-6 rounded-full border border-white/5">
        {currentInputWord || <span className="text-white/40 text-xs tracking-normal font-bold">Select letters for Board {currentBoard}...</span>}
      </div>

      {/* Action Buttons & Letter Tiles */}
      <div className="w-full flex flex-col items-center gap-3">
        <div className="flex gap-2 justify-center">
          <button onClick={handleClear} className="px-4 py-2 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all border border-rose-400/30">
            Clear
          </button>
          <button onClick={handleShuffle} className="p-2.5 bg-sky-500/80 hover:bg-sky-600 text-white rounded-xl transition-all border border-sky-400/30">
            <RefreshCw size={14} />
          </button>
          <button onClick={handleSubmit} className="px-5 py-2 beach-button-green text-white rounded-xl text-xs font-black transition-all border border-emerald-400/30 flex items-center gap-1">
            <Sparkles size={12} /> Submit
          </button>
        </div>

        {/* Letter Wheel / Row */}
        <div className="flex flex-wrap justify-center gap-2 max-w-sm px-4 pb-4">
          {activeLetters.map((char, index) => {
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
        targetWord={`both boards fully solved!`}
        hardMode={false}
        gameId="double"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
