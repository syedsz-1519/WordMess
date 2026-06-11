import React from 'react';
import { motion } from 'framer-motion';

interface MascotProps {
  mood?: 'idle' | 'happy' | 'sad' | 'thinking' | 'panic';
  size?: number;
}

// Wordy (The Letter W Mascot - Sky Blue)
export const WordyW = ({ mood = 'idle', size = 80 }: MascotProps) => {
  const isHappy = mood === 'happy';
  const isSad = mood === 'sad';
  const isPanic = mood === 'panic';

  return (
    <motion.div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center"
      animate={
        isHappy
          ? { y: [0, -12, 0, -12, 0], rotate: [0, 5, -5, 5, 0] }
          : isSad
          ? { y: [0, 2, 0, 2, 0], rotate: [0, -3, 3, -3, 0] }
          : isPanic
          ? { scale: [1, 1.05, 0.95, 1.05, 1], x: [-3, 3, -3, 3, 0] }
          : { y: [0, -4, 0] } // idle breathing
      }
      transition={{
        duration: isHappy ? 0.6 : isPanic ? 0.25 : 2.5,
        repeat: isHappy || isPanic ? 2 : Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Shadow */}
        <ellipse cx="50" cy="90" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />

        {/* Arms */}
        <motion.g
          animate={
            isHappy
              ? { rotate: [0, 45, -10, 45, 0] }
              : { rotate: [0, 5, -5, 0] }
          }
          transition={{ duration: 1, repeat: Infinity }}
          style={{ originX: '20px', originY: '50px' }}
        >
          {/* Left Arm & Glove */}
          <path d="M 20 50 Q 5 40 10 30" stroke="#0ea5e9" strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx="10" cy="30" r="7" fill="white" stroke="#0ea5e9" strokeWidth="2" />
        </motion.g>

        <motion.g
          animate={
            isHappy
              ? { rotate: [0, -45, 10, -45, 0] }
              : { rotate: [0, -5, 5, 0] }
          }
          transition={{ duration: 1, repeat: Infinity }}
          style={{ originX: '80px', originY: '50px' }}
        >
          {/* Right Arm & Glove */}
          <path d="M 80 50 Q 95 40 90 30" stroke="#0ea5e9" strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx="90" cy="30" r="7" fill="white" stroke="#0ea5e9" strokeWidth="2" />
        </motion.g>

        {/* Body / Letter W */}
        <path
          d="M 20 20 L 35 75 L 50 40 L 65 75 L 80 20"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Legs & Shoes */}
        <path d="M 35 75 L 35 88" stroke="#0ea5e9" strokeWidth="6" />
        <rect x="25" y="84" width="16" height="8" rx="4" fill="#ef4444" />
        
        <path d="M 65 75 L 65 88" stroke="#0ea5e9" strokeWidth="6" />
        <rect x="59" y="84" width="16" height="8" rx="4" fill="#ef4444" />

        {/* Face (Eyes & Mouth) */}
        {/* Left Eye */}
        <circle cx="42" cy="42" r="8" fill="white" />
        <motion.circle
          cx="42"
          cy="42"
          r="4"
          fill="black"
          animate={isPanic ? { scale: 1.3 } : {}}
        />

        {/* Right Eye */}
        <circle cx="58" cy="42" r="8" fill="white" />
        <motion.circle
          cx="58"
          cy="42"
          r="4"
          fill="black"
          animate={isPanic ? { scale: 1.3 } : {}}
        />

        {/* Mouth */}
        {isSad ? (
          <path d="M 45 56 Q 50 51 55 56" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : isPanic ? (
          <circle cx="50" cy="56" r="4" fill="black" />
        ) : (
          <path d="M 45 52 Q 50 60 55 52" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}
      </svg>
    </motion.div>
  );
};

// Messy (The Letter M Mascot - Coral Orange)
export const MessyM = ({ mood = 'idle', size = 80 }: MascotProps) => {
  const isHappy = mood === 'happy';
  const isSad = mood === 'sad';
  const isPanic = mood === 'panic';

  return (
    <motion.div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center"
      animate={
        isHappy
          ? { y: [0, -10, 0, -10, 0], scaleY: [1, 0.9, 1.1, 0.9, 1] }
          : isSad
          ? { rotate: [0, 4, -4, 0] }
          : isPanic
          ? { rotate: [0, 15, -15, 15, 0], x: [-4, 4, -4, 4, 0] }
          : { y: [0, 4, 0] }
      }
      transition={{
        duration: isHappy ? 0.75 : isPanic ? 0.2 : 2.8,
        repeat: isHappy || isPanic ? 2 : Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Shadow */}
        <ellipse cx="50" cy="90" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />

        {/* Arms */}
        <motion.g
          animate={isHappy ? { y: [-2, 2, -2] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <path d="M 18 50 Q 2 45 5 35" stroke="#ea580c" strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx="5" cy="35" r="7" fill="white" stroke="#ea580c" strokeWidth="2" />

          <path d="M 82 50 Q 98 45 95 35" stroke="#ea580c" strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx="95" cy="35" r="7" fill="white" stroke="#ea580c" strokeWidth="2" />
        </motion.g>

        {/* Body / Letter M */}
        <path
          d="M 18 80 L 18 25 L 50 60 L 82 25 L 82 80"
          fill="none"
          stroke="#f97316"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Googly Eyes */}
        {/* Left Eye (Larger) */}
        <circle cx="36" cy="40" r="10" fill="white" stroke="#ea580c" strokeWidth="1" />
        <motion.circle
          cx="36"
          cy="40"
          r="4.5"
          fill="black"
          animate={isHappy ? { y: [-1, 1, -1] } : {}}
        />

        {/* Right Eye (Smaller) */}
        <circle cx="64" cy="40" r="7" fill="white" stroke="#ea580c" strokeWidth="1" />
        <motion.circle
          cx="64"
          cy="40"
          r="3"
          fill="black"
          animate={isHappy ? { y: [1, -1, 1] } : {}}
        />

        {/* Mouth (Dumb Smile / Shocked) */}
        {isSad ? (
          <path d="M 45 56 Q 50 51 55 56" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : isPanic ? (
          <path d="M 44 54 C 44 50, 56 50, 56 54 C 56 58, 44 58, 44 54" fill="black" />
        ) : (
          <path d="M 44 52 Q 50 64 56 50" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}
      </svg>
    </motion.div>
  );
};

// Botty (The Robot Opponent Mascot - Grey & Cyan)
export const BottyRobot = ({ mood = 'idle', size = 80 }: MascotProps) => {
  const isHappy = mood === 'happy';
  const isSad = mood === 'sad';

  return (
    <motion.div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center"
      animate={
        isHappy
          ? { y: [0, -8, 0, -8, 0] }
          : isSad
          ? { rotate: [0, -5, 5, 0] }
          : { y: [0, -3, 0] }
      }
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="90" rx="25" ry="5" fill="rgba(0,0,0,0.15)" />

        {/* Robot Antenna */}
        <path d="M 50 20 L 50 10" stroke="#64748b" strokeWidth="4" />
        <circle cx="50" cy="10" r="4" fill="#06b6d4" />

        {/* Head */}
        <rect x="25" y="20" width="50" height="36" rx="8" fill="#94a3b8" stroke="#64748b" strokeWidth="4" />

        {/* LED Screen */}
        <rect x="32" y="27" width="36" height="22" rx="4" fill="#0f172a" />

        {/* Cyan glowing eyes */}
        <circle cx="43" cy="38" r="3" fill="#22d3ee" className="animate-pulse" />
        <circle cx="57" cy="38" r="3" fill="#22d3ee" className="animate-pulse" />

        {/* Neck */}
        <rect x="44" y="56" width="12" height="8" fill="#475569" />

        {/* Body */}
        <rect x="20" y="64" width="60" height="20" rx="6" fill="#64748b" stroke="#475569" strokeWidth="4" />
      </svg>
    </motion.div>
  );
};
