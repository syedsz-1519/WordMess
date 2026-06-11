import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { ANAGRAM_LEVELS } from '../../constants/levels';
import { playClick, playSuccess, playFailure, playWin } from '../../utils/audio';
import { ResultModal } from '../../components/Modals/ResultModal';
import { Volume2, VolumeX, ArrowLeft, Coins, RefreshCw, Sparkles } from 'lucide-react';

export const QuadGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawLevel = parseInt(searchParams.get('level') || '1', 10);
  
  // Load 4 distinct big words for quad mode
  const base = ((rawLevel - 1) * 4) % ANAGRAM_LEVELS.length;
  const level1Data = ANAGRAM_LEVELS[base];
  const level2Data = ANAGRAM_LEVELS[(base + 1) % ANAGRAM_LEVELS.length];
  const level3Data = ANAGRAM_LEVELS[(base + 2) % ANAGRAM_LEVELS.length];
  const level4Data = ANAGRAM_LEVELS[(base + 3) % ANAGRAM_LEVELS.length];

  const { coins, addCoins, spendCoins, nextLevel } = useUserStore();
  const [isMuted, setIsMuted] = useState(false);

  // Found words per board
  const [found1, setFound1] = useState<string[]>([]);
  const [found2, setFound2] = useState<string[]>([]);
  const [found3, setFound3] = useState<string[]>([]);
  const [found4, setFound4] = useState<string[]>([]);
  
  const [currentBoard, setCurrentBoard] = useState<1 | 2 | 3 | 4>(1);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [catSpeech, setCatSpeech] = useState('Quad Connect Mode! Solve 4 boards at once!');
  const [showResult, setShowResult] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // Letter shuffles
  const [letters1, setLetters1] = useState<string[]>([]);
  const [letters2, setLetters2] = useState<string[]>([]);
  const [letters3, setLetters3] = useState<string[]>([]);
  const [letters4, setLetters4] = useState<string[]>([]);

  const shuffle = (array: string[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    setFound1([]);
    setFound2([]);
    setFound3([]);
    setFound4([]);
    setSelectedIndices([]);
    setLetters1(shuffle(level1Data.bigWord.split('')));
    setLetters2(shuffle(level2Data.bigWord.split('')));
    setLetters3(shuffle(level3Data.bigWord.split('')));
    setLetters4(shuffle(level4Data.bigWord.split('')));
    setCatSpeech('Tap on any board to switch input and spell sub-words!');
    setGameStatus('playing');
    setShowResult(false);
  }, [rawLevel]);

  const activeLetters = 
    currentBoard === 1 ? letters1 :
    currentBoard === 2 ? letters2 :
    currentBoard === 3 ? letters3 : letters4;

  const currentInputWord = selectedIndices.map(idx => activeLetters[idx]).join('');

  const handleLetterClick = (index: number) => {
    if (gameStatus !== 'playing') return;
    if (!isMuted) playClick();

    if (selectedIndices.includes(index)) {
      setSelectedIndices(prev => prev.filter(i => i !== index));
    } else {
      setSelectedIndices(prev => [...prev, index]);
    }
  };

  const handleShuffle = () => {
    if (!isMuted) playClick();
    if (currentBoard === 1) setLetters1(shuffle(letters1));
    else if (currentBoard === 2) setLetters2(shuffle(letters2));
    else if (currentBoard === 3) setLetters3(shuffle(letters3));
    else setLetters4(shuffle(letters4));
    setSelectedIndices([]);
  };

  const handleClear = () => {
    if (!isMuted) playClick();
    setSelectedIndices([]);
  };

  const handleSubmit = () => {
    if (gameStatus !== 'playing' || currentInputWord.length < 3) return;

    const word = currentInputWord;
    const targetData = 
      currentBoard === 1 ? level1Data :
      currentBoard === 2 ? level2Data :
      currentBoard === 3 ? level3Data : level4Data;

    const foundList = 
      currentBoard === 1 ? found1 :
      currentBoard === 2 ? found2 :
      currentBoard === 3 ? found3 : found4;

    const setFoundList = 
      currentBoard === 1 ? setFound1 :
      currentBoard === 2 ? setFound2 :
      currentBoard === 3 ? setFound3 : setFound4;

    if (targetData.targetWords.includes(word) && !foundList.includes(word)) {
      const newFound = [...foundList, word];
      setFoundList(newFound);
      if (!isMuted) playSuccess();
      addCoins(10);
      setCatSpeech(`Awesome! Formed "${word}" on Board ${currentBoard}!`);

      // Check win condition
      const done1 = currentBoard === 1 ? newFound.length === level1Data.targetWords.length : found1.length === level1Data.targetWords.length;
      const done2 = currentBoard === 2 ? newFound.length === level2Data.targetWords.length : found2.length === level2Data.targetWords.length;
      const done3 = currentBoard === 3 ? newFound.length === level3Data.targetWords.length : found3.length === level3Data.targetWords.length;
      const done4 = currentBoard === 4 ? newFound.length === level4Data.targetWords.length : found4.length === level4Data.targetWords.length;

      if (done1 && done2 && done3 && done4) {
        setGameStatus('won');
        if (!isMuted) playWin();
        setTimeout(() => setShowResult(true), 800);
      }
    } else {
      if (!isMuted) playFailure();
      setCatSpeech(`"${word}" is not on Board ${currentBoard} list!`);
    }

    setSelectedIndices([]);
  };

  const handleNextLevel = () => {
    nextLevel('quad');
    navigate(`/game/quad?level=${rawLevel + 1}`);
  };

  const handleRestart = () => {
    setFound1([]);
    setFound2([]);
    setFound3([]);
    setFound4([]);
    setSelectedIndices([]);
    setGameStatus('playing');
    setShowResult(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-4 w-full max-w-4xl mx-auto beach-background min-h-screen text-white select-none px-4">
      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
        <button onClick={() => navigate('/')} className="hover:scale-105 active:scale-95 transition-transform p-1.5 bg-white/10 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <span className="font-black tracking-widest text-sm uppercase">Quad Lvl {rawLevel}</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 bg-white/10 rounded-xl hover:scale-105 active:scale-95 transition-transform">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="flex items-center gap-1 font-bold text-yellow-300 bg-yellow-500/20 px-2.5 py-1 rounded-xl border border-yellow-500/30">
            <Coins size={16} className="animate-bounce" />
            <span className="text-xs">{coins}</span>
          </div>
        </div>
      </div>

      {/* Guide Cat bubble */}
      <div className="w-full flex gap-3 items-center my-2 max-w-md">
        <div className="flex-1 bg-white text-slate-800 rounded-2xl p-2.5 text-xs font-semibold relative shadow-lg border-2 border-sky-300">
          <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white border-r-2 border-b-2 border-sky-300 rotate-45 transform -translate-y-1/2"></div>
          {catSpeech}
        </div>
        <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-4xl animate-float">
          🍀
        </div>
      </div>

      {/* 2x2 Responsive Board Grid */}
      <div className="w-full grid grid-cols-2 gap-3 my-2 quad-game-container">
        {[
          { id: 1, data: level1Data, found: found1, name: 'Board 1' },
          { id: 2, data: level2Data, found: found2, name: 'Board 2' },
          { id: 3, data: level3Data, found: found3, name: 'Board 3' },
          { id: 4, data: level4Data, found: found4, name: 'Board 4' }
        ].map((board) => (
          <div 
            key={board.id}
            onClick={() => setCurrentBoard(board.id as any)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              currentBoard === board.id ? 'bg-sky-950/40 border-amber-400 scale-[1.01]' : 'bg-sky-950/20 border-white/10 opacity-70 hover:opacity-90'
            }`}
          >
            <div className="text-[8px] uppercase font-black text-center tracking-widest text-sky-200 mb-1">{board.name} ({board.data.bigWord})</div>
            <div className="flex flex-wrap justify-center gap-0.5 max-h-24 overflow-y-auto">
              {board.data.targetWords.map((word) => {
                const isSolved = board.found.includes(word);
                return (
                  <span key={word} className={`text-[8px] font-bold px-1 py-0.5 rounded border ${
                    isSolved ? 'beach-tile-solved' : 'beach-tile-placeholder text-transparent border-white/25'
                  }`}>
                    {isSolved ? word : Array(word.length).fill('_').join('')}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Input Display */}
      <div className="h-10 my-1 font-black text-xl uppercase tracking-widest text-amber-300 flex items-center justify-center bg-black/10 px-6 rounded-full border border-white/5">
        {currentInputWord || <span className="text-white/40 text-xs tracking-normal font-bold">Select letters for Board {currentBoard}...</span>}
      </div>

      {/* Buttons & Letters */}
      <div className="w-full flex flex-col items-center gap-3">
        <div className="flex gap-2 justify-center">
          <button onClick={handleClear} className="px-4 py-2 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all border border-rose-400/30">
            Clear
          </button>
          <button onClick={handleShuffle} className="p-2.5 bg-sky-500/80 hover:bg-sky-600 text-white rounded-xl transition-all border border-sky-400/30">
            <RefreshCw size={14} />
          </button>
          <button onClick={handleSubmit} className="px-5 py-2 beach-button-green text-white rounded-xl text-xs font-black transition-all border border-emerald-400/30 flex items-center gap-1">
            <Sparkles size={12} /> Submit
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 max-w-sm px-4 pb-4">
          {activeLetters.map((char, index) => {
            const isUsed = selectedIndices.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleLetterClick(index)}
                className={`w-9 h-9 rounded-full text-sm font-black uppercase flex items-center justify-center transition-all ${
                  isUsed
                    ? 'bg-slate-700/50 text-white/40 border-2 border-slate-700/80 scale-95 shadow-inner'
                    : 'beach-tile-orange text-white hover:scale-105 active:scale-95'
                }`}
              >
                {char}
              </button>
            );
          })}
        </div>
      </div>

      <ResultModal 
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        status={gameStatus}
        guesses={[]}
        targetWord={`all 4 boards fully solved!`}
        hardMode={false}
        gameId="quad"
        onRestart={handleRestart}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
};
