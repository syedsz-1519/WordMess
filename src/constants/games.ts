export const GAMES = [
  {
    id: 'classic',
    name: 'Classic Mess',
    description: 'The OG 5-letter daily puzzle',
    tier: 'free',
    isNew: false,
    isDaily: true,
  },
  {
    id: 'double',
    name: 'Double Mess',
    description: 'Solve 2 words simultaneously',
    tier: 'pro',
    isNew: false,
    isDaily: true,
  },
  {
    id: 'quad',
    name: 'Quad Mess',
    description: '4 boards at once. Pure chaos.',
    tier: 'plus',
    isNew: false,
    isDaily: true,
  },
  {
    id: 'speed',
    name: 'Speed Mess',
    description: '60 seconds to solve as many as possible',
    tier: 'pro',
    isNew: true,
    isDaily: false,
  },
  {
    id: 'reverse',
    name: 'Reverse Mess',
    description: 'Guess the word from the colored grid',
    tier: 'pro',
    isNew: true,
    isDaily: true,
  },
  {
    id: 'number',
    name: 'Number Mess',
    description: '5-digit number logic puzzle',
    tier: 'free',
    isNew: false,
    isDaily: true,
  },
  {
    id: 'duel',
    name: 'Duel Mess',
    description: 'Race a friend on the same word',
    tier: 'plus',
    isNew: false,
    isDaily: false,
  },
  {
    id: 'ai',
    name: 'AI Mess',
    description: 'Cryptic hints instead of colors',
    tier: 'plus',
    isNew: true,
    isDaily: true,
  }
] as const;

export type GameId = typeof GAMES[number]['id'];
