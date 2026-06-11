import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useCharacterStore } from '../../store/characterStore';
import { useCharacterEmotions } from '../../hooks/useCharacterEmotions';
import { getDailyWord } from '../../utils/dailyWord';
import { evaluateGuess, LetterState } from '../../utils/evaluateGuess';
import { Board } from '../../components/Board/Board';
import { Keyboard } from '../../components/Keyboard/Keyboard';
import { Wordy } from '../../assets/characters/Wordy';
import { Messy } from '../../assets/characters/Messy';
import { SpeechBubble } from '../../assets/characters/SpeechBubble';
import { ResultModal } from '../../components/Modals/ResultModal';
import { Confetti } from '../../engine/Confetti';
import { ArrowLeft, Coins, Flame, Star, Timer } from 'lucide-react';
import { WORDS } from '../../utils/wordList';

export const ClassicGame = () => {
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

  // Daily target word
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<LetterState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showResultModal, setShowResultModal] = useState(false);
  const [timeToNext, setTimeToNext] = useState('');

  // Get daily target word and countdown
  useEffect(() => {
    const word = getDailyWord().toUpperCase();
    setTargetWord(word);
    resetMascots();

    // Check if daily already played
    const todayStr = new Date().toDateString();
    const playedToday = user.history.find(h => h.date === todayStr && h.gameId === 'classic');
    if (playedToday) {
      setGuesses(Array(playedToday.guesses).fill(word)); // Mock visual solved board
      const mockResult = evaluateGuess(word, word);
      setResults(Array(playedToday.guesses).fill(mockResult));
      setGameStatus(playedToday.result);
      setShowResultModal(true);
    }

    // Countdown timer calculation
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

  // Keyboard Event Handlers
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

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameStatus]);

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
    const newGuesses = [...guesses, cleanGuess];
    const newResults = [...results, evaluation];

    setGuesses(newGuesses);
    setResults(newResults);
    setCurrentGuess('');

    if (cleanGuess === targetWord) {
      setGameStatus('won');
      emotions.onWin(cleanGuess);
      user.incrementStreak();
      user.addCoins(50);
      user.addHistory({
        date: new Date().toDateString(),
        gameId: 'classic',
        word: targetWord,
        guesses: newGuesses.length,
        result: 'won'
      });
      setTimeout(() => setShowResultModal(true), 1200);
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost');
      emotions.onLoss(targetWord);
      user.resetStreak();
      user.addHistory({
        date: new Date().toDateString(),
        gameId: 'classic',
        word: targetWord,
        guesses: newGuesses.length,
        result: 'lost'
      });
      setTimeout(() => setShowResultModal(true), 1200);
    } else {
      // Evaluate if some characters are correct/present
      const isPartiallyCorrect = evaluation.some(r => r === 'correct' || r === 'present');
      if (isPartiallyCorrect) {
        emotions.onCorrect(cleanGuess);
      } else {
        emotions.onIncorrect();
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-lg mx-auto min-h-[calc(100vh-60px)] px-4">
      {/* Confetti Explosion on Win */}
      <Confetti active={gameStatus === 'won'} word={targetWord} />

      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 z-10">
        <button onClick={() => navigate('/hub')} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-black tracking-widest text-xs uppercase text-[var(--wm-correct)]">Classic Mess</span>
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

      {/* Characters Bottom Corners */}
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
          guesses={guesses} 
          results={results} 
        />
      </div>

      <ResultModal 
        isOpen={showResultModal} 
        onClose={() => setShowResultModal(false)} 
        status={gameStatus} 
        guesses={guesses} 
        targetWord={targetWord} 
        hardMode={false} 
        gameId="classic" 
        onRestart={() => {
          // Practice reset for sandbox play if solved/failed
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

export default ClassicGame;
