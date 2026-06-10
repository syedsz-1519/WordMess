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
import { getCrypticHint } from '../../lib/gemini';

export const AIGame = () => {
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

  // AI Clues list
  const [aiClues, setAiClues] = useState<string[]>([]);
  const [loadingClue, setLoadingClue] = useState(false);

  // Initialize level
  useEffect(() => {
    const word = getWordForLevel(level * 6);
    setTargetWord(word);
    setGuesses([]);
    setResults([]);
    setCurrentGuess('');
    setAiClues(["I will speak in riddles. Submit a word to unlock my first clue..."]);
    setGameStatus('playing');
    setShowResult(false);
  }, [level]);

  const submitGuess = async () => {
    if (currentGuess.length !== WORD_LENGTH) {
      setIsInvalid(true);
      setTimeout(() => setIsInvalid(false), 400);
      return;
    }

    const guessToEvaluate = currentGuess;
    const result = evaluateGuess(guessToEvaluate, targetWord);
    
    const newGuesses = [...guesses, guessToEvaluate];
    const newResults = [...results, result];
    
    setGuesses(newGuesses);
    setResults(newResults);
    setCurrentGuess('');

    const isWin = guessToEvaluate === targetWord;
    const isLoss = newGuesses.length >= MAX_GUESSES && !isWin;

    if (isWin) {
      setAiClues(prev => [...prev, `🎉 Brilliant! "${guessToEvaluate}" is the absolute truth.`]);
      setGameStatus('won');
      setTimeout(() => {
        setShowResult(true);
        addHistory({
          date: new Date().toISOString(),
          gameId: 'ai',
          word: targetWord,
          guesses: newGuesses.length,
          result: 'won'
        });
      }, 1500);
    } else {
      setLoadingClue(true);
      // Fetch cryptic hint from Gemini for this guess
      const hint = await getCrypticHint(targetWord, guessToEvaluate, newGuesses.length);
      setAiClues(prev => [...prev, `"${guessToEvaluate}": ${hint}`]);
      setLoadingClue(false);

      if (isLoss) {
        setGameStatus('lost');
        setTimeout(() => {
          setShowResult(true);
          addHistory({
            date: new Date().toISOString(),
            gameId: 'ai',
            word: targetWord,
            guesses: MAX_GUESSES,
            result: 'lost'
          });
        }, 1500);
      }
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameStatus !== 'playing' || loadingClue) return;

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
    nextLevel('ai');
    navigate(`/game/ai?level=${level + 1}`);
  };

  const handleRestart = () => {
    navigate(`/game/ai?level=${level}`);
    const word = getWordForLevel(level * 6);
    setTargetWord(word);
    setGuesses([]);
    setResults([]);
    setCurrentGuess('');
    setAiClues(["I will speak in riddles. Submit a word to unlock my first clue..."]);
    setGameStatus('playing');
    setShowResult(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-6 w-full max-w-lg mx-auto relative">
      <div className="text-center mb-2">
        <span className="text-[10px] text-[var(--wm-text-muted)] font-bold uppercase tracking-widest bg-[var(--wm-surface)] px-3 py-1 rounded-full border border-[var(--wm-border)]">
          🤖 AI Oracle Mode
        </span>
      </div>

      {/* Clues Panel */}
      <div className="w-11/12 max-w-sm bg-[var(--wm-surface)] border border-purple-500/20 rounded-xl p-3 my-2 shadow-lg shadow-purple-500/5 flex flex-col gap-1.5 max-h-36 overflow-y-auto">
        <div className="text-purple-400 text-xs font-black uppercase tracking-wider flex items-center justify-between sticky top-0 bg-[var(--wm-surface)] pb-1">
          <span>Oracle Responses</span>
          {loadingClue && <span className="animate-pulse text-[10px] text-gray-500">Consulting Gemini...</span>}
        </div>
        {aiClues.map((clue, idx) => (
          <p key={idx} className="text-xs text-gray-300 leading-relaxed font-mono border-b border-[var(--wm-border)]/30 pb-1 last:border-b-0">
            {clue}
          </p>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center w-full my-2">
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
        gameId="ai"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
