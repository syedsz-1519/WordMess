import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'correct' | 'pro' | 'plus' | 'neutral';
}

export const Badge = ({ label, variant = 'neutral' }: BadgeProps) => {
  const bgColors = {
    correct: 'bg-[var(--wm-correct)] text-white',
    pro: 'bg-orange-500 text-white',
    plus: 'bg-purple-500 text-white',
    neutral: 'bg-[var(--wm-border)] text-[var(--wm-text-muted)]'
  };

  return (
    <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-wider ${bgColors[variant]}`}>
      {label}
    </span>
  );
};
