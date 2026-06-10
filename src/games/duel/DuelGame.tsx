import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Board } from '../../components/Board/Board';
import { Keyboard } from '../../components/Keyboard/Keyboard';
import { ResultModal } from '../../components/Modals/ResultModal';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useUserStore } from '../../store/userStore';
import { evaluateGuess, LetterState } from '../../utils/evaluateGuess';
import { getWordForLevel, getRandomWord } from '../../utils/dailyWord';
import { WORD_LENGTH } from '../../utils/wordList';

export const DuelGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const level = parseInt(searchParams.get('level') || '1', 10);
  
  const { addHistory, nextLevel } = useUserStore();
  const MAX_GUESSES = 6;
  
  // Game state
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showResult, setShowResult] = useState(false);
  const [duelResultText, setDuelResultText] = useState('');

  // Player state
  const [playerGuesses, setPlayerGuesses] = useState<string[]>([]);
  const [playerResults, setPlayerResults] = useState<LetterState[][]>([]);
  const [playerWon, setPlayerWon] = useState(false);

  // Bot state
  const [botGuesses, setBotGuesses] = useState<string[]>([]);
  const [botResults, setBotResults] = useState<LetterState[][]>([]);
  const [botWon, setBotWon] = useState(false);
  const [botStatusText, setBotStatusText] = useState('Waiting...');

  // Pre-planned bot path
  const botWinningTurnRef = useRef(5);
  const botGuessesListRef = useRef<string[]>([]);
  const botTimerRef = useRef<any>(null);

  // Initialize level
  useEffect(() => {
    const target = getWordForLevel(level * 5); // Unique word per duel level
    setTargetWord(target);
    
    setPlayerGuesses([]);
    setPlayerResults([]);
    setPlayerWon(false);
    
    setBotGuesses([]);
    setBotResults([]);
    setBotWon(false);
    setBotStatusText('Thinking...');
    
    setGameStatus('playing');
    setShowResult(false);
    
    // Plan bot's path: Bot wins on turn 4, 5, or 6
    const winTurn = Math.floor(Math.random() * 3) + 4; // 4, 5, or 6
    botWinningTurnRef.current = winTurn;
    
    // Generate dummy guesses for bot before the win
    const path: string[] = [];
    for (let i = 0; i < winTurn - 1; i++) {
      let g = getRandomWord();
      while (g === target || path.includes(g)) g = getRandomWord();
      path.push(g);
    }
    path.push(target); // Final winning guess
    botGuessesListRef.current = path;

    // Start bot turn timer
    if (botTimerRef.current) clearInterval(botTimerRef.current);
    
    let botTurnIndex = 0;
    botTimerRef.current = setInterval(() => {
      if (botTurnIndex >= winTurn || playerWon || botWon || gameStatus !== 'playing') {
        clearInterval(botTimerRef.current);
        return;
      }
      
      // Bot makes a guess
      const botGuess = botGuessesListRef.current[botTurnIndex];
      const botRes = evaluateGuess(botGuess, target);
      
      setBotGuesses(prev => {
        const next = [...prev, botGuess];
        if (botGuess === target) {
          setBotWon(true);
          handleGameOver(playerGuesses, next, false, target);
        } else if (next.length >= MAX_GUESSES) {
          handleGameOver(playerGuesses, next, false, target);
        }
        return next;
      });
      
      setBotResults(prev => [...prev, botRes]);
      setBotStatusText(`Just guessed: ${botGuess}!`);
      
      botTurnIndex++;
    }, 5500); // Bot guesses every 5.5 seconds

    return () => {
      if (botTimerRef.current) clearInterval(botTimerRef.current);
    };
  }, [level]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (botTimerRef.current) clearInterval(botTimerRef.current);
    };
  }, []);

  const handleGameOver = (pGuesses: string[], bGuesses: string[], playerDidWin: boolean, word: string) => {
    if (botTimerRef.current) clearInterval(botTimerRef.current);
    
    let status: 'won' | 'lost' = 'lost';
    if (playerDidWin) {
      status = 'won';
      setDuelResultText('Victory! You beat the WordMess Bot!');
    } else {
      setDuelResultText('Defeat! The Bot guessed the word first!');
    }

    setGameStatus(status);
    
    setTimeout(() => {
      setShowResult(true);
      addHistory({
        date: new Date().toISOString(),
        gameId: 'duel',
        word: `VS Bot (Word: ${word})`,
        guesses: pGuesses.length,
        result: status
      });
    }, 1500);
  };

  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH || gameStatus !== 'playing') {
      setIsInvalid(true);
      setTimeout(() => setIsInvalid(false), 400);
      return;
    }

    const res = evaluateGuess(currentGuess, targetWord);
    const newGuesses = [...playerGuesses, currentGuess];
    const newResults = [...playerResults, res];

    setPlayerGuesses(newGuesses);
    setPlayerResults(newResults);
    setCurrentGuess('');

    if (currentGuess === targetWord) {
      setPlayerWon(true);
      handleGameOver(newGuesses, botGuesses, true, targetWord);
    } else if (newGuesses.length >= MAX_GUESSES) {
      handleGameOver(newGuesses, botGuesses, false, targetWord);
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameStatus !== 'playing') return;

    if (key === 'Enter') {
      submitGuess();
    } else if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  };

  useKeyboard(handleKeyPress);

  const handleNextLevel = () => {
    nextLevel('duel');
    navigate(`/game/duel?level=${level + 1}`);
  };

  const handleRestart = () => {
    navigate(`/game/duel?level=${level}`);
    // Will trigger useEffect restart
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-4xl mx-auto double-game-container">
      
      {/* Status Bar */}
      <div className="flex justify-between w-full px-6 mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-[var(--wm-text-muted)] font-bold uppercase tracking-widest">Player Board</span>
          <span className="text-sm font-black text-[var(--wm-correct)]">Active</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[var(--wm-text-muted)] font-bold uppercase tracking-widest">WordMess Bot</span>
          <span className={`text-sm font-black transition-colors ${botWon ? 'text-red-500' : 'text-orange-400'}`}>
            {botWon ? 'SOLVED!' : botStatusText}
          </span>
        </div>
      </div>

      {/* Duel Arena */}
      <div className="flex-1 flex gap-3 sm:gap-6 items-center justify-center w-full px-2 sm:px-4">
        {/* Player Board */}
        <div className="w-1/2">
          <Board 
            guesses={playerGuesses}
            results={playerResults}
            currentGuess={currentGuess}
            isInvalid={isInvalid}
            maxGuesses={MAX_GUESSES}
          />
        </div>

        {/* Bot Board */}
        <div className="w-1/2 opacity-80 select-none pointer-events-none">
          <Board 
            guesses={botGuesses}
            results={botResults}
            currentGuess=""
            isInvalid={false}
            maxGuesses={MAX_GUESSES}
          />
        </div>
      </div>

      <div className="w-full mt-4">
        <Keyboard 
          onKeyPress={handleKeyPress}
          guesses={playerGuesses}
          results={playerResults}
        />
      </div>

      <ResultModal 
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        status={gameStatus}
        guesses={playerResults}
        targetWord={`${targetWord} (${duelResultText})`}
        hardMode={false}
        gameId="duel"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
