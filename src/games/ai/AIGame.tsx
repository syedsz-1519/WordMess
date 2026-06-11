import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { ANAGRAM_LEVELS } from '../../constants/levels';
import { playClick, playSuccess, playFailure, playWin } from '../../utils/audio';
import { ResultModal } from '../../components/Modals/ResultModal';
import { getCrypticHint } from '../../lib/gemini';
import { Volume2, VolumeX, ArrowLeft, Coins, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const AIGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawLevel = parseInt(searchParams.get('level') || '1', 10);
  const levelIndex = (rawLevel - 1) % ANAGRAM_LEVELS.length;
  const levelData = ANAGRAM_LEVELS[levelIndex];

  const { coins, addCoins, spendCoins, nextLevel } = useUserStore();
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  // Gameplay State
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [oracleClue, setOracleClue] = useState('Consult the Oracle Orb for cryptic letter hints. Costs 20 coins.');
  
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showResult, setShowResult] = useState(false);
  const [loadingClue, setLoadingClue] = useState(false);

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
    setOracleClue('The Oracle is ready to spin riddles. Form words from my letters...');
    setGameStatus('playing');
    setShowResult(false);
    setLoadingClue(false);
  }, [rawLevel]);

  // Voice synthesis helper
  const speakClue = (text: string) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1; // mysterious high-ish voice
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed', e);
    }
  };

  const handleLetterClick = (index: number) => {
    if (gameStatus !== 'playing' || loadingClue) return;
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
    if (gameStatus !== 'playing' || currentInputWord.length < 3 || loadingClue) return;

    const word = currentInputWord;
    if (levelData.targetWords.includes(word) && !foundWords.includes(word)) {
      const newFound = [...foundWords, word];
      setFoundWords(newFound);
      if (!isMuted) playSuccess();
      addCoins(10);
      setOracleClue(`Correct! "${word}" has been deciphered.`);
      speakClue(`Correct. "${word}" is solved.`);

      if (newFound.length === levelData.targetWords.length) {
        setGameStatus('won');
        if (!isMuted) playWin();
        speakClue("Outstanding. You have unlocked all secrets of this level.");
        setTimeout(() => setShowResult(true), 1200);
      }
    } else {
      if (!isMuted) playFailure();
      setOracleClue(`"${word}" is not part of my patterns...`);
      speakClue("Incorrect guess.");
    }

    setSelectedIndices([]);
  };

  const handleConsultOracle = async () => {
    if (gameStatus !== 'playing' || loadingClue) return;

    // Check coins
    if (coins < 20) {
      setOracleClue("You lack the 20 coins required for my sight.");
      speakClue("You lack the coins required.");
      return;
    }

    // Find a random unsolved word
    const unsolvedWords = levelData.targetWords.filter(w => !foundWords.includes(w));
    if (unsolvedWords.length === 0) return;

    const targetHintWord = unsolvedWords[Math.floor(Math.random() * unsolvedWords.length)];

    setLoadingClue(true);
    setOracleClue("The Oracle gazes into the cosmos...");
    speakClue("Oracle is looking into the stars.");

    const lastWrong = "START";
    const clue = await getCrypticHint(targetHintWord, lastWrong, foundWords.length);
    
    spendCoins(20);
    setLoadingClue(false);
    setOracleClue(`Oracle says: "${clue}" (${targetHintWord.length} letters)`);
    speakClue(`Oracle riddle: ${clue}`);
  };

  const handleNextLevel = () => {
    nextLevel('ai');
    navigate(`/game/ai?level=${rawLevel + 1}`);
  };

  const handleRestart = () => {
    setFoundWords([]);
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
        <span className="font-black tracking-widest text-sm uppercase">AI Oracle Lvl {rawLevel}</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsVoiceEnabled(!isVoiceEnabled)} className={`p-1.5 rounded-xl hover:scale-105 active:scale-95 transition-transform ${isVoiceEnabled ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40' : 'bg-white/10 text-white border border-white/10'}`}>
            🗣️
          </button>
          <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 bg-white/10 rounded-xl hover:scale-105 active:scale-95 transition-transform">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="flex items-center gap-1 font-bold text-yellow-300 bg-yellow-500/20 px-2.5 py-1 rounded-xl border border-yellow-500/30">
            <Coins size={16} className="animate-bounce" />
            <span className="text-xs">{coins}</span>
          </div>
        </div>
      </div>

      {/* Glowing breathing Oracle Orb Bubble */}
      <div className="w-full flex gap-3 items-center my-3 max-w-sm">
        <div className="flex-1 bg-white text-slate-800 rounded-2xl p-2.5 text-xs font-semibold relative shadow-lg border-2 border-purple-400">
          <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white border-r-2 border-b-2 border-purple-400 rotate-45 transform -translate-y-1/2"></div>
          {oracleClue}
        </div>
        {/* Breathing Orb */}
        <motion.div 
          animate={{
            scale: [1, 1.08, 1],
            boxShadow: [
              "0 0 10px rgba(168,85,247,0.4)",
              "0 0 25px rgba(168,85,247,0.7)",
              "0 0 10px rgba(168,85,247,0.4)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-indigo-400 rounded-full flex items-center justify-center text-3xl cursor-pointer border border-purple-300 shadow-lg"
          onClick={handleConsultOracle}
          title="Tap to consult AI Oracle (-20 coins)"
        >
          🔮
        </motion.div>
      </div>

      {/* Target word lists */}
      <div className="w-full bg-sky-950/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 my-2 flex-1 flex flex-col justify-center max-h-56">
        <div className="text-[9px] uppercase font-black tracking-widest text-sky-200 mb-2 text-center">Solved sub-words ({levelData.bigWord})</div>
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

      {/* Input display */}
      <div className="h-10 my-1 font-black text-xl uppercase tracking-widest text-amber-300 flex items-center justify-center bg-black/10 px-6 rounded-full border border-white/5">
        {currentInputWord || <span className="text-white/40 text-xs tracking-normal font-bold">Oracle waits...</span>}
      </div>

      {/* Controls & letters */}
      <div className="w-full flex flex-col items-center gap-3">
        <div className="flex gap-2 justify-center">
          <button onClick={handleClear} className="px-4 py-2 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all border border-rose-400/30">
            Clear
          </button>
          <button onClick={handleShuffle} className="p-2.5 bg-sky-500/80 hover:bg-sky-600 text-white rounded-xl transition-all border border-sky-400/30">
            <RefreshCw size={14} />
          </button>
          <button 
            onClick={handleConsultOracle} 
            disabled={loadingClue}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-black transition-all border border-purple-400/30 flex items-center gap-1"
            title="Get AI Riddle (-20 coins)"
          >
            <HelpCircle size={13} /> Oracle Clue
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
        targetWord={`all words solved!`}
        hardMode={false}
        gameId="ai"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
