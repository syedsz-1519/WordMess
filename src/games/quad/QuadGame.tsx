import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useCharacterStore } from '../../store/characterStore';
import { useCharacterEmotions } from '../../hooks/useCharacterEmotions';
import { getDailyWordIndex } from '../../utils/dailyWord';
import { evaluateGuess, LetterState } from '../../utils/evaluateGuess';
import { Board } from '../../components/Board/Board';
import { Keyboard } from '../../components/Keyboard/Keyboard';
import { Wordy } from '../../assets/characters/Wordy';
import { Messy } from '../../assets/characters/Messy';
import { SpeechBubble } from '../../assets/characters/SpeechBubble';
import { ResultModal } from '../../components/Modals/ResultModal';
import { Confetti } from '../../engine/Confetti';
import { ArrowLeft, Coins, Flame } from 'lucide-react';
import { WORDS } from '../../utils/wordList';

export const QuadGame = () => {
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
  const [targetWord3, setTargetWord3] = useState('');
  const [targetWord4, setTargetWord4] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showResultModal, setShowResultModal] = useState(false);

  // Evaluate results for each board
  const results1 = guesses.map((g) => evaluateGuess(g, targetWord1));
  const results2 = guesses.map((g) => evaluateGuess(g, targetWord2));
  const results3 = guesses.map((g) => evaluateGuess(g, targetWord3));
  const results4 = guesses.map((g) => evaluateGuess(g, targetWord4));

  const isSolved1 = guesses.includes(targetWord1);
  const isSolved2 = guesses.includes(targetWord2);
  const isSolved3 = guesses.includes(targetWord3);
  const isSolved4 = guesses.includes(targetWord4);

  useEffect(() => {
    const idx = getDailyWordIndex();
    setTargetWord1(WORDS[idx].toUpperCase());
    setTargetWord2(WORDS[(idx + 2) % WORDS.length].toUpperCase());
    setTargetWord3(WORDS[(idx + 4) % WORDS.length].toUpperCase());
    setTargetWord4(WORDS[(idx + 6) % WORDS.length].toUpperCase());
    resetMascots();

    // Check history
    const todayStr = new Date().toDateString();
    const playedToday = user.history.find(h => h.date === todayStr && h.gameId === 'quad');
    if (playedToday) {
      setGuesses([WORDS[idx].toUpperCase()]);
      setGameStatus(playedToday.result);
      setShowResultModal(true);
    }
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

    const nextSolved1 = newGuesses.includes(targetWord1);
    const nextSolved2 = newGuesses.includes(targetWord2);
    const nextSolved3 = newGuesses.includes(targetWord3);
    const nextSolved4 = newGuesses.includes(targetWord4);

    if (nextSolved1 && nextSolved2 && nextSolved3 && nextSolved4) {
      setGameStatus('won');
      emotions.onWin(cleanGuess);
      user.incrementStreak();
      user.addCoins(100); // Quad win bonus!
      user.addHistory({
        date: new Date().toDateString(),
        gameId: 'quad',
        word: '4 words solved',
        guesses: newGuesses.length,
        result: 'won'
      });
      setTimeout(() => setShowResultModal(true), 1200);
    } else if (newGuesses.length >= 9) {
      setGameStatus('lost');
      emotions.onLoss();
      user.resetStreak();
      user.addHistory({
        date: new Date().toDateString(),
        gameId: 'quad',
        word: '4 words',
        guesses: newGuesses.length,
        result: 'lost'
      });
      setTimeout(() => setShowResultModal(true), 1200);
    } else {
      // Evaluate correct triggers
      const wasSolved1 = guesses.includes(targetWord1);
      const wasSolved2 = guesses.includes(targetWord2);
      const wasSolved3 = guesses.includes(targetWord3);
      const wasSolved4 = guesses.includes(targetWord4);

      const newlySolved = 
        (!wasSolved1 && cleanGuess === targetWord1) ||
        (!wasSolved2 && cleanGuess === targetWord2) ||
        (!wasSolved3 && cleanGuess === targetWord3) ||
        (!wasSolved4 && cleanGuess === targetWord4);

      if (newlySolved) {
        emotions.onCorrect(cleanGuess);
        triggerWordy('cheer', 'Solved a board! 🌟');
      } else {
        const ev1 = evaluateGuess(cleanGuess, targetWord1);
        const ev2 = evaluateGuess(cleanGuess, targetWord2);
        const ev3 = evaluateGuess(cleanGuess, targetWord3);
        const ev4 = evaluateGuess(cleanGuess, targetWord4);

        const partial = 
          (!isSolved1 && ev1.some(s => s === 'correct' || s === 'present')) ||
          (!isSolved2 && ev2.some(s => s === 'correct' || s === 'present')) ||
          (!isSolved3 && ev3.some(s => s === 'correct' || s === 'present')) ||
          (!isSolved4 && ev4.some(s => s === 'correct' || s === 'present'));

        if (partial) {
          emotions.onCorrect(cleanGuess);
        } else {
          emotions.onIncorrect();
        }
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-5xl mx-auto min-h-[calc(100vh-60px)] px-4">
      <Confetti active={gameStatus === 'won'} word={targetWord1} />

      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 z-10 max-w-lg">
        <button onClick={() => navigate('/hub')} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={18} />
        </button>
        <span className="font-black tracking-widest text-xs uppercase text-emerald-400">Quad Mess (9 Guesses)</span>
        <div className="flex items-center gap-1.5 bg-yellow-500/10 px-2.5 py-1 rounded-xl text-xs text-yellow-300 font-bold">
          <Coins size={14} className="animate-bounce" />
          <span>{user.coins}</span>
        </div>
      </div>

      {/* Quad 2x2 layout of boards */}
      <div className="flex-1 w-full grid grid-cols-2 gap-4 max-w-4xl py-4 overflow-y-auto">
        {/* Board 1 */}
        <div className={`flex flex-col items-center p-2 rounded-2xl border bg-black/10 transition-all ${isSolved1 ? 'opacity-40 border-emerald-500/30' : 'border-white/5'}`}>
          <div className="text-[10px] uppercase font-black tracking-widest text-emerald-400 mb-1">Board 1</div>
          <div className="zoom-quad-board scale-90 origin-top">
            <Board
              guesses={guesses}
              results={results1}
              currentGuess={isSolved1 ? '' : currentGuess}
              isInvalid={isInvalid && !isSolved1}
              maxGuesses={9}
            />
          </div>
        </div>

        {/* Board 2 */}
        <div className={`flex flex-col items-center p-2 rounded-2xl border bg-black/10 transition-all ${isSolved2 ? 'opacity-40 border-emerald-500/30' : 'border-white/5'}`}>
          <div className="text-[10px] uppercase font-black tracking-widest text-orange-400 mb-1">Board 2</div>
          <div className="zoom-quad-board scale-90 origin-top">
            <Board
              guesses={guesses}
              results={results2}
              currentGuess={isSolved2 ? '' : currentGuess}
              isInvalid={isInvalid && !isSolved2}
              maxGuesses={9}
            />
          </div>
        </div>

        {/* Board 3 */}
        <div className={`flex flex-col items-center p-2 rounded-2xl border bg-black/10 transition-all ${isSolved3 ? 'opacity-40 border-emerald-500/30' : 'border-white/5'}`}>
          <div className="text-[10px] uppercase font-black tracking-widest text-sky-400 mb-1">Board 3</div>
          <div className="zoom-quad-board scale-90 origin-top">
            <Board
              guesses={guesses}
              results={results3}
              currentGuess={isSolved3 ? '' : currentGuess}
              isInvalid={isInvalid && !isSolved3}
              maxGuesses={9}
            />
          </div>
        </div>

        {/* Board 4 */}
        <div className={`flex flex-col items-center p-2 rounded-2xl border bg-black/10 transition-all ${isSolved4 ? 'opacity-40 border-emerald-500/30' : 'border-white/5'}`}>
          <div className="text-[10px] uppercase font-black tracking-widest text-purple-400 mb-1">Board 4</div>
          <div className="zoom-quad-board scale-90 origin-top">
            <Board
              guesses={guesses}
              results={results4}
              currentGuess={isSolved4 ? '' : currentGuess}
              isInvalid={isInvalid && !isSolved4}
              maxGuesses={9}
            />
          </div>
        </div>
      </div>

      {/* Mascot indicators */}
      <div className="w-full max-w-lg flex justify-between px-4 mb-3 items-end z-10">
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
            // Merge keyboard colors for all active boards
            const ev1 = results1[i];
            const ev2 = results2[i];
            const ev3 = results3[i];
            const ev4 = results4[i];
            return ev1.map((val, idx) => {
              const states = [val, ev2[idx], ev3[idx], ev4[idx]];
              if (states.includes('correct')) return 'correct';
              if (states.includes('present')) return 'present';
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
        targetWord={`${targetWord1}, ${targetWord2}, ${targetWord3}, ${targetWord4}`} 
        hardMode={false} 
        gameId="quad" 
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

export default QuadGame;
