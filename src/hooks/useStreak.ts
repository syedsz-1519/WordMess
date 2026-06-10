import { useUserStore } from '../store/userStore';

export const useStreak = () => {
  const { streak, bestStreak, totalSolved, incrementStreak, resetStreak, useShield } = useUserStore();

  return {
    streak,
    bestStreak,
    totalSolved,
    incrementStreak,
    resetStreak,
    useShield
  };
};
