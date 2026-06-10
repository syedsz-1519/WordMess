import { useUserStore } from '../store/userStore';
import { PLAN_GATES, FeatureGate } from '../constants/plans';

export const useSubscription = () => {
  const { plan } = useUserStore();

  const isPro = plan === 'pro' || plan === 'plus';
  const isPlus = plan === 'plus';

  const canAccess = (feature: FeatureGate): boolean => {
    const requiredTier = PLAN_GATES[feature];
    if (requiredTier === 'plus') return isPlus;
    if (requiredTier === 'pro') return isPro;
    return true; // free
  };

  return {
    plan,
    isPro,
    isPlus,
    canAccess,
  };
};
