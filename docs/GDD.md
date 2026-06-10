# WORDLE MESS - Game Design Document (GDD)

## Core Concept
"WORDLE MESS" is a chaotic, fun twist on Wordle. Players have 6 tries to guess a 5-letter word. It features deep monetization mechanics, streak protection, custom themes, and competitive global leaderboards.

## Core Mechanics
- 6 rows × 5 tiles board.
- Standard Wordle rules (Green = correct, Amber = present, Charcoal = absent).
- Handles duplicate letters accurately using a double-pass algorithm.
- Validates guess against a dictionary of valid English words.
- Daily puzzle updates at midnight IST.

## Difficulty & Hard Mode
- **Hard Mode (Pro)**: Green letters MUST be reused in the exact same position in subsequent guesses. Amber letters MUST be used somewhere in subsequent guesses.

## Win/Lose Conditions
- **Win**: Guess the target word within 6 tries.
- **Lose**: Fail to guess the target word after 6 valid tries.

## Features by Tier
- **Free**: Daily puzzle, Streak system, Basic stats, Share card.
- **Pro (₹49/mo)**: Practice mode, Streak shield (1 miss/week), Hard mode, Custom themes.
- **Plus (₹99/mo)**: Global leaderboard, Puzzle archive, Friend duels, Canvas PNG export.
