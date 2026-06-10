import { LetterState } from '../../utils/evaluateGuess';

interface KeyProps {
  value: string;
  state?: LetterState;
  onClick: (value: string) => void;
}

export const Key = ({ value, state, onClick }: KeyProps) => {
  const isSpecial = value === 'ENTER' || value === 'BACKSPACE';

  const getColors = () => {
    switch (state) {
      case 'correct': return 'bg-[var(--wm-correct)] text-[var(--wm-text)]';
      case 'present': return 'bg-[var(--wm-present)] text-[var(--wm-text)]';
      case 'absent': return 'bg-[var(--wm-absent)] text-[var(--wm-text)]';
      default: return 'bg-[var(--wm-border)] text-[var(--wm-text)] hover:opacity-80';
    }
  };

  return (
    <button
      onClick={() => onClick(value === 'ENTER' ? 'Enter' : value === 'BACKSPACE' ? 'Backspace' : value)}
      className={`${getColors()} flex items-center justify-center rounded uppercase font-bold cursor-pointer transition-colors ${
        isSpecial ? 'px-2 sm:px-4 text-xs sm:text-sm h-14 w-16 sm:w-auto' : 'w-8 sm:w-10 h-14 text-sm sm:text-lg'
      }`}
    >
      {value === 'BACKSPACE' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="m18 9-6 6"/><path d="m12 9 6 6"/></svg>
      ) : value}
    </button>
  );
};
