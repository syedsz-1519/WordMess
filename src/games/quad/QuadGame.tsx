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

export const QuadGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const level = parseInt(searchParams.get('level') || '1', 10);
  
  const { addHistory, nextLevel } = useUserStore();
  const MAX_GUESSES = 9; // Quad needs 9 guesses
  
  // Local Game State
  const [targetWords, setTargetWords] = useState<string[]>(['', '', '', '']);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results1, setResults1] = useState<LetterState[][]>([]);
  const [results2, setResults2] = useState<LetterState[][]>([]);
  const [results3, setResults3] = useState<LetterState[][]>([]);
  const [results4, setResults4] = useState<LetterState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  
  const [board1Won, setBoard1Won] = useState(false);
  const [board2Won, setBoard2Won] = useState(false);
  const [board3Won, setBoard3Won] = useState(false);
  const [board4Won, setBoard4Won] = useState(false);
  
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [isInvalid, setIsInvalid] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const w1 = getWordForLevel(level * 4 - 3);
    const w2 = getWordForLevel(level * 4 - 2);
    const w3 = getWordForLevel(level * 4 - 1);
    const w4 = getWordForLevel(level * 4);
    setTargetWords([w1, w2, w3, w4]);
    setGuesses([]);
    setResults1([]);
    setResults2([]);
    setResults3([]);
    setResults4([]);
    setCurrentGuess('');
    setBoard1Won(false);
    setBoard2Won(false);
    setBoard3Won(false);
    setBoard4Won(false);
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
    const r3 = evaluateGuess(currentGuess, targetWords[2]);
    const r4 = evaluateGuess(currentGuess, targetWords[3]);
    
    const newGuesses = [...guesses, currentGuess];
    
    const b1Win = board1Won || currentGuess === targetWords[0];
    const b2Win = board2Won || currentGuess === targetWords[1];
    const b3Win = board3Won || currentGuess === targetWords[2];
    const b4Win = board4Won || currentGuess === targetWords[3];
    
    setResults1([...results1, r1]);
    setResults2([...results2, r2]);
    setResults3([...results3, r3]);
    setResults4([...results4, r4]);
    setGuesses(newGuesses);
    setCurrentGuess('');
    setBoard1Won(b1Win);
    setBoard2Won(b2Win);
    setBoard3Won(b3Win);
    setBoard4Won(b4Win);

    const isWin = b1Win && b2Win && b3Win && b4Win;
    const isLoss = newGuesses.length >= MAX_GUESSES && !isWin;

    if (isWin || isLoss) {
      setGameStatus(isWin ? 'won' : 'lost');
      setTimeout(() => {
        setShowResult(true);
        addHistory({
          date: new Date().toISOString(),
          gameId: 'quad',
          word: `${targetWords.join(', ')}`,
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
    nextLevel('quad');
    navigate(`/game/quad?level=${level + 1}`);
  };

  const handleRestart = () => {
    navigate(`/game/quad?level=${level}`);
    const w1 = getWordForLevel(level * 4 - 3);
    const w2 = getWordForLevel(level * 4 - 2);
    const w3 = getWordForLevel(level * 4 - 1);
    const w4 = getWordForLevel(level * 4);
    setTargetWords([w1, w2, w3, w4]);
    setGuesses([]);
    setResults1([]);
    setResults2([]);
    setResults3([]);
    setResults4([]);
    setCurrentGuess('');
    setBoard1Won(false);
    setBoard2Won(false);
    setBoard3Won(false);
    setBoard4Won(false);
    setGameStatus('playing');
    setShowResult(false);
  };

  // Combine results for keyboard coloring
  const combinedResults = results1.map((_, i) => {
    return Array(WORD_LENGTH).fill('absent').map((_, j) => {
      const s1 = results1[i]?.[j];
      const s2 = results2[i]?.[j];
      const s3 = results3[i]?.[j];
      const s4 = results4[i]?.[j];
      
      if (s1 === 'correct' || s2 === 'correct' || s3 === 'correct' || s4 === 'correct') return 'correct';
      if (s1 === 'present' || s2 === 'present' || s3 === 'present' || s4 === 'present') return 'present';
      return s1 || s2 || s3 || s4 || 'absent';
    });
  });

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-4xl mx-auto quad-game-container">
      
      {/* 2x2 Responsive Grid */}
      <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-6 items-center justify-center w-full px-2 sm:px-4">
        {/* Board 1 */}
        <div className={`transition-opacity ${board1Won ? 'opacity-40 scale-[0.98]' : 'opacity-100'}`}>
          <div className="text-[10px] text-center font-bold text-[var(--wm-text-muted)] mb-1 uppercase tracking-widest">Board 1</div>
          <Board 
            guesses={guesses}
            results={results1}
            currentGuess={board1Won ? '' : currentGuess}
            isInvalid={isInvalid && !board1Won}
            maxGuesses={MAX_GUESSES}
          />
        </div>

        {/* Board 2 */}
        <div className={`transition-opacity ${board2Won ? 'opacity-40 scale-[0.98]' : 'opacity-100'}`}>
          <div className="text-[10px] text-center font-bold text-[var(--wm-text-muted)] mb-1 uppercase tracking-widest">Board 2</div>
          <Board 
            guesses={guesses}
            results={results2}
            currentGuess={board2Won ? '' : currentGuess}
            isInvalid={isInvalid && !board2Won}
            maxGuesses={MAX_GUESSES}
          />
        </div>

        {/* Board 3 */}
        <div className={`transition-opacity ${board3Won ? 'opacity-40 scale-[0.98]' : 'opacity-100'}`}>
          <div className="text-[10px] text-center font-bold text-[var(--wm-text-muted)] mb-1 uppercase tracking-widest">Board 3</div>
          <Board 
            guesses={guesses}
            results={results3}
            currentGuess={board3Won ? '' : currentGuess}
            isInvalid={isInvalid && !board3Won}
            maxGuesses={MAX_GUESSES}
          />
        </div>

        {/* Board 4 */}
        <div className={`transition-opacity ${board4Won ? 'opacity-40 scale-[0.98]' : 'opacity-100'}`}>
          <div className="text-[10px] text-center font-bold text-[var(--wm-text-muted)] mb-1 uppercase tracking-widest">Board 4</div>
          <Board 
            guesses={guesses}
            results={results4}
            currentGuess={board4Won ? '' : currentGuess}
            isInvalid={isInvalid && !board4Won}
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
        status={gameStatus}
        guesses={combinedResults}
        targetWord={targetWords.join(' | ')}
        hardMode={false}
        gameId="quad"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
