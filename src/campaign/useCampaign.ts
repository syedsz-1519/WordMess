import { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';

export const useCampaign = () => {
  const { addCoins } = useUserStore();
  const [currentLevel, setCurrentLevel] = useState<number>(1);

  useEffect(() => {
    const saved = localStorage.getItem('wm-campaign-level');
    if (saved) {
      setCurrentLevel(parseInt(saved, 10));
    }
  }, []);

  const completeLevel = (lvl: number) => {
    const saved = localStorage.getItem('wm-campaign-level');
    const active = saved ? parseInt(saved, 10) : 1;
    if (lvl >= active) {
      const next = lvl + 1;
      setCurrentLevel(next);
      localStorage.setItem('wm-campaign-level', next.toString());
      addCoins(25); // +25 bonus coins for beating campaign levels
    }
  };

  return {
    currentLevel,
    completeLevel,
  };
};
export default useCampaign;
