import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Board } from '../../components/Board/Board';
import { Keyboard } from '../../components/Keyboard/Keyboard';
import { ResultModal } from '../../components/Modals/ResultModal';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useUserStore } from '../../store/userStore';
import { evaluateGuess, LetterState } from '../../utils/evaluateGuess';
import { getRandomWord } from '../../utils/dailyWord';
import { WORD_LENGTH } from '../../utils/wordList';
import { motion } from 'framer-motion';

export const SpeedGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const level = parseInt(searchParams.get('level') || '1', 10);
  
  const { addHistory, levels, nextLevel } = useUserStore();
  
  // Local Game State
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<LetterState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [isInvalid, setIsInvalid] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    resetBoard();
    setScore(0);
    setTimeLeft(60);
    setGameStatus('idle');
    setShowResult(false);
  }, [level]);

  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(t);
    } else if (gameStatus === 'playing' && timeLeft === 0) {
      handleGameOver();
    }
  }, [gameStatus, timeLeft]);

  const resetBoard = () => {
    setTargetWord(getRandomWord());
    setGuesses([]);
    setResults([]);
    setCurrentGuess('');
  };

  const handleGameOver = () => {
    const isWin = score >= 3; // Win condition: 3 words in 60s
    setGameStatus(isWin ? 'won' : 'lost');
    setTimeout(() => {
      setShowResult(true);
      addHistory({
        date: new Date().toISOString(),
        gameId: 'speed',
        word: `Score: ${score}`,
        guesses: score,
        result: isWin ? 'won' : 'lost'
      });
    }, 1000);
  };

  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) {
      setIsInvalid(true);
      setTimeout(() => setIsInvalid(false), 400);
      return;
    }

    const result = evaluateGuess(currentGuess, targetWord);
    const newGuesses = [...guesses, currentGuess];
    const newResults = [...results, result];
    
    setGuesses(newGuesses);
    setResults(newResults);
    setCurrentGuess('');

    if (currentGuess === targetWord) {
      setScore(s => s + 1);
      setTimeout(resetBoard, 500);
    } else if (newGuesses.length >= 6) {
      setTimeout(resetBoard, 500); // Failed word, just reset and keep going
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameStatus === 'idle') setGameStatus('playing');
    if (gameStatus === 'won' || gameStatus === 'lost') return;

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
    if (gameStatus === 'won') nextLevel('speed');
    navigate(`/game/speed?level=${level + 1}`);
  };

  const handleRestart = () => {
    navigate(`/game/speed?level=${level}`);
    resetBoard();
    setScore(0);
    setTimeLeft(60);
    setGameStatus('idle');
    setShowResult(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-lg mx-auto">
      
      <div className="flex justify-between w-full px-8 mb-4">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[var(--wm-text-muted)] font-bold uppercase tracking-widest">Score</span>
          <motion.span key={score} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-3xl font-black text-orange-500">{score}</motion.span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[var(--wm-text-muted)] font-bold uppercase tracking-widest">Time</span>
          <span className={`text-3xl font-black ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-[var(--wm-text)]'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        {gameStatus === 'idle' ? (
          <div className="text-center animate-pulse text-[var(--wm-text-muted)] font-bold tracking-widest uppercase">
            Type any letter to start
          </div>
        ) : (
          <Board 
            guesses={guesses}
            results={results}
            currentGuess={currentGuess}
            isInvalid={isInvalid}
            maxGuesses={6}
          />
        )}
      </div>

      <div className="w-full mt-4">
        <Keyboard 
          onKeyPress={handleKeyPress}
          guesses={guesses}
          results={results}
        />
      </div>

      <ResultModal 
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        status={gameStatus as 'won' | 'lost'}
        guesses={results}
        targetWord={`Score: ${score} (Target: 3)`}
        hardMode={false}
        gameId="speed"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
