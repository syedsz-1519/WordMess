import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Board } from '../../components/Board/Board';
import { Keyboard } from '../../components/Keyboard/Keyboard';
import { ResultModal } from '../../components/Modals/ResultModal';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useUserStore } from '../../store/userStore';
import { evaluateGuess, LetterState } from '../../utils/evaluateGuess';
import { getWordForLevel } from '../../utils/dailyWord';
import { WORD_LENGTH } from '../../utils/wordList';

export const DoubleGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const level = parseInt(searchParams.get('level') || '1', 10);
  
  const { addHistory, levels, nextLevel } = useUserStore();
  const MAX_GUESSES = 7; // Double needs 7 guesses
  
  // Local Game State
  const [targetWords, setTargetWords] = useState<string[]>(['', '']);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results1, setResults1] = useState<LetterState[][]>([]);
  const [results2, setResults2] = useState<LetterState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  
  const [board1Won, setBoard1Won] = useState(false);
  const [board2Won, setBoard2Won] = useState(false);
  
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [isInvalid, setIsInvalid] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const w1 = getWordForLevel(level * 2 - 1);
    const w2 = getWordForLevel(level * 2);
    setTargetWords([w1, w2]);
    setGuesses([]);
    setResults1([]);
    setResults2([]);
    setCurrentGuess('');
    setBoard1Won(false);
    setBoard2Won(false);
    setGameStatus('playing');
    setShowResult(false);
  }, [level]);

  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) {
      setIsInvalid(true);
      setTimeout(() => setIsInvalid(false), 400);
      return;
    }

    const r1 = evaluateGuess(currentGuess, targetWords[0]);
    const r2 = evaluateGuess(currentGuess, targetWords[1]);
    
    const newGuesses = [...guesses, currentGuess];
    
    // Once a board is won, we can visually lock it, but for simplicity we keep tracking
    const b1Win = board1Won || currentGuess === targetWords[0];
    const b2Win = board2Won || currentGuess === targetWords[1];
    
    setResults1([...results1, r1]);
    setResults2([...results2, r2]);
    setGuesses(newGuesses);
    setCurrentGuess('');
    setBoard1Won(b1Win);
    setBoard2Won(b2Win);

    const isWin = b1Win && b2Win;
    const isLoss = newGuesses.length >= MAX_GUESSES && !isWin;

    if (isWin || isLoss) {
      setGameStatus(isWin ? 'won' : 'lost');
      setTimeout(() => {
        setShowResult(true);
        addHistory({
          date: new Date().toISOString(),
          gameId: 'double',
          word: `${targetWords[0]}, ${targetWords[1]}`,
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
    if (gameStatus === 'won') nextLevel('double');
    navigate(`/game/double?level=${level + 1}`);
  };

  const handleRestart = () => {
    navigate(`/game/double?level=${level}`);
    const w1 = getWordForLevel(level * 2 - 1);
    const w2 = getWordForLevel(level * 2);
    setTargetWords([w1, w2]);
    setGuesses([]);
    setResults1([]);
    setResults2([]);
    setCurrentGuess('');
    setBoard1Won(false);
    setBoard2Won(false);
    setGameStatus('playing');
    setShowResult(false);
  };

  // Combine results for keyboard coloring
  const combinedResults = results1.map((r, i) => {
    return r.map((state, j) => {
      const state2 = results2[i][j];
      if (state === 'correct' || state2 === 'correct') return 'correct';
      if (state === 'present' || state2 === 'present') return 'present';
      return state;
    });
  });

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-2xl mx-auto">
      
      <div className="flex-1 flex gap-2 sm:gap-6 items-center justify-center w-full">
        <div className={`transition-opacity ${board1Won ? 'opacity-50' : 'opacity-100'}`}>
          <Board 
            guesses={guesses}
            results={results1}
            currentGuess={board1Won ? '' : currentGuess}
            isInvalid={isInvalid && !board1Won}
            maxGuesses={MAX_GUESSES}
          />
        </div>
        <div className={`transition-opacity ${board2Won ? 'opacity-50' : 'opacity-100'}`}>
          <Board 
            guesses={guesses}
            results={results2}
            currentGuess={board2Won ? '' : currentGuess}
            isInvalid={isInvalid && !board2Won}
            maxGuesses={MAX_GUESSES}
          />
        </div>
      </div>

      <div className="w-full mt-4">
        <Keyboard 
          onKeyPress={handleKeyPress}
          guesses={guesses}
          results={combinedResults}
        />
      </div>

      <ResultModal 
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        status={gameStatus as 'won' | 'lost'}
        guesses={combinedResults}
        targetWord={`${targetWords[0]} & ${targetWords[1]}`}
        hardMode={false}
        gameId="double"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
