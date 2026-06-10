import React from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { useSubscription } from '../../hooks/useSubscription';
import { PLANS } from '../../constants/plans';
import { initiateSubscription } from '../../lib/razorpay';
import { useUserStore } from '../../store/userStore';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProModal = ({ isOpen, onClose }: ProModalProps) => {
  const { plan, uid } = useUserStore();
  const { isPro, isPlus } = useSubscription();

  const handleUpgrade = (planId: string) => {
    if (!uid) {
      alert("Please log in first.");
      return;
    }
    // Fake Razorpay flow
    initiateSubscription(planId, uid, () => {
      alert("Payment successful! Welcome to the upgraded tier.");
      onClose();
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade to Pro / Plus">
      <div className="flex flex-col gap-6">
        <p className="text-sm text-[var(--wm-text-muted)] text-center">
          Unlock the full Wordmess Hub experience with more game modes, deeper stats, and powerful AI hints.
        </p>

        {/* PRO PLAN */}
        <div className="border border-orange-500 rounded p-4 bg-orange-500/10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-black text-xl text-orange-500 uppercase">PRO</h3>
            <span className="font-bold">₹{PLANS.PRO.price}/mo</span>
          </div>
          <ul className="text-sm space-y-2 mb-4">
            {PLANS.PRO.features.map((feature, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500">✓</span> {feature}
              </li>
            ))}
          </ul>
          <Button 
            variant="primary" 
            fullWidth 
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={() => handleUpgrade(PLANS.PRO.plan_id)}
            disabled={isPro || isPlus}
          >
            {isPro || isPlus ? 'Current Plan' : 'Upgrade to Pro'}
          </Button>
        </div>

        {/* PLUS PLAN */}
        <div className="border border-purple-500 rounded p-4 bg-purple-500/10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-black text-xl text-purple-500 uppercase">PLUS</h3>
            <span className="font-bold">₹{PLANS.PLUS.price}/mo</span>
          </div>
          <ul className="text-sm space-y-2 mb-4">
            {PLANS.PLUS.features.map((feature, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-purple-500">✓</span> {feature}
              </li>
            ))}
          </ul>
          <Button 
            variant="primary" 
            fullWidth 
            className="bg-purple-500 text-white hover:bg-purple-600"
            onClick={() => handleUpgrade(PLANS.PLUS.plan_id)}
            disabled={isPlus}
          >
            {isPlus ? 'Current Plan' : 'Upgrade to Plus'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
