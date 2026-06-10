import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Board } from '../../components/Board/Board';
import { Key } from '../../components/Keyboard/Key';
import { ResultModal } from '../../components/Modals/ResultModal';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useUserStore } from '../../store/userStore';
import { evaluateNumber } from '../../utils/evaluateNumber';
import { getNumberForLevel } from '../../utils/dailyWord';
import { LetterState } from '../../utils/evaluateGuess';

const NUMBER_KEYS = [
  ['1', '2', '3', '4', '5'],
  ['6', '7', '8', '9'],
  ['Enter', 'Backspace']
];

export const NumberGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const level = parseInt(searchParams.get('level') || '1', 10);
  
  const { addHistory, nextLevel } = useUserStore();
  const MAX_GUESSES = 6;
  const WORD_LENGTH = 5;
  
  // Local Game State
  const [targetNumber, setTargetNumber] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<LetterState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [isInvalid, setIsInvalid] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Initialize level
  useEffect(() => {
    const target = getNumberForLevel(level);
    setTargetNumber(target);
    setGuesses([]);
    setResults([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setShowResult(false);
  }, [level]);

  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) {
      setIsInvalid(true);
      setTimeout(() => setIsInvalid(false), 400);
      return;
    }

    const result = evaluateNumber(currentGuess, targetNumber);
    
    const newGuesses = [...guesses, currentGuess];
    const newResults = [...results, result];
    
    setGuesses(newGuesses);
    setResults(newResults);
    setCurrentGuess('');

    const isWin = currentGuess === targetNumber;
    const isLoss = newGuesses.length >= MAX_GUESSES && !isWin;

    if (isWin || isLoss) {
      setGameStatus(isWin ? 'won' : 'lost');
      setTimeout(() => {
        setShowResult(true);
        addHistory({
          date: new Date().toISOString(),
          gameId: 'number',
          word: targetNumber,
          guesses: isWin ? newGuesses.length : MAX_GUESSES,
          result: isWin ? 'won' : 'lost'
        });
      }, 1500);
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameStatus !== 'playing') return;

    if (key === 'Enter') {
      submitGuess();
    } else if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && /^[1-9]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  };

  useKeyboard(handleKeyPress);

  const handleNextLevel = () => {
    nextLevel('number');
    navigate(`/game/number?level=${level + 1}`);
  };

  const handleRestart = () => {
    navigate(`/game/number?level=${level}`);
    const target = getNumberForLevel(level);
    setTargetNumber(target);
    setGuesses([]);
    setResults([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setShowResult(false);
  };

  // Color mapping for number keys
  const digitStatuses: Record<string, LetterState> = {};
  guesses.forEach((guess, i) => {
    guess.split('').forEach((digit, j) => {
      const currentStatus = digitStatuses[digit];
      const newStatus = results[i]?.[j];
      
      if (!newStatus) return;
      
      if (newStatus === 'correct') {
        digitStatuses[digit] = 'correct';
      } else if (newStatus === 'present' && currentStatus !== 'correct') {
        digitStatuses[digit] = 'present';
      } else if (newStatus === 'absent' && currentStatus !== 'correct' && currentStatus !== 'present') {
        digitStatuses[digit] = 'absent';
      }
    });
  });

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-6 w-full max-w-lg mx-auto">
      <div className="text-center mb-2">
        <span className="text-[10px] text-[var(--wm-text-muted)] font-bold uppercase tracking-widest bg-[var(--wm-surface)] px-3 py-1 rounded-full border border-[var(--wm-border)]">
          Number Mode
        </span>
        <p className="text-xs text-[var(--wm-text-muted)] mt-1.5 px-6">
          Find the 5-digit code. Digits 1-9 only (no zeros).
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <Board 
          guesses={guesses}
          results={results}
          currentGuess={currentGuess}
          isInvalid={isInvalid}
          maxGuesses={MAX_GUESSES}
        />
      </div>

      <div className="w-full mt-4 max-w-[400px] px-4 pb-4 flex flex-col gap-2">
        {NUMBER_KEYS.map((row, i) => (
          <div key={i} className="flex justify-center gap-2">
            {row.map((key) => (
              <Key
                key={key}
                value={key}
                onClick={handleKeyPress}
                status={digitStatuses[key] || 'empty'}
                flex={key.length > 1 ? 2 : 1}
              />
            ))}
          </div>
        ))}
      </div>

      <ResultModal 
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        status={gameStatus}
        guesses={results}
        targetWord={targetNumber}
        hardMode={false}
        gameId="number"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
