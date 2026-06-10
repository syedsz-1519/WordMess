import { useUserStore } from '../store/userStore';

export const useSubscription = () => {
  const plan = useUserStore(state => state.plan);

  return {
    isPro: plan === 'pro' || plan === 'plus',
    isPlus: plan === 'plus',
    canUsePractice: plan === 'pro' || plan === 'plus',
    canUseHardMode: plan === 'pro' || plan === 'plus',
    canUseThemes: plan === 'pro' || plan === 'plus',
    canUseLeaderboard: plan === 'plus',
    canUseArchive: plan === 'plus',
    canUseDuels: plan === 'plus',
    canUseCanvasShare: plan === 'plus',
  };
};
