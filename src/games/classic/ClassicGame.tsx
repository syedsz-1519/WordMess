import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Board } from '../../components/Board/Board';
import { Keyboard } from '../../components/Keyboard/Keyboard';
import { ResultModal } from '../../components/Modals/ResultModal';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useUserStore } from '../../store/userStore';
import { evaluateGuess, LetterState } from '../../utils/evaluateGuess';
import { getWordForLevel } from '../../utils/dailyWord';
import { MAX_GUESSES, WORD_LENGTH } from '../../utils/wordList';

export const ClassicGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const level = parseInt(searchParams.get('level') || '1', 10);
  
  const { addHistory, levels, nextLevel } = useUserStore();
  
  // Local Game State
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<LetterState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [isInvalid, setIsInvalid] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Initialize level
  useEffect(() => {
    const word = getWordForLevel(level);
    setTargetWord(word);
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

    // In a real app, validate against a dictionary here
    const result = evaluateGuess(currentGuess, targetWord);
    
    const newGuesses = [...guesses, currentGuess];
    const newResults = [...results, result];
    
    setGuesses(newGuesses);
    setResults(newResults);
    setCurrentGuess('');

    const isWin = currentGuess === targetWord;
    const isLoss = newGuesses.length >= MAX_GUESSES && !isWin;

    if (isWin || isLoss) {
      setGameStatus(isWin ? 'won' : 'lost');
      setTimeout(() => {
        setShowResult(true);
        addHistory({
          date: new Date().toISOString(),
          gameId: 'classic',
          word: targetWord,
          guesses: isWin ? newGuesses.length : MAX_GUESSES,
          result: isWin ? 'won' : 'lost'
        });
      }, 1500); // Wait for tile animations
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
    // If they won, unlock next level globally
    if (gameStatus === 'won') {
      nextLevel('classic');
    }
    navigate(`/game/classic?level=${level + 1}`);
  };

  const handleRestart = () => {
    navigate(`/game/classic?level=${level}`);
    // Force re-render/reset by reloading the exact same level (handled by useEffect)
    const word = getWordForLevel(level);
    setTargetWord(word);
    setGuesses([]);
    setResults([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setShowResult(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-6 w-full max-w-lg mx-auto">
      <div className="flex-1 flex items-center justify-center w-full">
        <Board 
          guesses={guesses}
          results={results}
          currentGuess={currentGuess}
          isInvalid={isInvalid}
          maxGuesses={MAX_GUESSES}
        />
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
        targetWord={targetWord}
        hardMode={false}
        gameId="classic"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
