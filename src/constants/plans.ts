export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Classic Mess', 'Number Mess', '3 AI hints per day'],
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 49,
    plan_id: 'plan_wm_pro',
    features: ['Double Mess', 'Speed Mess', 'Reverse Mess', 'Deep Stats', 'Unlimited AI hints'],
  },
  PLUS: {
    id: 'plus',
    name: 'Plus',
    price: 99,
    plan_id: 'plan_wm_plus',
    features: ['Quad Mess', 'Duel Mess', 'AI Mess Mode', 'Language Packs', 'Instagram Share Kit', 'All Pro Features'],
  }
} as const;

export const PLAN_GATES = {
  doubleGame: 'pro',
  speedGame: 'pro',
  reverseGame: 'pro',
  hardMode: 'pro',
  practiceMode: 'pro',
  streakShield: 'pro',
  themes: 'pro',
  deepStats: 'pro',
  quadGame: 'plus',
  duelGame: 'plus',
  aiGame: 'plus',
  leaderboard: 'plus',
  archive: 'plus',
  languagePacks: 'plus',
  instaKit: 'plus',
  giftSub: 'plus',
} as const;

export type PlanTier = 'free' | 'pro' | 'plus';
export type FeatureGate = keyof typeof PLAN_GATES;
