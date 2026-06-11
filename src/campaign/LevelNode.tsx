import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';

interface LevelNodeProps {
  level: number;
  status: 'completed' | 'current' | 'locked';
  x: number;
  y: number;
  onClick: () => void;
}

export const LevelNode = ({ level, status, x, y, onClick }: LevelNodeProps) => {
  const isBoss = level % 50 === 0;
  const isLocked = status === 'locked';
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';

  const size = isBoss ? 36 : 24;

  // Render Star path for boss levels
  const getStarPath = (cx: number, cy: number, r: number) => {
    const points = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const radius = i % 2 === 0 ? r : r / 2;
      points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
    }
    return `M ${points.join(' L ')} Z`;
  };

  return (
    <g className="cursor-pointer select-none" onClick={isLocked ? undefined : onClick}>
      {/* Current Level Pulsing Ring */}
      {isCurrent && (
        <motion.circle
          cx={x}
          cy={y}
          r={size + 8}
          fill="none"
          stroke="#4ade80"
          strokeWidth="3"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
      )}

      {isBoss ? (
        // Star node
        <path
          d={getStarPath(x, y, size)}
          fill={
            isCompleted
              ? '#10b981'
              : isCurrent
              ? '#fb923c'
              : 'rgba(255,255,255,0.08)'
          }
          stroke={isCurrent ? '#ffffff' : 'rgba(255,255,255,0.15)'}
          strokeWidth="2"
          className="transition-all"
        />
      ) : (
        // Circle node
        <circle
          cx={x}
          cy={y}
          r={size}
          fill={
            isCompleted
              ? '#10b981'
              : isCurrent
              ? '#38bdf8'
              : 'rgba(255,255,255,0.08)'
          }
          stroke={isCurrent ? '#ffffff' : 'rgba(255,255,255,0.15)'}
          strokeWidth="2"
          className="transition-all"
        />
      )}

      {/* Node Content */}
      <g transform={`translate(${x - 8}, ${y - 8})`}>
        {isCompleted && (
          <Check size={16} className="text-white" strokeWidth={3} />
        )}
        {isLocked && (
          <Lock size={16} className="text-white/40" />
        )}
        {isCurrent && (
          // Mini Wordy character overlay representation
          <g transform="translate(1, -2)">
            <circle cx="7" cy="7" r="7" fill="#4ade80" />
            <circle cx="5" cy="5" r="1" fill="black" />
            <circle cx="9" cy="5" r="1" fill="black" />
            <path d="M 5 9 Q 7 11 9 9" stroke="black" strokeWidth="1" fill="none" />
          </g>
        )}
      </g>

      {/* Level Label */}
      <text
        x={x}
        y={y + size + 16}
        textAnchor="middle"
        className="text-[10px] font-black tracking-widest fill-white/80 uppercase"
      >
        {isBoss ? `Boss ${level}` : `Lvl ${level}`}
      </text>
    </g>
  );
};

export default LevelNode;
