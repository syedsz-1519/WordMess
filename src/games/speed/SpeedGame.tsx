import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useCharacterStore } from '../../store/characterStore';
import { useCharacterEmotions } from '../../hooks/useCharacterEmotions';
import { getRandomWord } from '../../utils/dailyWord';
import { evaluateGuess, LetterState } from '../../utils/evaluateGuess';
import { Board } from '../../components/Board/Board';
import { Keyboard } from '../../components/Keyboard/Keyboard';
import { Wordy } from '../../assets/characters/Wordy';
import { Messy } from '../../assets/characters/Messy';
import { SpeechBubble } from '../../assets/characters/SpeechBubble';
import { ResultModal } from '../../components/Modals/ResultModal';
import { Confetti } from '../../engine/Confetti';
import { ArrowLeft, Coins, Flame, Timer, Play } from 'lucide-react';
import { WORDS } from '../../utils/wordList';

export const SpeedGame = () => {
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

  const [score, setScore] = useState(0);
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<LetterState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [showResultModal, setShowResultModal] = useState(false);

  const timerRef = useRef<any>(null);

  const scoreRef = useRef(score);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Initialize first word
  useEffect(() => {
    setTargetWord(getRandomWord().toUpperCase());
    resetMascots();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleGameOver = () => {
    setGameStatus('ended');
    emotions.onLoss();
    triggerMessy('laugh', `Haha! Solved ${scoreRef.current} words!`);
    
    // Save to user store history if applicable
    user.addHistory({
      date: new Date().toDateString(),
      gameId: 'speed',
      word: `Score: ${scoreRef.current}`,
      guesses: scoreRef.current,
      result: scoreRef.current >= 3 ? 'won' : 'lost'
    });
    
    user.addCoins(scoreRef.current * 5); // +5 coins per solved word
    setShowResultModal(true);
  };

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
      // Correct! Increment score, and reset board for NEXT word
      setScore((s) => s + 1);
      emotions.onCorrect(cleanGuess);
      setGuesses([]);
      setResults([]);
      setTargetWord(getRandomWord().toUpperCase());
    } else if (newGuesses.length >= 6) {
      // Out of tries for this word, auto-load next word (penalty: no score increment)
      emotions.onIncorrect();
      setGuesses([]);
      setResults([]);
      setTargetWord(getRandomWord().toUpperCase());
    } else {
      const isPartiallyCorrect = evaluation.some(r => r === 'correct' || r === 'present');
      if (isPartiallyCorrect) {
        emotions.onCorrect(cleanGuess);
      } else {
        emotions.onIncorrect();
      }
    }
  };

  const handleStartGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGuesses([]);
    setResults([]);
    setCurrentGuess('');
    setTargetWord(getRandomWord().toUpperCase());
    setGameStatus('playing');
    resetMascots();
  };

  const handleKeyPress = (key: string) => {
    if (gameStatus === 'idle') {
      handleStartGame();
      return;
    }
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

  // Timer Tick Down
  useEffect(() => {
    if (gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleGameOver();
            return 0;
          }
          if (t === 10) {
            emotions.onPanic();
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameStatus, targetWord]);



  // Timer bar colors
  let timerBarColor = 'bg-emerald-500';
  if (timeLeft < 20) timerBarColor = 'bg-amber-500';
  if (timeLeft < 10) timerBarColor = 'bg-rose-500 animate-pulse';

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-lg mx-auto min-h-[calc(100vh-60px)] px-4">
      {/* Confetti overlay for any correct guess */}
      <Confetti active={gameStatus === 'playing' && guesses.length === 0 && score > 0} word="SPEED" />

      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 z-10">
        <button onClick={() => navigate('/hub')} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-black tracking-widest text-xs uppercase text-rose-500">Speed Mess</span>
          <span className="text-[10px] text-white/50 font-bold">Solved: {score}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-bold text-yellow-300 bg-yellow-500/10 px-2.5 py-1 rounded-xl text-xs">
            <Coins size={14} className="animate-bounce" />
            <span>{user.coins}</span>
          </div>
        </div>
      </div>

      {/* Timer Bar Indicator */}
      <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden z-10">
        <div 
          className={`h-full transition-all duration-1000 ${timerBarColor}`} 
          style={{ width: `${(timeLeft / 60) * 100}%` }}
        />
      </div>

      {/* Play Overlay if Idle */}
      {gameStatus === 'idle' ? (
        <div className="flex-1 flex flex-col justify-center items-center gap-6 z-10">
          <p className="text-center text-white/60 text-sm max-w-xs font-semibold">
            Solve as many 5-letter words as possible before the 60-second timer runs out. Click below to start!
          </p>
          <button
            onClick={handleStartGame}
            className="flex items-center gap-2 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-3xl font-black text-lg uppercase tracking-widest shadow-lg shadow-rose-500/30 hover:scale-105 transition-transform active:scale-95"
          >
            <Play size={20} fill="currentColor" /> Play Speed
          </button>
        </div>
      ) : (
        /* Board */
        <div className="flex-1 flex items-center justify-center py-6">
          <Board 
            guesses={guesses} 
            results={results} 
            currentGuess={currentGuess} 
            isInvalid={isInvalid} 
          />
        </div>
      )}

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
          guesses={guesses} 
          results={results} 
        />
      </div>

      <ResultModal 
        isOpen={showResultModal} 
        onClose={() => setShowResultModal(false)} 
        status={score >= 3 ? 'won' : 'lost'} 
        guesses={guesses} 
        targetWord={`solved: ${score} words`} 
        hardMode={false} 
        gameId="speed" 
        onRestart={handleStartGame}
      />
    </div>
  );
};

export default SpeedGame;
