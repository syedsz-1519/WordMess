import React from 'react';
import { motion } from 'framer-motion';

export const BeachScene = () => {
  // Generate deterministic pseudo-random stars
  const stars = [
    { x: 50, y: 80, r: 1.5, duration: 3, delay: 0.1 },
    { x: 120, y: 150, r: 2, duration: 4, delay: 0.5 },
    { x: 200, y: 50, r: 1, duration: 2.5, delay: 0.2 },
    { x: 280, y: 120, r: 2.5, duration: 5, delay: 0.8 },
    { x: 350, y: 90, r: 1.5, duration: 3.5, delay: 0.3 },
    { x: 420, y: 160, r: 2, duration: 4.5, delay: 0.6 },
    { x: 500, y: 60, r: 1.2, duration: 2.8, delay: 0.1 },
    { x: 580, y: 130, r: 2.5, duration: 4.8, delay: 0.9 },
    { x: 650, y: 80, r: 1.8, duration: 3.2, delay: 0.4 },
    { x: 730, y: 140, r: 2, duration: 4.2, delay: 0.7 },
    { x: 800, y: 70, r: 1.5, duration: 3, delay: 0.2 },
    { x: 880, y: 150, r: 2.2, duration: 5.2, delay: 1.0 },
    { x: 950, y: 90, r: 1.2, duration: 2.9, delay: 0.3 }
  ];

  return (
    <div className="absolute inset-0 z-[-2] pointer-events-none overflow-hidden select-none">
      <svg 
        viewBox="0 0 1000 600" 
        preserveAspectRatio="xMidYMax slice" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>

        {/* Twinkling Stars */}
        {stars.map((star, i) => (
          <motion.circle
            key={i}
            cx={star.x}
            cy={star.y}
            r={star.r}
            fill="#ffffff"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: star.duration, delay: star.delay, ease: 'easeInOut' }}
          />
        ))}

        {/* Glowing Moon */}
        <g>
          <circle cx="850" cy="100" r="80" fill="url(#moonGlow)" />
          <circle cx="850" cy="100" r="35" fill="#fef08a" />
        </g>

        {/* Slow Drifting Clouds */}
        <g>
          {/* Cloud 1 */}
          <motion.path
            d="M 50 100 Q 75 80 100 100 T 150 100 T 200 100 Q 225 120 200 140 H 50 Z"
            fill="rgba(255, 255, 255, 0.05)"
            animate={{ x: [-200, 1100] }}
            transition={{ repeat: Infinity, duration: 80, ease: 'linear' }}
          />
          {/* Cloud 2 */}
          <motion.path
            d="M 300 150 Q 325 130 350 150 T 400 150 T 450 150 Q 475 170 450 190 H 300 Z"
            fill="rgba(255, 255, 255, 0.04)"
            animate={{ x: [-450, 1100] }}
            transition={{ repeat: Infinity, duration: 110, ease: 'linear', delay: 10 }}
          />
        </g>

        {/* Swaying Palm Trees */}
        {/* Palm Left */}
        <motion.g
          style={{ transformOrigin: "100px 530px" }}
          animate={{ rotate: [-1.5, 2, -1.5] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        >
          {/* Trunk */}
          <path d="M 100 530 Q 95 380 120 280" stroke="#78350f" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Leaves */}
          <path d="M 120 280 Q 40 270 20 320" stroke="#15803d" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 120 280 Q 70 200 30 220" stroke="#166534" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 120 280 Q 180 200 200 240" stroke="#15803d" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 120 280 Q 180 320 210 340" stroke="#166534" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Coconuts */}
          <circle cx="108" cy="290" r="6" fill="#451a03" />
          <circle cx="125" cy="295" r="6" fill="#451a03" />
        </motion.g>

        {/* Palm Right */}
        <motion.g
          style={{ transformOrigin: "900px 530px" }}
          animate={{ rotate: [1.5, -2, 1.5] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1.2 }}
        >
          {/* Trunk */}
          <path d="M 900 530 Q 905 390 880 290" stroke="#78350f" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Leaves */}
          <path d="M 880 290 Q 960 280 980 330" stroke="#15803d" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 880 290 Q 930 210 970 230" stroke="#166534" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 880 290 Q 820 210 800 250" stroke="#15803d" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 880 290 Q 820 330 790 350" stroke="#166534" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Coconuts */}
          <circle cx="892" cy="300" r="6" fill="#451a03" />
          <circle cx="875" cy="305" r="6" fill="#451a03" />
        </motion.g>

        {/* Waves moving scrolling in opposite directions */}
        <g>
          {/* Wave 1 */}
          <motion.path
            d="M -100 480 Q 200 450 500 480 T 1100 480 V 600 H -100 Z"
            fill="#0284c7"
            opacity="0.6"
            animate={{ x: [-50, 50] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', repeatType: 'reverse' }}
          />
          {/* Wave 2 */}
          <motion.path
            d="M -100 495 Q 250 515 550 495 T 1100 495 V 600 H -100 Z"
            fill="#0369a1"
            opacity="0.4"
            animate={{ x: [50, -50] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', repeatType: 'reverse' }}
          />
        </g>

        {/* Sand static base */}
        <rect x="0" y="520" width="1000" height="80" fill="url(#sandGrad)" />
      </svg>
    </div>
  );
};

export default BeachScene;
