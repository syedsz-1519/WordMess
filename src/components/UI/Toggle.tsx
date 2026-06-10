import React from 'react';

interface ToggleProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export const Toggle = ({ label, enabled, onChange }: ToggleProps) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--wm-border)]">
      <span className="font-medium text-[var(--wm-text)]">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`w-12 h-6 rounded-full transition-colors relative ${
          enabled ? 'bg-[var(--wm-correct)]' : 'bg-[var(--wm-border)]'
        }`}
      >
        <span 
          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`} 
        />
      </button>
    </div>
  );
};
