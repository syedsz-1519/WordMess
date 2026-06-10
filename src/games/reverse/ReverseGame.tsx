import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Board } from '../../components/Board/Board';
import { Keyboard } from '../../components/Keyboard/Keyboard';
import { ResultModal } from '../../components/Modals/ResultModal';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useUserStore } from '../../store/userStore';
import { evaluateGuess, LetterState } from '../../utils/evaluateGuess';
import { getWordForLevel, getRandomWord } from '../../utils/dailyWord';
import { WORD_LENGTH } from '../../utils/wordList';

export const ReverseGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const level = parseInt(searchParams.get('level') || '1', 10);
  
  const { addHistory, nextLevel } = useUserStore();
  const MAX_GUESSES = 6;
  
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
    const target = getWordForLevel(level * 3);
    setTargetWord(target);
    
    // Generate 2 clue words that are not the target word
    let clue1 = getRandomWord();
    while (clue1 === target) clue1 = getRandomWord();
    
    let clue2 = getRandomWord();
    while (clue2 === target || clue2 === clue1) clue2 = getRandomWord();

    const r1 = evaluateGuess(clue1, target);
    const r2 = evaluateGuess(clue2, target);

    setGuesses([clue1, clue2]);
    setResults([r1, r2]);
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
          gameId: 'reverse',
          word: targetWord,
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
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  };

  useKeyboard(handleKeyPress);

  const handleNextLevel = () => {
    nextLevel('reverse');
    navigate(`/game/reverse?level=${level + 1}`);
  };

  const handleRestart = () => {
    navigate(`/game/reverse?level=${level}`);
    const target = getWordForLevel(level * 3);
    setTargetWord(target);
    
    let clue1 = getRandomWord();
    while (clue1 === target) clue1 = getRandomWord();
    let clue2 = getRandomWord();
    while (clue2 === target || clue2 === clue1) clue2 = getRandomWord();

    const r1 = evaluateGuess(clue1, target);
    const r2 = evaluateGuess(clue2, target);

    setGuesses([clue1, clue2]);
    setResults([r1, r2]);
    setCurrentGuess('');
    setGameStatus('playing');
    setShowResult(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-6 w-full max-w-lg mx-auto">
      <div className="text-center mb-2">
        <span className="text-[10px] text-[var(--wm-text-muted)] font-bold uppercase tracking-widest bg-[var(--wm-surface)] px-3 py-1 rounded-full border border-[var(--wm-border)]">
          Reverse Clue Mode
        </span>
        <p className="text-xs text-[var(--wm-text-muted)] mt-1.5 px-6">
          Analyze the pre-filled guess words and colors, then find the target word!
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
        status={gameStatus}
        guesses={results}
        targetWord={targetWord}
        hardMode={false}
        gameId="reverse"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
