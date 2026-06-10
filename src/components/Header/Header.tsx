import { Flame, Shield } from 'lucide-react';
import { useStreak } from '../../hooks/useStreak';
import { useSubscription } from '../../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { streak } = useStreak();
  const { isPro } = useSubscription();
  const navigate = useNavigate();

  return (
    <header className="h-[50px] border-b border-[var(--wm-border)] flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center font-black tracking-widest text-lg">
          <span className="text-white">WORDLE</span>
          <span className="text-[var(--wm-correct)] ml-1">MESS</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 font-bold text-orange-500">
          <Flame size={18} />
          <span>{streak}</span>
        </div>
        {!isPro && (
          <button onClick={() => navigate('/')} className="bg-[var(--wm-correct)] text-[var(--wm-bg-dark)] px-3 py-1 rounded text-sm font-bold">
            PRO
          </button>
        )}
        {isPro && (
          <div className="text-[var(--wm-correct)]">
            <Shield size={18} />
          </div>
        )}
      </div>
    </header>
  );
};
