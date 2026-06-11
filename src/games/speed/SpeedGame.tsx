import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { ANAGRAM_LEVELS } from '../../constants/levels';
import { playClick, playSuccess, playFailure, playWin } from '../../utils/audio';
import { ResultModal } from '../../components/Modals/ResultModal';
import { Volume2, VolumeX, ArrowLeft, Coins, RefreshCw, Sparkles, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

export const SpeedGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawLevel = parseInt(searchParams.get('level') || '1', 10);
  const levelIndex = (rawLevel - 1) % ANAGRAM_LEVELS.length;
  const levelData = ANAGRAM_LEVELS[levelIndex];

  const { coins, addCoins, spendCoins, nextLevel } = useUserStore();
  const [isMuted, setIsMuted] = useState(false);

  // Gameplay State
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [catSpeech, setCatSpeech] = useState('Tap any letter to start the 60s Speed Anagram rush!');
  const [showResult, setShowResult] = useState(false);

  const timerRef = useRef<any>(null);

  const shuffle = (array: string[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    setFoundWords([]);
    setSelectedIndices([]);
    setShuffledLetters(shuffle(levelData.bigWord.split('')));
    setScore(0);
    setTimeLeft(60);
    setGameStatus('idle');
    setCatSpeech('Tap any letter to start the speed clock! Find at least 3 sub-words to win.');
    setShowResult(false);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [rawLevel]);

  useEffect(() => {
    if (gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleGameOver();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  const handleGameOver = () => {
    const isWin = score >= 3;
    setGameStatus(isWin ? 'won' : 'lost');
    if (!isMuted) {
      if (isWin) playWin();
      else playFailure();
    }
    setCatSpeech(isWin ? `Awesome job! You solved ${score} words!` : `Time's up! Solved only ${score} words. Try again!`);
    setTimeout(() => {
      setShowResult(true);
    }, 800);
  };

  const handleLetterClick = (index: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;
    
    if (gameStatus === 'idle') {
      setGameStatus('playing');
      setCatSpeech('Clock is ticking! Find as many words as you can!');
    }

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
    if (gameStatus !== 'playing' || currentInputWord.length < 3) return;

    const word = currentInputWord;
    if (levelData.targetWords.includes(word) && !foundWords.includes(word)) {
      const newFound = [...foundWords, word];
      setFoundWords(newFound);
      setScore(s => s + 1);
      if (!isMuted) playSuccess();
      addCoins(10);
      setCatSpeech(`Nice! Spelled "${word}"! (+10 coins)`);

      // If all words on this board found, give a bonus and load next set
      if (newFound.length === levelData.targetWords.length) {
        addCoins(50);
        setCatSpeech('Superb! Board cleared! +50 bonus coins.');
      }
    } else {
      if (!isMuted) playFailure();
      setCatSpeech(`"${word}" is not correct or already found!`);
    }

    setSelectedIndices([]);
  };

  const handleNextLevel = () => {
    nextLevel('speed');
    navigate(`/game/speed?level=${rawLevel + 1}`);
  };

  const handleRestart = () => {
    setFoundWords([]);
    setSelectedIndices([]);
    setScore(0);
    setTimeLeft(60);
    setGameStatus('idle');
    setCatSpeech('Tap letters to start again!');
    setShowResult(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-lg mx-auto beach-background min-h-screen text-white select-none px-4">
      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
        <button onClick={() => navigate('/')} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <span className="font-black tracking-widest text-sm uppercase">Speed Lvl {rawLevel}</span>
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

      {/* Timer & Score panels */}
      <div className="w-full flex justify-between px-6 my-2">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-sky-200/80 font-bold uppercase tracking-widest">Words Solved</span>
          <motion.span key={score} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-3xl font-black text-amber-300">{score}</motion.span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-sky-200/80 font-bold uppercase tracking-widest">Time Left</span>
          <div className="flex items-center gap-1">
            <Timer size={18} className={timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-white'} />
            <span className={`text-3xl font-black ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Guide Cat bubble */}
      <div className="w-full flex gap-3 items-center my-2 max-w-sm">
        <div className="flex-1 bg-white text-slate-800 rounded-2xl p-2.5 text-xs font-semibold relative shadow-lg border-2 border-sky-300">
          <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white border-r-2 border-b-2 border-sky-300 rotate-45 transform -translate-y-1/2"></div>
          {catSpeech}
        </div>
        <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-4xl animate-float">
          ⚡
        </div>
      </div>

      {/* Solved Words Grid */}
      <div className="w-full bg-sky-950/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 my-2 flex flex-col items-center flex-1 justify-center max-h-56">
        <div className="text-[9px] uppercase font-black tracking-widest text-sky-200 mb-2">Word List ({levelData.bigWord})</div>
        <div className="flex flex-wrap justify-center gap-1.5 max-h-40 overflow-y-auto w-full">
          {levelData.targetWords.map((word) => {
            const isSolved = foundWords.includes(word);
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

      {/* Input Display */}
      <div className="h-10 my-1 font-black text-xl uppercase tracking-widest text-amber-300 flex items-center justify-center bg-black/10 px-6 rounded-full border border-white/5">
        {currentInputWord || <span className="text-white/40 text-xs tracking-normal font-bold">Tap letters below...</span>}
      </div>

      {/* Controls & Letter Row */}
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
        status={gameStatus === 'idle' ? 'lost' : gameStatus}
        guesses={[]}
        targetWord={`Speed round over! Solved: ${score} words`}
        hardMode={false}
        gameId="speed"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
