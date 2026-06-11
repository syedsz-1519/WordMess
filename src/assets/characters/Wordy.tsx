import React from 'react';
import { motion } from 'framer-motion';

interface WordyProps {
  emotion?: 'idle' | 'happy' | 'cheer' | 'sad';
  size?: number;
}

const animations = {
  idle: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 3 } },
  happy: { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0],
           transition: { duration: 0.6 } },
  cheer: { y: [0, -24, 0, -16, 0],
           transition: { duration: 0.8, times: [0,.3,.5,.7,1] } },
  sad:   { x: [0, -8, 8, -6, 6, 0],
           transition: { duration: 0.4 } },
};

export const Wordy = ({ emotion = 'idle', size = 80 }: WordyProps) => {
  // Safe fallback for emotion mapping
  const currentAnim = animations[emotion] || animations.idle;

  return (
    <motion.div
      animate={currentAnim}
      style={{
        width: size,
        height: size,
        backgroundColor: '#4ade80',
        color: '#052e16',
        boxShadow: '0 4px 0 #166534',
      }}
      className="relative rounded-[20%] flex flex-col items-center justify-between p-2 font-black select-none border-2 border-[#22c55e]"
    >
      {/* Eyes in top half */}
      <div className="flex justify-between w-3/5 mt-1 px-1">
        <div className="w-2 h-2 bg-black rounded-full" />
        <div className="w-2 h-2 bg-black rounded-full" />
      </div>

      {/* Smile: curved border-bottom arc */}
      <div className="w-5 h-2.5 border-b-4 border-[#052e16] rounded-b-full -mt-2" />

      {/* Character Signature letter W */}
      <span className="text-3xl font-extrabold tracking-tighter leading-none mb-1">W</span>
    </motion.div>
  );
};

export default Wordy;
