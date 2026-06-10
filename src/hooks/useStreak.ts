import { useUserStore } from '../store/userStore';

export const useStreak = () => {
  const { streak, bestStreak, incrementStreak, resetStreak } = useUserStore();
  
  return {
    streak,
    bestStreak,
    incrementStreak,
    resetStreak
  };
};
