import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useCharacterStore } from '../../store/characterStore';
import { useCharacterEmotions } from '../../hooks/useCharacterEmotions';
import { getDailyNumber } from '../../utils/dailyNumber';
import { evaluateNumber } from '../../utils/evaluateNumber';
import { LetterState } from '../../utils/evaluateGuess';
import { Board } from '../../components/Board/Board';
import { NumPad } from '../../components/Keyboard/NumPad';
import { Wordy } from '../../assets/characters/Wordy';
import { Messy } from '../../assets/characters/Messy';
import { SpeechBubble } from '../../assets/characters/SpeechBubble';
import { ResultModal } from '../../components/Modals/ResultModal';
import { Confetti } from '../../engine/Confetti';
import { ArrowLeft, Coins, Flame, Star, Timer } from 'lucide-react';

export const NumberGame = () => {
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

  const [targetNumber, setTargetNumber] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<LetterState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showResultModal, setShowResultModal] = useState(false);
  const [timeToNext, setTimeToNext] = useState('');

  useEffect(() => {
    const num = getDailyNumber();
    setTargetNumber(num);
    resetMascots();

    // Check history
    const todayStr = new Date().toDateString();
    const playedToday = user.history.find(h => h.date === todayStr && h.gameId === 'number');
    if (playedToday) {
      setGuesses(Array(playedToday.guesses).fill(num));
      const mockResult = evaluateNumber(num, num);
      setResults(Array(playedToday.guesses).fill(mockResult));
      setGameStatus(playedToday.result);
      setShowResultModal(true);
    }

    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      
      setTimeToNext(
        `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const submitGuess = () => {
    if (currentGuess.length !== 5) {
      emotions.onInvalid();
      setIsInvalid(true);
      setTimeout(() => setIsInvalid(false), 400);
      return;
    }

    const evaluation = evaluateNumber(currentGuess, targetNumber);
    const newGuesses = [...guesses, currentGuess];
    const newResults = [...results, evaluation];

    setGuesses(newGuesses);
    setResults(newResults);
    setCurrentGuess('');

    if (currentGuess === targetNumber) {
      setGameStatus('won');
      emotions.onWin(currentGuess);
      user.incrementStreak();
      user.addCoins(50);
      user.addHistory({
        date: new Date().toDateString(),
        gameId: 'number',
        word: targetNumber,
        guesses: newGuesses.length,
        result: 'won'
      });
      setTimeout(() => setShowResultModal(true), 1200);
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost');
      emotions.onLoss(targetNumber);
      user.resetStreak();
      user.addHistory({
        date: new Date().toDateString(),
        gameId: 'number',
        word: targetNumber,
        guesses: newGuesses.length,
        result: 'lost'
      });
      setTimeout(() => setShowResultModal(true), 1200);
    } else {
      const hasPartiallyCorrect = evaluation.some(r => r === 'correct' || r === 'present');
      if (hasPartiallyCorrect) {
        emotions.onCorrect(currentGuess);
      } else {
        emotions.onIncorrect();
      }
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameStatus !== 'playing') return;

    if (key === 'Enter') {
      submitGuess();
    } else if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
      emotions.onKeyPress();
    } else if (/^[1-9]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key);
      emotions.onKeyPress();
    }
  };

  // Physical keyboard numpad listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameStatus]);

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-lg mx-auto min-h-[calc(100vh-60px)] px-4">
      <Confetti active={gameStatus === 'won'} word="12345" />

      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 z-10">
        <button onClick={() => navigate('/hub')} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-black tracking-widest text-xs uppercase text-emerald-400">Number Mess</span>
          {gameStatus !== 'playing' && (
            <span className="text-[10px] text-white/50 font-bold flex items-center gap-1 mt-0.5">
              <Timer size={10} /> Next in {timeToNext}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-xl text-xs">
            <Flame size={14} />
            <span>{user.streak}</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-yellow-300 bg-yellow-500/10 px-2.5 py-1 rounded-xl text-xs">
            <Coins size={14} className="animate-bounce" />
            <span>{user.coins}</span>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center py-6">
        <Board 
          guesses={guesses} 
          results={results} 
          currentGuess={currentGuess} 
          isInvalid={isInvalid} 
        />
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

      {/* Number Pad Keypad */}
      <div className="w-full z-10">
        <NumPad 
          onKeyPress={handleKeyPress} 
          guesses={guesses} 
          results={results} 
        />
      </div>

      <ResultModal 
        isOpen={showResultModal} 
        onClose={() => setShowResultModal(false)} 
        status={gameStatus} 
        guesses={guesses} 
        targetWord={targetNumber} 
        hardMode={false} 
        gameId="number" 
        onRestart={() => {
          setGuesses([]);
          setResults([]);
          setCurrentGuess('');
          setGameStatus('playing');
          setShowResultModal(false);
        }}
      />
    </div>
  );
};

export default NumberGame;
