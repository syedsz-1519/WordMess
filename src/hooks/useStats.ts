import { useUserStore } from '../store/userStore';

export const useStats = () => {
  const { history } = useUserStore();

  const totalPlayed = history.length;
  const wins = history.filter(h => h.result === 'won').length;
  const winPercentage = totalPlayed > 0 ? Math.round((wins / totalPlayed) * 100) : 0;

  const guessDistribution = [0, 0, 0, 0, 0, 0];
  history.forEach(h => {
    if (h.result === 'won' && h.guesses >= 1 && h.guesses <= 6) {
      guessDistribution[h.guesses - 1]++;
    }
  });

  const averageGuesses = wins > 0 
    ? (history.filter(h => h.result === 'won').reduce((acc, h) => acc + h.guesses, 0) / wins).toFixed(1)
    : '0';

  return {
    totalPlayed,
    wins,
    winPercentage,
    guessDistribution,
    averageGuesses,
    recentHistory: history.slice(0, 10)
  };
};
