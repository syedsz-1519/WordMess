import { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { useKeyboard } from '../hooks/useKeyboard';
import { Board } from '../components/Board/Board';
import { Keyboard } from '../components/Keyboard/Keyboard';
import { Header } from '../components/Header/Header';

export const Game = () => {
  const { guesses, results, currentGuess, status, onKeyPress, targetWord } = useGame();
  const [isInvalid, setIsInvalid] = useState(false);

  useKeyboard(onKeyPress);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--wm-bg-dark)]">
      <Header />
      <main className="flex-1 flex flex-col justify-between py-6">
        <Board 
          guesses={guesses} 
          results={results} 
          currentGuess={currentGuess} 
          isInvalid={isInvalid} 
        />
        <Keyboard 
          onKeyPress={onKeyPress} 
          results={results} 
          guesses={guesses} 
        />
      </main>
      
      {status !== 'playing' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[var(--wm-surface)] p-6 rounded-lg text-center max-w-sm w-full mx-4 border border-[var(--wm-border)]">
            <h2 className="text-2xl font-bold mb-2">
              {status === 'won' ? 'You won!' : 'Game Over'}
            </h2>
            <p className="text-gray-300 mb-6">The word was: <strong className="text-white">{targetWord}</strong></p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-[var(--wm-correct)] text-[var(--wm-bg-dark)] py-3 rounded font-bold"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
