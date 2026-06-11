import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wordy } from '../characters/Wordy';
import { Messy } from '../characters/Messy';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [showLogoText, setShowLogoText] = useState(false);
  const [showMascots, setShowMascots] = useState(false);
  const [mascotEmotion, setMascotEmotion] = useState<'idle' | 'happy' | 'cheer' | 'laugh'>('idle');

  useEffect(() => {
    // Staged animation events
    const logoTextTimer = setTimeout(() => setShowLogoText(true), 800);
    const mascotsTimer = setTimeout(() => setShowMascots(true), 1400);
    const cheerTimer = setTimeout(() => {
      setMascotEmotion('cheer');
    }, 2400);
    const completeTimer = setTimeout(() => onComplete(), 4800);

    return () => {
      clearTimeout(logoTextTimer);
      clearTimeout(mascotsTimer);
      clearTimeout(cheerTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Framer Motion Grid/Tile variants
  const gridContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const tileVariant = {
    hidden: { rotateX: 90, opacity: 0, scale: 0.5 },
    show: { 
      rotateX: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', damping: 10, stiffness: 100 } 
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#0b132b] via-[#1c2541] to-[#3a506b] z-[9999] flex flex-col items-center justify-between overflow-hidden select-none">
      
      {/* Stars Backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-12 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-24 right-1/3 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse" />
        <div className="absolute top-48 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse" />
        <div className="absolute top-36 right-1/4 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-64 left-1/5 w-1.5 h-1.5 bg-sky-200 rounded-full animate-pulse" />
      </div>

      {/* Radiant Glowing Moon */}
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-yellow-100/10 blur-xl pointer-events-none" />
      <div className="absolute top-12 right-12 w-20 h-20 rounded-full bg-yellow-50/20 border border-yellow-100/10 shadow-[0_0_40px_rgba(253,254,203,0.3)] pointer-events-none" />

      {/* Main Center Branding Section */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 mt-12">
        {/* Staggered 2x2 Logo Grid */}
        <motion.div 
          variants={gridContainer}
          initial="hidden"
          animate="show"
          className="bg-slate-950/80 p-4 rounded-[28px] grid grid-cols-2 grid-rows-2 gap-3.5 mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
        >
          {[
            { color: '#4ade80' }, // top-left
            { color: '#fb923c' }, // top-right
            { color: '#444444' }, // bottom-left
            { color: '#4ade80' }, // bottom-right
          ].map((tile, i) => (
            <motion.div
              key={i}
              variants={tileVariant}
              className="w-16 h-16 rounded-[12px] shadow-inner"
              style={{ backgroundColor: tile.color }}
            />
          ))}
        </motion.div>

        {/* Wordmark Logo Text & Tagline */}
        {showLogoText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="flex items-center justify-center font-extrabold tracking-wider text-5xl font-Outfit mb-2">
              <span className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">WORD</span>
              <span className="text-[#4ade80] drop-shadow-[0_4px_8px_rgba(74,222,128,0.3)]">MESS</span>
            </h1>
            <p className="text-gray-300/80 font-bold text-sm tracking-widest uppercase mb-1">
              guess it. mess it. share it.
            </p>
          </motion.div>
        )}
      </div>

      {/* Beach Waves at bottom */}
      <div className="absolute bottom-0 w-full pointer-events-none z-10">
        <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto translate-y-4">
          {/* Wave Layer 1 */}
          <path d="M0 100 C 360 140, 720 60, 1080 120 C 1260 150, 1380 130, 1440 120 L 1440 200 L 0 200 Z" fill="#2d4059" opacity="0.4" />
          {/* Wave Layer 2 */}
          <path d="M0 130 C 360 80, 720 160, 1080 100 C 1260 70, 1380 110, 1440 130 L 1440 200 L 0 200 Z" fill="#073b4c" opacity="0.6" />
          {/* Wave Layer 3 (Wet Sand) */}
          <path d="M0 160 C 360 130, 720 180, 1080 150 C 1260 135, 1380 160, 1440 170 L 1440 200 L 0 200 Z" fill="#8d99ae" />
        </svg>
      </div>

      {/* Walking Mascots Section */}
      <div className="w-full h-32 relative z-20 flex justify-center items-end pb-8">
        {showMascots && (
          <>
            {/* Wordy walks in from Left */}
            <motion.div
              initial={{ x: '-150%', opacity: 0 }}
              animate={{ x: -60, opacity: 1 }}
              transition={{ type: 'spring', duration: 1.5, bounce: 0.2 }}
              className="absolute"
            >
              <Wordy emotion={mascotEmotion === 'cheer' ? 'cheer' : 'idle'} size={72} />
              {mascotEmotion === 'cheer' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-12 -left-4 bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full border border-emerald-300 shadow-md whitespace-nowrap"
                >
                  Let's play! 🌟
                </motion.div>
              )}
            </motion.div>

            {/* Messy walks in from Right */}
            <motion.div
              initial={{ x: '150%', opacity: 0 }}
              animate={{ x: 60, opacity: 1 }}
              transition={{ type: 'spring', duration: 1.5, bounce: 0.2 }}
              className="absolute"
            >
              <Messy emotion={mascotEmotion === 'cheer' ? 'laugh' : 'idle'} size={72} />
              {mascotEmotion === 'cheer' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-12 -right-4 bg-orange-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full border border-orange-300 shadow-md whitespace-nowrap"
                >
                  I'm ready! 😈
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </div>

    </div>
  );
};
