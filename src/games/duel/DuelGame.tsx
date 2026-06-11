import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { ANAGRAM_LEVELS } from '../../constants/levels';
import { playClick, playSuccess, playFailure, playWin } from '../../utils/audio';
import { ResultModal } from '../../components/Modals/ResultModal';
import { Volume2, VolumeX, ArrowLeft, Coins, RefreshCw, Sparkles, User, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';

export const DuelGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawLevel = parseInt(searchParams.get('level') || '1', 10);
  const levelIndex = (rawLevel - 1) % ANAGRAM_LEVELS.length;
  const levelData = ANAGRAM_LEVELS[levelIndex];

  const { coins, addCoins, spendCoins, nextLevel } = useUserStore();
  const [isMuted, setIsMuted] = useState(false);

  // Gameplay State
  const [playerFound, setPlayerFound] = useState<string[]>([]);
  const [botFound, setBotFound] = useState<string[]>([]);
  
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [catSpeech, setCatSpeech] = useState('Duel Mode! Race the WordMess Bot to solve all sub-words!');
  const [showResult, setShowResult] = useState(false);
  const [duelResultText, setDuelResultText] = useState('');

  const botTimerRef = useRef<any>(null);

  const shuffle = (array: string[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    setPlayerFound([]);
    setBotFound([]);
    setSelectedIndices([]);
    setShuffledLetters(shuffle(levelData.bigWord.split('')));
    setGameStatus('playing');
    setShowResult(false);
    setDuelResultText('');
    setCatSpeech('Spell words fast! The bot will guess one every 5 seconds.');

    if (botTimerRef.current) clearInterval(botTimerRef.current);

    // Bot guessing logic
    botTimerRef.current = setInterval(() => {
      // Find words the bot hasn't found and the player hasn't found
      const remainingWords = levelData.targetWords.filter(
        w => !playerFound.includes(w) && !botFound.includes(w)
      );

      if (remainingWords.length === 0) {
        clearInterval(botTimerRef.current);
        return;
      }

      // Pick a random remaining word for the bot
      const botGuess = remainingWords[Math.floor(Math.random() * remainingWords.length)];
      
      setBotFound(prev => {
        const next = [...prev, botGuess];
        setCatSpeech(`Bot just guessed: "${botGuess}"! 🤖`);
        
        // Check if all target words are solved
        const totalSolved = playerFound.length + next.length;
        if (totalSolved === levelData.targetWords.length) {
          clearInterval(botTimerRef.current);
          handleGameOver(playerFound, next);
        }
        return next;
      });
    }, 5000);

    return () => {
      if (botTimerRef.current) clearInterval(botTimerRef.current);
    };
  }, [rawLevel, playerFound]);

  const handleGameOver = (pFound: string[], bFound: string[]) => {
    if (botTimerRef.current) clearInterval(botTimerRef.current);

    const playerWon = pFound.length >= bFound.length;
    setGameStatus(playerWon ? 'won' : 'lost');
    
    if (playerWon) {
      addCoins(30);
      setDuelResultText(`Victory! You found ${pFound.length} words vs Bot's ${bFound.length}! (+30 coins)`);
      if (!isMuted) playWin();
    } else {
      setDuelResultText(`Defeat! Bot found ${bFound.length} words vs your ${pFound.length}!`);
      if (!isMuted) playFailure();
    }

    setTimeout(() => {
      setShowResult(true);
    }, 1200);
  };

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
    if (gameStatus !== 'playing' || currentInputWord.length < 3) return;

    const word = currentInputWord;
    
    // Check if the word is correct, not found by player and not found by bot
    if (levelData.targetWords.includes(word) && !playerFound.includes(word) && !botFound.includes(word)) {
      const newFound = [...playerFound, word];
      setPlayerFound(newFound);
      if (!isMuted) playSuccess();
      addCoins(10);
      setCatSpeech(`OMG! You beat the bot to "${word}"!`);

      const totalSolved = newFound.length + botFound.length;
      if (totalSolved === levelData.targetWords.length) {
        handleGameOver(newFound, botFound);
      }
    } else if (botFound.includes(word)) {
      if (!isMuted) playFailure();
      setCatSpeech(`"${word}" was already claimed by the bot!`);
    } else {
      if (!isMuted) playFailure();
      setCatSpeech('Word not valid or already found!');
    }

    setSelectedIndices([]);
  };

  const handleNextLevel = () => {
    nextLevel('duel');
    navigate(`/game/duel?level=${rawLevel + 1}`);
  };

  const handleRestart = () => {
    setPlayerFound([]);
    setBotFound([]);
    setSelectedIndices([]);
    setGameStatus('playing');
    setShowResult(false);
  };

  // Calculate battle scores
  const playerScore = playerFound.length * 10;
  const botScore = botFound.length * 10;
  const totalScore = playerScore + botScore || 1;
  const playerPercent = (playerScore / totalScore) * 100;

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-lg mx-auto beach-background min-h-screen text-white select-none px-4">
      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
        <button onClick={() => navigate('/')} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <span className="font-black tracking-widest text-sm uppercase">Duel Lvl {rawLevel}</span>
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

      {/* Duel Battle Scoreboard (Reference: Image 4) */}
      <div className="w-full bg-sky-950/40 backdrop-blur-md border border-white/20 rounded-2xl p-4 my-2 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-black">
          <div className="flex items-center gap-1.5 text-sky-300">
            <User size={14} />
            <span>Player: {playerScore}</span>
          </div>
          <span className="text-[10px] tracking-widest uppercase text-white/60">Battle Duel</span>
          <div className="flex items-center gap-1.5 text-rose-400">
            <span>Bot: {botScore}</span>
            <Laptop size={14} />
          </div>
        </div>
        {/* Battle Progress Bar */}
        <div className="w-full h-3 bg-rose-500/30 rounded-full overflow-hidden border border-white/10 flex">
          <div 
            className="h-full bg-sky-400 transition-all duration-500" 
            style={{ width: `${playerPercent}%` }}
          />
        </div>
      </div>

      {/* Guide Cat bubble */}
      <div className="w-full flex gap-3 items-center my-2 max-w-sm">
        <div className="flex-1 bg-white text-slate-800 rounded-2xl p-2.5 text-xs font-semibold relative shadow-lg border-2 border-sky-300">
          <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white border-r-2 border-b-2 border-sky-300 rotate-45 transform -translate-y-1/2"></div>
          {catSpeech}
        </div>
        <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-4xl animate-float">
          ⚔️
        </div>
      </div>

      {/* Game board lists */}
      <div className="w-full bg-sky-950/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 my-2 flex-1 flex flex-col justify-center max-h-56">
        <div className="text-[9px] uppercase font-black tracking-widest text-sky-200 mb-2 text-center">Word Anagram List ({levelData.bigWord})</div>
        <div className="flex flex-wrap justify-center gap-1.5 max-h-40 overflow-y-auto w-full">
          {levelData.targetWords.map((word) => {
            const byPlayer = playerFound.includes(word);
            const byBot = botFound.includes(word);
            const isSolved = byPlayer || byBot;
            
            return (
              <span key={word} className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition-all ${
                byPlayer ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' :
                byBot ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 line-through opacity-60' :
                'beach-tile-placeholder text-transparent border-white/25'
              }`}>
                {isSolved ? word : Array(word.length).fill('_').join(' ')}
              </span>
            );
          })}
        </div>
      </div>

      {/* Input Display */}
      <div className="h-10 my-1 font-black text-xl uppercase tracking-widest text-amber-300 flex items-center justify-center bg-black/10 px-6 rounded-full border border-white/5">
        {currentInputWord || <span className="text-white/40 text-xs tracking-normal font-bold">Claim sub-words...</span>}
      </div>

      {/* Controls & Letter tiles */}
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
        status={gameStatus}
        guesses={[]}
        targetWord={`${targetWord} (${duelResultText})`}
        hardMode={false}
        gameId="duel"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
