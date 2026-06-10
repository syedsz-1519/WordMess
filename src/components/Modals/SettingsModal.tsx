import React from 'react';
import { Modal } from '../UI/Modal';
import { Toggle } from '../UI/Toggle';
import { useUserStore } from '../../store/userStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { isHapticEnabled, toggleHaptic, notifTime, setNotifTime } = useUserStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="flex flex-col gap-2">
        <Toggle 
          label="Haptic Feedback" 
          enabled={isHapticEnabled} 
          onChange={toggleHaptic} 
        />
        
        <div className="flex items-center justify-between py-3 border-b border-[var(--wm-border)]">
          <span className="font-medium text-[var(--wm-text)]">Daily Reminder Time</span>
          <input 
            type="time" 
            value={notifTime}
            onChange={(e) => setNotifTime(e.target.value)}
            className="bg-[var(--wm-bg)] border border-[var(--wm-border)] text-white px-2 py-1 rounded outline-none"
          />
        </div>
        
        <div className="mt-4 pt-4 text-center text-xs text-[var(--wm-text-muted)]">
          <p>WORDLE MESS Hub v2.0</p>
          <p>guess it. mess it. share it.</p>
        </div>
      </div>
    </Modal>
  );
};
