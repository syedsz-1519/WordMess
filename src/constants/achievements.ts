export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_blood', name: 'First Blood', description: 'Solve your first ever puzzle.', icon: '🩸' },
  { id: 'genius', name: 'Genius', description: 'Solve a puzzle in 1 guess.', icon: '🧠' },
  { id: 'hat_trick', name: 'Hat Trick', description: 'Solve in 3 or fewer guesses, 3 days running.', icon: '🎩' },
  { id: 'iron_streak', name: 'Iron Streak', description: 'Maintain a 30-day streak.', icon: '🔥' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Solve 5+ words in Speed Mess.', icon: '⚡' },
  { id: 'duelist', name: 'Duelist', description: 'Win 5 duels against friends.', icon: '⚔️' },
  { id: 'quad_king', name: 'Quad King', description: 'Successfully solve Quad Mess.', icon: '👑' },
  { id: 'night_owl', name: 'Night Owl', description: 'Play a game between 12am and 4am.', icon: '🦉' },
  // Additional achievements can be added here
];
