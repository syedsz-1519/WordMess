# WORDLE MESS - Product Requirements Document (PRD)

## Overview
A web-based PWA word-guessing game with multi-tiered subscriptions, real-time Firebase syncing, and Razorpay checkout integration.

## User Stories
1. As a free user, I want to play a daily puzzle so I can test my vocabulary.
2. As a free user, I want to track my daily streak so I stay motivated to come back.
3. As a Pro user, I want to play unlimited practice rounds so I can get better at the game.
4. As a Pro user, I want my streak to be shielded once a week so I don't lose it on a busy day.
5. As a Plus user, I want to see a global leaderboard so I can compete with friends and strangers.

## Technical Scope
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS.
- **State Management**: Zustand.
- **Animations**: Framer Motion.
- **Database/Auth**: Firebase (Auth + Firestore).
- **Payments**: Razorpay.
- **Hosting**: Vercel.

## Firebase Schema
- `users/{uid}`: displayName, streak, bestStreak, totalSolved, plan, streakShieldUsed.
- `leaderboard/{uid}`: displayName, streak, totalSolved.
- `archive/{date}/{uid}`: solved, guesses, grid.
