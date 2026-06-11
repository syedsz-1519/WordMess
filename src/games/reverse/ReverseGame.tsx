import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useCharacterStore } from '../../store/characterStore';
import { useCharacterEmotions } from '../../hooks/useCharacterEmotions';
import { getDailyWord, getDailyWordIndex } from '../../utils/dailyWord';
import { evaluateGuess, LetterState } from '../../utils/evaluateGuess';
import { Board } from '../../components/Board/Board';
import { Keyboard } from '../../components/Keyboard/Keyboard';
import { Wordy } from '../../assets/characters/Wordy';
import { Messy } from '../../assets/characters/Messy';
import { SpeechBubble } from '../../assets/characters/SpeechBubble';
import { ResultModal } from '../../components/Modals/ResultModal';
import { Confetti } from '../../engine/Confetti';
import { ArrowLeft, Coins, HelpCircle } from 'lucide-react';
import { WORDS } from '../../utils/wordList';

export const ReverseGame = () => {
  const navigate = useNavigate();
  const user = useUserStore();
  const emotions = useCharacterEmotions();

  const {
    wordyEmotion,
    messyEmotion,
    wordyBubble,
    messyBubble,
    triggerWordy,
    triggerMessy,
    resetMascots
  } = useCharacterStore();

  const [targetWord, setTargetWord] = useState('');
  const [hintGuesses, setHintGuesses] = useState<string[]>([]);
  const [hintResults, setHintResults] = useState<LetterState[][]>([]);
  
  const [playerGuesses, setPlayerGuesses] = useState<string[]>([]);
  const [playerResults, setPlayerResults] = useState<LetterState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    const target = getDailyWord().toUpperCase();
    setTargetWord(target);
    resetMascots();

    // Procedurally select 4 distinct guess hints that have overlapping letters
    const dayIndex = getDailyWordIndex();
    const hints: string[] = [];
    
    // Choose some words from WORDS list around the daily seed index
    for (let i = 1; hints.length < 4 && i < 100; i++) {
      const candidate = WORDS[(dayIndex + i * 17) % WORDS.length].toUpperCase();
      if (candidate !== target && !hints.includes(candidate)) {
        hints.push(candidate);
      }
    }

    setHintGuesses(hints);
    setHintResults(hints.map(word => evaluateGuess(word, target)));

    // Check history
    const todayStr = new Date().toDateString();
    const playedToday = user.history.find(h => h.date === todayStr && h.gameId === 'reverse');
    if (playedToday) {
      setPlayerGuesses([target]);
      setPlayerResults([evaluateGuess(target, target)]);
      setGameStatus(playedToday.result);
      setShowResultModal(true);
    }
  }, []);

  const submitGuess = () => {
    if (currentGuess.length !== 5) {
      emotions.onInvalid();
      setIsInvalid(true);
      setTimeout(() => setIsInvalid(false), 400);
      return;
    }

    const cleanGuess = currentGuess.toUpperCase();
    const cleanWordList = WORDS.map(w => w.toUpperCase());

    if (!cleanWordList.includes(cleanGuess)) {
      emotions.onInvalid();
      setIsInvalid(true);
      setTimeout(() => setIsInvalid(false), 400);
      return;
    }

    const evaluation = evaluateGuess(cleanGuess, targetWord);
    const newGuesses = [...playerGuesses, cleanGuess];
    const newResults = [...playerResults, evaluation];

    setPlayerGuesses(newGuesses);
    setPlayerResults(newResults);
    setCurrentGuess('');

    if (cleanGuess === targetWord) {
      setGameStatus('won');
      emotions.onWin(cleanGuess);
      user.incrementStreak();
      user.addCoins(50);
      user.addHistory({
        date: new Date().toDateString(),
        gameId: 'reverse',
        word: targetWord,
        guesses: newGuesses.length,
        result: 'won'
      });
      setTimeout(() => setShowResultModal(true), 1200);
    } else if (newGuesses.length >= 3) {
      // Deducing has only 3 attempts max!
      setGameStatus('lost');
      emotions.onLoss(targetWord);
      user.resetStreak();
      user.addHistory({
        date: new Date().toDateString(),
        gameId: 'reverse',
        word: targetWord,
        guesses: newGuesses.length,
        result: 'lost'
      });
      setTimeout(() => setShowResultModal(true), 1200);
    } else {
      emotions.onIncorrect();
      triggerMessy('laugh', 'Not even close! 😈');
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameStatus !== 'playing') return;

    if (key === 'Enter') {
      submitGuess();
    } else if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
      emotions.onKeyPress();
    } else if (/^[A-Za-z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key.toUpperCase());
      emotions.onKeyPress();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameStatus, targetWord]);

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-lg mx-auto min-h-[calc(100vh-60px)] px-4">
      <Confetti active={gameStatus === 'won'} word={targetWord} />

      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 z-10">
        <button onClick={() => navigate('/hub')} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-black tracking-widest text-xs uppercase text-slate-300">Reverse Mess</span>
          <span className="text-[10px] text-white/50 font-bold">Deduce target word!</span>
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-500/10 px-2.5 py-1 rounded-xl text-xs text-yellow-300 font-bold">
          <Coins size={14} className="animate-bounce" />
          <span>{user.coins}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center gap-4 py-4 w-full">
        {/* Hint Board */}
        <div className="bg-slate-900/30 border border-white/10 p-4 rounded-3xl backdrop-blur-md w-full max-w-sm">
          <h3 className="text-center text-[10px] uppercase font-black text-white/50 tracking-widest mb-3 flex items-center justify-center gap-1.5">
            <HelpCircle size={12} /> DEDUCTION GRIDS
          </h3>
          <Board
            guesses={hintGuesses}
            results={hintResults}
            currentGuess=""
            maxGuesses={4}
          />
        </div>

        {/* Player Guesses */}
        <div className="w-full max-w-sm text-center">
          <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-2">
            Your Attempts ({playerGuesses.length}/3)
          </p>
          <Board
            guesses={playerGuesses}
            results={playerResults}
            currentGuess={currentGuess}
            isInvalid={isInvalid}
            maxGuesses={3}
          />
        </div>
      </div>

      {/* Mascot indicators */}
      <div className="w-full flex justify-between px-4 mb-4 items-end z-10">
        <div className="relative cursor-pointer" onClick={() => triggerWordy('cheer', 'random')}>
          <SpeechBubble text={wordyBubble} />
          <Wordy emotion={wordyEmotion} size={62} />
        </div>
        <div className="relative cursor-pointer" onClick={() => triggerMessy('laugh', 'random')}>
          <SpeechBubble text={messyBubble} />
          <Messy emotion={messyEmotion} size={62} />
        </div>
      </div>

      {/* Keyboard */}
      <div className="w-full z-10">
        <Keyboard 
          onKeyPress={handleKeyPress} 
          guesses={playerGuesses} 
          results={playerResults} 
        />
      </div>

      <ResultModal 
        isOpen={showResultModal} 
        onClose={() => setShowResultModal(false)} 
        status={gameStatus} 
        guesses={playerGuesses} 
        targetWord={targetWord} 
        hardMode={false} 
        gameId="reverse" 
        onRestart={() => {
          setPlayerGuesses([]);
          setPlayerResults([]);
          setCurrentGuess('');
          setGameStatus('playing');
          setShowResultModal(false);
        }}
      />
    </div>
  );
};

export default ReverseGame;
