import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useCharacterStore } from '../../store/characterStore';
import { useCharacterEmotions } from '../../hooks/useCharacterEmotions';
import { evaluateGuess, LetterState } from '../../utils/evaluateGuess';
import { Board } from '../../components/Board/Board';
import { Keyboard } from '../../components/Keyboard/Keyboard';
import { Wordy } from '../../assets/characters/Wordy';
import { Messy } from '../../assets/characters/Messy';
import { SpeechBubble } from '../../assets/characters/SpeechBubble';
import { ResultModal } from '../../components/Modals/ResultModal';
import { Confetti } from '../../engine/Confetti';
import { ArrowLeft, Coins, Flame, Share2, Swords, Trophy, User } from 'lucide-react';
import { WORDS } from '../../utils/wordList';
import { getRandomWord } from '../../utils/dailyWord';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const DuelGame = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useUserStore();
  const emotions = useCharacterEmotions();

  const {
    wordyEmotion,
    messyEmotion,
    wordyBubble,
    messyBubble,
    triggerWordy,
    triggerMessy,
    resetMascots
  } = useCharacterStore();

  const duelId = searchParams.get('id');

  // Game States
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<LetterState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showResultModal, setShowResultModal] = useState(false);

  // Setup Duel State
  const [isCreating, setIsCreating] = useState(false);
  const [customWordInput, setCustomWordInput] = useState('');
  const [opponentResult, setOpponentResult] = useState<{
    guesses: string[];
    results: LetterState[][];
    solved: boolean;
  } | null>(null);

  // Fetch or setup duel
  useEffect(() => {
    resetMascots();
    
    if (duelId) {
      fetchDuel(duelId);
    } else {
      setIsCreating(true);
    }
  }, [duelId]);

  const fetchDuel = async (id: string) => {
    try {
      const duelRef = doc(db, 'duels', id);
      const snap = await getDoc(duelRef);
      if (snap.exists()) {
        const data = snap.data();
        setTargetWord(data.word.toUpperCase());
        setIsCreating(false);
        
        // Check if opponent already played
        const creatorId = data.createdBy;
        const opponentData = data.players?.[creatorId];
        if (opponentData && creatorId !== user.uid) {
          setOpponentResult({
            guesses: opponentData.guesses || [],
            results: opponentData.grid || [],
            solved: opponentData.solved || false
          });
        }
      } else {
        // Fallback to local random if duel does not exist
        setTargetWord(getRandomWord().toUpperCase());
        setIsCreating(false);
      }
    } catch (e) {
      console.warn("Firestore fetch failed, running local bot duel:", e);
      setTargetWord(getRandomWord().toUpperCase());
      setIsCreating(false);
      
      // Seed a random bot opponent
      setOpponentResult({
        guesses: Array(4).fill('*****'),
        results: Array(4).fill(Array(5).fill('absent')),
        solved: true
      });
    }
  };

  const handleCreateDuel = async (wordToUse?: string) => {
    let word = wordToUse || customWordInput.toUpperCase();
    if (!word || word.length !== 5) {
      word = getRandomWord().toUpperCase();
    }

    const newId = Math.random().toString(36).substring(2, 9);
    const creatorUid = user.uid || 'anon_' + Math.random().toString(36).substring(2, 5);

    try {
      await setDoc(doc(db, 'duels', newId), {
        word,
        createdBy: creatorUid,
        players: {},
        createdAt: new Date()
      });
      setSearchParams({ id: newId });
    } catch (e) {
      // Offline fallback: set search param locally
      setSearchParams({ id: newId });
      setTargetWord(word);
      setIsCreating(false);
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameStatus !== 'playing' || isCreating) return;

    if (key === 'Enter') {
      submitGuess();
    } else if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
      emotions.onKeyPress();
    } else if (/^[A-Za-z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key.toUpperCase());
      emotions.onKeyPress();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameStatus, isCreating]);

  const submitGuess = async () => {
    if (currentGuess.length !== 5) {
      emotions.onInvalid();
      setIsInvalid(true);
      setTimeout(() => setIsInvalid(false), 400);
      return;
    }

    const cleanGuess = currentGuess.toUpperCase();
    const cleanWordList = WORDS.map(w => w.toUpperCase());

    if (!cleanWordList.includes(cleanGuess)) {
      emotions.onInvalid();
      setIsInvalid(true);
      setTimeout(() => setIsInvalid(false), 400);
      return;
    }

    const evaluation = evaluateGuess(cleanGuess, targetWord);
    const newGuesses = [...guesses, cleanGuess];
    const newResults = [...results, evaluation];

    setGuesses(newGuesses);
    setResults(newResults);
    setCurrentGuess('');

    if (cleanGuess === targetWord) {
      setGameStatus('won');
      emotions.onWin(cleanGuess);
      user.addCoins(50);
      await saveDuelResult(newGuesses, newResults, true);
      setTimeout(() => setShowResultModal(true), 1200);
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost');
      emotions.onLoss(targetWord);
      await saveDuelResult(newGuesses, newResults, false);
      setTimeout(() => setShowResultModal(true), 1200);
    } else {
      const isPartiallyCorrect = evaluation.some(r => r === 'correct' || r === 'present');
      if (isPartiallyCorrect) {
        emotions.onCorrect(cleanGuess);
      } else {
        emotions.onIncorrect();
      }
    }
  };

  const saveDuelResult = async (finalGuesses: string[], finalResults: LetterState[][], solved: boolean) => {
    if (!duelId) return;
    const playerUid = user.uid || 'player';
    try {
      const duelRef = doc(db, 'duels', duelId);
      const snap = await getDoc(duelRef);
      if (snap.exists()) {
        const currentData = snap.data();
        const players = currentData.players || {};
        players[playerUid] = {
          guesses: finalGuesses,
          grid: finalResults,
          solved,
          time: Date.now()
        };
        await setDoc(duelRef, { players }, { merge: true });
      }
    } catch (e) {
      console.warn("Failed to sync duel results with Firestore:", e);
    }
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}/game/duel?id=${duelId}`;
    navigator.clipboard.writeText(url);
    triggerWordy('happy', "Copied duel link! 📋");
    emotions.onKeyPress();
  };

  if (isCreating) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-8 w-full max-w-md mx-auto px-6 z-10 text-center gap-6">
        <div className="p-4 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
          <Swords size={40} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-widest text-purple-400">Setup a Duel</h2>
        <p className="text-xs text-white/50 max-w-xs leading-relaxed">
          Input a custom 5-letter word for your friend to guess, or let the Oracle pick a random mysterious word.
        </p>

        <input
          type="text"
          maxLength={5}
          value={customWordInput}
          onChange={(e) => setCustomWordInput(e.target.value.toUpperCase())}
          placeholder="ENTER 5-LETTER WORD"
          className="w-full text-center py-3 bg-white/5 border border-white/10 rounded-2xl text-xl font-bold uppercase tracking-widest text-purple-300 focus:outline-none focus:border-purple-400"
        />

        <div className="flex flex-col gap-2.5 w-full mt-4">
          <button
            onClick={() => handleCreateDuel()}
            className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-transform hover:scale-[1.02]"
          >
            Create Duel Grid
          </button>
          <button
            onClick={() => handleCreateDuel(getRandomWord().toUpperCase())}
            className="w-full py-4 bg-white/5 hover:bg-white/10 text-purple-300 rounded-2xl font-bold text-sm uppercase tracking-widest transition-transform hover:scale-[1.02] border border-purple-500/20"
          >
            Random Word Duel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-5xl mx-auto min-h-[calc(100vh-60px)] px-4">
      <Confetti active={gameStatus === 'won'} word={targetWord} />

      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 z-10 max-w-lg">
        <button onClick={() => navigate('/hub')} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-black tracking-widest text-xs uppercase text-purple-400">Duel Mode</span>
          {duelId && (
            <button 
              onClick={handleShareLink}
              className="text-[9px] text-purple-300 hover:underline flex items-center gap-1 font-bold mt-0.5"
            >
              <Share2 size={8} /> Copy Invite Link
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 font-bold text-yellow-300 bg-yellow-500/10 px-2.5 py-1 rounded-xl text-xs">
          <Coins size={14} className="animate-bounce" />
          <span>{user.coins}</span>
        </div>
      </div>

      {/* Side-by-side Duel Grid (Player vs Opponent) */}
      <div className="flex-1 flex gap-8 justify-center items-center py-6 w-full overflow-x-auto max-w-4xl">
        {/* Player Board */}
        <div className="flex flex-col items-center">
          <h3 className="text-xs font-black uppercase text-purple-300 mb-2 flex items-center gap-1.5">
            <User size={12} /> Your Board
          </h3>
          <Board
            guesses={guesses}
            results={results}
            currentGuess={currentGuess}
            isInvalid={isInvalid}
            maxGuesses={6}
          />
        </div>

        {/* Opponent Board */}
        {opponentResult && (
          <div className="flex flex-col items-center opacity-65">
            <h3 className="text-xs font-black uppercase text-rose-400 mb-2 flex items-center gap-1.5">
              <Trophy size={12} fill="currentColor" /> Opponent
            </h3>
            <Board
              guesses={opponentResult.guesses}
              results={opponentResult.results}
              currentGuess=""
              maxGuesses={6}
            />
          </div>
        )}
      </div>

      {/* Mascot indicators */}
      <div className="w-full max-w-lg flex justify-between px-4 mb-4 items-end z-10">
        <div className="relative cursor-pointer" onClick={() => triggerWordy('cheer', 'random')}>
          <SpeechBubble text={wordyBubble} />
          <Wordy emotion={wordyEmotion} size={62} />
        </div>
        <div className="relative cursor-pointer" onClick={() => triggerMessy('laugh', 'random')}>
          <SpeechBubble text={messyBubble} />
          <Messy emotion={messyEmotion} size={62} />
        </div>
      </div>

      {/* Keyboard */}
      <div className="w-full z-10">
        <Keyboard 
          onKeyPress={handleKeyPress} 
          guesses={guesses} 
          results={results} 
        />
      </div>

      <ResultModal 
        isOpen={showResultModal} 
        onClose={() => setShowResultModal(false)} 
        status={gameStatus} 
        guesses={guesses} 
        targetWord={targetWord} 
        hardMode={false} 
        gameId="duel" 
        onRestart={() => {
          setGuesses([]);
          setResults([]);
          setCurrentGuess('');
          setGameStatus('playing');
          setIsCreating(true);
          setShowResultModal(false);
        }}
      />
    </div>
  );
};

export default DuelGame;
