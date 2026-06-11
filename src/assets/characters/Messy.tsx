import React from 'react';
import { motion } from 'framer-motion';

interface MessyProps {
  emotion?: 'idle' | 'laugh' | 'mock' | 'facepalm' | 'highfive';
  size?: number;
}

const animations = {
  idle: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 3, delay: 1.5 } },
  laugh: { rotate: [0, -15, 15, -10, 10, 0], transition: { duration: 0.5 } },
  mock:  { rotate: [-5, 5], scale: 1.1, transition: { repeat: 2, duration: 0.2 } },
  facepalm: { rotate: -45, opacity: 0.7, transition: { duration: 0.4 } },
  highfive: { x: [20, 0], rotate: [-15, 0], transition: { duration: 0.5 } },
};

export const Messy = ({ emotion = 'idle', size = 80 }: MessyProps) => {
  const currentAnim = animations[emotion] || animations.idle;

  return (
    <motion.div
      animate={currentAnim}
      style={{
        width: size,
        height: size,
        backgroundColor: '#fb923c',
        color: '#431407',
        boxShadow: '0 4px 0 #9a3412',
      }}
      className="relative rounded-[20%] flex flex-col items-center justify-between p-2 font-black select-none border-2 border-[#ea580c]"
    >
      {/* Googly Eyes in top half */}
      <div className="flex justify-between w-3/5 mt-1 px-1">
        {/* Left eye larger */}
        <div className="w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center border border-black/10">
          <div className="w-1.5 h-1.5 bg-black rounded-full" />
        </div>
        {/* Right eye smaller */}
        <div className="w-2 h-2 bg-white rounded-full flex items-center justify-center border border-black/10">
          <div className="w-1 h-1 bg-black rounded-full" />
        </div>
      </div>

      {/* Sassy mouth smirk */}
      <div className="w-4 h-2 border-b-3 border-[#431407] rounded-b-full -mt-2 rotate-6" />

      {/* Character Signature letter M */}
      <span className="text-3xl font-extrabold tracking-tighter leading-none mb-1">M</span>
    </motion.div>
  );
};

export default Messy;
