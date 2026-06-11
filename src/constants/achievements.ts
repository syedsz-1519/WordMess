export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Map to Lucide icon strings
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_blood', name: 'First Blood', description: 'Solve your first puzzle ever', icon: 'Trophy' },
  { id: 'hat_trick', name: 'Hat Trick', description: 'Solve in 3 rows or less, 3 days running', icon: 'Flame' },
  { id: 'genius', name: 'Genius', description: 'Solve any Wordle-style puzzle in 1 guess', icon: 'Lightbulb' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Solve 5+ words in a single Speed Mess round', icon: 'Zap' },
  { id: 'duelist', name: 'Duelist', description: 'Win 5 duels against the bot or friends', icon: 'Swords' },
  { id: 'iron_streak', name: 'Iron Streak', description: 'Reach a 30-day streak', icon: 'ShieldAlert' },
  { id: 'quad_king', name: 'Quad King', description: 'Complete a Quad Mess puzzle', icon: 'Crown' },
  { id: 'night_owl', name: 'Night Owl', description: 'Play any puzzle between 12am and 4am', icon: 'Moon' },
  { id: 'oracle_slayer', name: 'Oracle Slayer', description: 'Beat AI Oracle without using any hints', icon: 'ShieldCheck' },
  { id: 'pangram', name: 'Pangram', description: 'Use all letters in a Word Connect level', icon: 'CaseSensitive' },
  { id: 'centurion', name: 'Centurion', description: 'Play 100 puzzles total', icon: 'Award' },
  { id: 'lucky_dip', name: 'Lucky Dip', description: 'Solve with only present letters shown', icon: 'Sparkles' },
  { id: 'comeback', name: 'Comeback', description: 'Solve a puzzle on your very last guess (6/6)', icon: 'Undo' },
  { id: 'perfectionist', name: 'Perfectionist', description: '7-day streak with only 1/6 or 2/6 solves', icon: 'CheckSquare' },
  { id: 'beach_bum', name: 'Beach Bum', description: 'Play campaign mode 30 days in a row', icon: 'Compass' },
  { id: 'messy_mode', name: 'Messy Mode', description: 'Lose 5 times in a row, then win a puzzle', icon: 'RotateCcw' },
  { id: 'wordys_fave', name: 'Wordy\'s Fave', description: 'Get Wordy\'s cheer animation 50 times', icon: 'UserCheck' },
  { id: 'oracle_friend', name: 'Oracle Friend', description: 'Consult the Oracle hints 20 times', icon: 'HelpCircle' },
  { id: 'speed_run', name: 'Speed Run', description: 'Solve Classic Wordle in under 30 seconds', icon: 'Timer' },
  { id: 'global_mess', name: 'Global Mess', description: 'Share results on both WhatsApp and Instagram', icon: 'Share2' },
  { id: 'high_five', name: 'High Five', description: 'Trigger Wordy & Messy high five 25 times', icon: 'Smile' },
  { id: 'wordy_master', name: 'Wordy\'s Apprentice', description: 'Complete campaign levels 1-25', icon: 'BookOpen' },
  { id: 'island_explorer', name: 'Island Explorer', description: 'Complete campaign levels 1-100', icon: 'Map' },
  { id: 'gold_digger', name: 'Gold Digger', description: 'Earn 1,000 coins total', icon: 'Coins' },
  { id: 'double_trouble', name: 'Double Trouble', description: 'Complete Double Mess in under 5 guesses', icon: 'Layers' },
  { id: 'math_genius', name: 'Math Genius', description: 'Complete Number Mess in under 4 guesses', icon: 'Binary' },
  { id: 'sharer', name: 'Viral Spreader', description: 'Copy or share results 10 times total', icon: 'Send' },
  { id: 'reverse_expert', name: 'Reverse Expert', description: 'Deduce 5 target words in Reverse Mode', icon: 'RefreshCw' },
  { id: 'shield_hero', name: 'Shield Hero', description: 'Use a streak shield to save your streak', icon: 'Shield' },
  { id: 'ultimate_messor', name: 'Ultimate Messor', description: 'Unlock all other 29 achievements', icon: 'Gem' }
] as const;
