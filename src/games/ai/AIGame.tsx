import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useCharacterStore } from '../../store/characterStore';
import { useCharacterEmotions } from '../../hooks/useCharacterEmotions';
import { getDailyWord } from '../../utils/dailyWord';
import { getClaudeCrypticHint } from '../../lib/claude';
import { evaluateGuess, LetterState } from '../../utils/evaluateGuess';
import { Board } from '../../components/Board/Board';
import { Keyboard } from '../../components/Keyboard/Keyboard';
import { Wordy } from '../../assets/characters/Wordy';
import { Messy } from '../../assets/characters/Messy';
import { SpeechBubble } from '../../assets/characters/SpeechBubble';
import { OracleOrb } from '../../assets/characters/OracleOrb';
import { ResultModal } from '../../components/Modals/ResultModal';
import { Confetti } from '../../engine/Confetti';
import { ArrowLeft, Coins, Flame, Sparkles } from 'lucide-react';
import { WORDS } from '../../utils/wordList';

export const AIGame = () => {
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
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showResultModal, setShowResultModal] = useState(false);

  // Oracle specific states
  const [oracleState, setOracleState] = useState<'breathing' | 'thinking' | 'speaking'>('breathing');
  const [oracleText, setOracleText] = useState('Ask me for riddles. I know the path.');
  
  // Oracle Powers
  const [maxGuesses, setMaxGuesses] = useState(6);
  const [clearedKeys, setClearedKeys] = useState<string[]>([]);
  const [revealedLetterIdx, setRevealedLetterIdx] = useState<number | null>(null);

  useEffect(() => {
    const target = getDailyWord().toUpperCase();
    setTargetWord(target);
    resetMascots();

    // Check history
    const todayStr = new Date().toDateString();
    const playedToday = user.history.find(h => h.date === todayStr && h.gameId === 'ai');
    if (playedToday) {
      setGuesses([target]);
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
      // If key is cleared by oracle power, prevent typing it!
      if (clearedKeys.includes(key.toUpperCase())) {
        emotions.onInvalid();
        triggerMessy('mock', "That key is locked! 🔒");
        return;
      }
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
  }, [currentGuess, gameStatus, clearedKeys]);

  const submitGuess = async () => {
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

    if (cleanGuess === targetWord) {
      setGameStatus('won');
      emotions.onWin(cleanGuess);
      user.incrementStreak();
      user.addCoins(50);
      user.addHistory({
        date: new Date().toDateString(),
        gameId: 'ai',
        word: targetWord,
        guesses: newGuesses.length,
        result: 'won'
      });
      setOracleText("You guessed it! The secrets are solved. 🔮");
      setTimeout(() => setShowResultModal(true), 1200);
    } else if (newGuesses.length >= maxGuesses) {
      setGameStatus('lost');
      emotions.onLoss(targetWord);
      user.resetStreak();
      user.addHistory({
        date: new Date().toDateString(),
        gameId: 'ai',
        word: targetWord,
        guesses: newGuesses.length,
        result: 'lost'
      });
      setOracleText(`Alas! The word was ${targetWord}. 🔮`);
      setTimeout(() => setShowResultModal(true), 1200);
    } else {
      // Generate AI hint clue
      setOracleState('thinking');
      setOracleText("The Oracle gazes into the scroll...");
      
      try {
        const hint = await getClaudeCrypticHint(targetWord, cleanGuess, newGuesses.length);
        setOracleState('speaking');
        setOracleText(hint);
        emotions.onHint(hint);
        
        // Custom mock after guess 3
        if (newGuesses.length >= 3) {
          triggerMessy('laugh', 'Need help? HAHA!');
        }
      } catch (err) {
        setOracleState('breathing');
        setOracleText("The spirits are quiet. Try again.");
      }

      // Reset revealed position power for next round
      setRevealedLetterIdx(null);
    }
  };

  // Oracle Power 1: Clear 2 keys (Removes 2 wrong letters, costs 1 guess)
  const handleClearKeysPower = () => {
    if (gameStatus !== 'playing' || maxGuesses <= 2) return;
    
    // Find keys not in targetWord and not already cleared
    const wrongKeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(
      char => !targetWord.includes(char) && !clearedKeys.includes(char)
    );

    if (wrongKeys.length >= 2) {
      const selected = wrongKeys.sort(() => 0.5 - Math.random()).slice(0, 2);
      setClearedKeys([...clearedKeys, ...selected]);
      setMaxGuesses(g => g - 1); // Cost: reduces guess count
      emotions.onKeyPress();
      triggerWordy('happy', "Oracle swept two keys! 🧹");
    }
  };

  // Oracle Power 2: Reveal 1 Letter (Reveals a green position in next row, cost: -50 coins)
  const handleRevealLetterPower = () => {
    if (gameStatus !== 'playing' || user.coins < 50 || revealedLetterIdx !== null) return;
    
    // Pick a random unrevealed index
    const randomIdx = Math.floor(Math.random() * 5);
    setRevealedLetterIdx(randomIdx);
    user.spendCoins(50);
    emotions.onKeyPress();
    triggerWordy('happy', `Letter ${randomIdx + 1} is ${targetWord[randomIdx]}! 💡`);
  };

  // Results color evaluation: AI mode is monochrome/grey unless solved OR letter revealed
  const getAIResults = (): LetterState[][] => {
    return guesses.map((g, i) => {
      if (g === targetWord) {
        return Array(5).fill('correct');
      }
      const evaluation = evaluateGuess(g, targetWord);
      return evaluation.map((state, idx) => {
        // Only show correct (green) if revealed by power
        if (revealedLetterIdx === idx && i === guesses.length - 1) {
          return 'correct';
        }
        return 'absent'; // Force monochrome/grey
      });
    });
  };

  const aiResults = getAIResults();

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-lg mx-auto min-h-[calc(100vh-60px)] px-4">
      <Confetti active={gameStatus === 'won'} word={targetWord} />

      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 z-10">
        <button onClick={() => navigate('/hub')} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={18} />
        </button>
        <span className="font-black tracking-widest text-xs uppercase text-purple-400">AI Oracle (No Colors)</span>
        <div className="flex items-center gap-1.5 bg-yellow-500/10 px-2.5 py-1 rounded-xl text-xs text-yellow-300 font-bold">
          <Coins size={14} className="animate-bounce" />
          <span>{user.coins}</span>
        </div>
      </div>

      {/* Oracle Orb & Riddle Bubble */}
      <div className="w-full flex flex-col items-center gap-3 my-4 z-10">
        <OracleOrb state={oracleState} size={76} onClick={() => triggerWordy('happy', "Ask for help!")} />
        <div className="w-full bg-purple-950/20 border border-purple-500/20 rounded-2xl p-3 text-center text-xs font-semibold text-purple-300">
          "{oracleText}"
        </div>
      </div>

      {/* Oracle Power Sandbox Buttons */}
      <div className="w-full flex justify-center gap-2 mb-2 z-10">
        <button 
          onClick={handleClearKeysPower}
          disabled={maxGuesses <= 2}
          className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-[10px] font-black uppercase text-purple-400 hover:bg-purple-500/20"
        >
          Clear 2 Keys (Cost: 1 Guess)
        </button>
        <button 
          onClick={handleRevealLetterPower}
          disabled={user.coins < 50 || revealedLetterIdx !== null}
          className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-[10px] font-black uppercase text-purple-400 hover:bg-purple-500/20"
        >
          Reveal 1 Letter (Cost: 50 Coins)
        </button>
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center py-4">
        <Board 
          guesses={guesses} 
          results={aiResults} 
          currentGuess={currentGuess} 
          isInvalid={isInvalid}
          maxGuesses={maxGuesses}
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

      {/* Keyboard */}
      <div className="w-full z-10">
        <Keyboard 
          onKeyPress={handleKeyPress} 
          guesses={guesses} 
          results={aiResults}
        />
      </div>

      <ResultModal 
        isOpen={showResultModal} 
        onClose={() => setShowResultModal(false)} 
        status={gameStatus} 
        guesses={guesses} 
        targetWord={targetWord} 
        hardMode={false} 
        gameId="ai" 
        onRestart={() => {
          setGuesses([]);
          setCurrentGuess('');
          setGameStatus('playing');
          setMaxGuesses(6);
          setClearedKeys([]);
          setRevealedLetterIdx(null);
          setOracleText('The Oracle welcomes you back. Deducing again.');
          setShowResultModal(false);
        }}
      />
    </div>
  );
};

export default AIGame;
