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
import { ArrowLeft, Coins, Flame, Timer } from 'lucide-react';
import { WORDS } from '../../utils/wordList';

export const DoubleGame = () => {
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

  const [targetWord1, setTargetWord1] = useState('');
  const [targetWord2, setTargetWord2] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showResultModal, setShowResultModal] = useState(false);
  const [timeToNext, setTimeToNext] = useState('');

  // Evaluate results for each board individually
  const results1 = guesses.map((g) => evaluateGuess(g, targetWord1));
  const results2 = guesses.map((g) => evaluateGuess(g, targetWord2));

  // Determine if boards are solved
  const isSolved1 = guesses.includes(targetWord1);
  const isSolved2 = guesses.includes(targetWord2);

  // Generate target words from daily seed + offset
  useEffect(() => {
    const idx = getDailyWordIndex();
    const w1 = WORDS[idx].toUpperCase();
    const w2 = WORDS[(idx + 3) % WORDS.length].toUpperCase(); // offset by 3 to ensure distinct word
    setTargetWord1(w1);
    setTargetWord2(w2);
    resetMascots();

    // Check history
    const todayStr = new Date().toDateString();
    const playedToday = user.history.find(h => h.date === todayStr && h.gameId === 'double');
    if (playedToday) {
      setGuesses([w1, w2]); // Mock visual solve
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

    const newGuesses = [...guesses, cleanGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    // Check if both solved
    const nextSolved1 = newGuesses.includes(targetWord1);
    const nextSolved2 = newGuesses.includes(targetWord2);

    if (nextSolved1 && nextSolved2) {
      setGameStatus('won');
      emotions.onWin(cleanGuess);
      user.incrementStreak();
      user.addCoins(75); // bonus coin for pro daily double
      user.addHistory({
        date: new Date().toDateString(),
        gameId: 'double',
        word: `${targetWord1}/${targetWord2}`,
        guesses: newGuesses.length,
        result: 'won'
      });
      setTimeout(() => setShowResultModal(true), 1200);
    } else if (newGuesses.length >= 7) {
      setGameStatus('lost');
      emotions.onLoss(`${targetWord1}/${targetWord2}`);
      user.resetStreak();
      user.addHistory({
        date: new Date().toDateString(),
        gameId: 'double',
        word: `${targetWord1}/${targetWord2}`,
        guesses: newGuesses.length,
        result: 'lost'
      });
      setTimeout(() => setShowResultModal(true), 1200);
    } else {
      // Evaluate results on boards
      const wasSolvedBefore1 = guesses.includes(targetWord1);
      const wasSolvedBefore2 = guesses.includes(targetWord2);

      const newlySolved1 = !wasSolvedBefore1 && cleanGuess === targetWord1;
      const newlySolved2 = !wasSolvedBefore2 && cleanGuess === targetWord2;

      if (newlySolved1 || newlySolved2) {
        emotions.onCorrect(cleanGuess);
        triggerWordy('cheer', 'Halfway there! 🚀');
      } else {
        // Evaluate green/present occurrences
        const ev1 = evaluateGuess(cleanGuess, targetWord1);
        const ev2 = evaluateGuess(cleanGuess, targetWord2);

        const partial1 = !isSolved1 && ev1.some(s => s === 'correct' || s === 'present');
        const partial2 = !isSolved2 && ev2.some(s => s === 'correct' || s === 'present');

        if (partial1 || partial2) {
          emotions.onCorrect(cleanGuess);
        } else {
          emotions.onIncorrect();
        }
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-4xl mx-auto min-h-[calc(100vh-60px)] px-4">
      <Confetti active={gameStatus === 'won'} word={targetWord1} />

      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 z-10">
        <button onClick={() => navigate('/hub')} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-black tracking-widest text-xs uppercase text-teal-300">Double Mess (7 Guesses)</span>
          {gameStatus !== 'playing' && (
            <span className="text-[10px] text-white/50 font-bold flex items-center gap-1 mt-0.5">
              <Timer size={10} /> Next in {timeToNext}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-bold text-yellow-300 bg-yellow-500/10 px-2.5 py-1 rounded-xl text-xs">
            <Coins size={14} className="animate-bounce" />
            <span>{user.coins}</span>
          </div>
        </div>
      </div>

      {/* Side-by-side Boards */}
      <div className="flex-1 flex gap-4 sm:gap-8 justify-center items-center py-6 w-full overflow-x-auto max-w-3xl">
        {/* Board 1 */}
        <div className={`flex flex-col items-center transition-all ${isSolved1 ? 'opacity-50 scale-95' : ''}`}>
          <h3 className="text-xs font-black uppercase text-emerald-400 mb-2">Board 1</h3>
          <Board
            guesses={guesses}
            results={results1}
            currentGuess={isSolved1 ? '' : currentGuess}
            isInvalid={isInvalid && !isSolved1}
            maxGuesses={7}
          />
        </div>

        {/* Board 2 */}
        <div className={`flex flex-col items-center transition-all ${isSolved2 ? 'opacity-50 scale-95' : ''}`}>
          <h3 className="text-xs font-black uppercase text-orange-400 mb-2">Board 2</h3>
          <Board
            guesses={guesses}
            results={results2}
            currentGuess={isSolved2 ? '' : currentGuess}
            isInvalid={isInvalid && !isSolved2}
            maxGuesses={7}
          />
        </div>
      </div>

      {/* Mascot indicators */}
      <div className="w-full max-w-lg flex justify-between px-4 mb-4 items-end z-10">
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
          results={guesses.map((_, i) => {
            // Merge results for keyboard colors: correct > present > absent
            const ev1 = results1[i];
            const ev2 = results2[i];
            return ev1.map((val, idx) => {
              if (val === 'correct' || ev2[idx] === 'correct') return 'correct';
              if (val === 'present' || ev2[idx] === 'present') return 'present';
              return 'absent';
            });
          })} 
        />
      </div>

      <ResultModal 
        isOpen={showResultModal} 
        onClose={() => setShowResultModal(false)} 
        status={gameStatus} 
        guesses={guesses} 
        targetWord={`${targetWord1} & ${targetWord2}`} 
        hardMode={false} 
        gameId="double" 
        onRestart={() => {
          setGuesses([]);
          setCurrentGuess('');
          setGameStatus('playing');
          setShowResultModal(false);
        }}
      />
    </div>
  );
};

export default DoubleGame;
