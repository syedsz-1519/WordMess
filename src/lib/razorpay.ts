// Mock Razorpay integration for Wordmess Hub
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export const initiateSubscription = async (planId: string, uid: string, onSuccess: () => void) => {
  // In a real app, this would load the Razorpay SDK and open the checkout modal.
  // For now, we mock a successful payment flow.
  console.log(`Initiating Razorpay subscription for ${planId}`);
  
  setTimeout(async () => {
    // Mock success
    const plan = planId === 'plan_wm_plus' ? 'plus' : 'pro';
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      plan,
      razorpaySubId: `sub_mock_${Math.random().toString(36).substring(7)}`
    }, { merge: true });
    
    onSuccess();
  }, 1000);
};

export const generateGiftCode = async (plan: 'pro' | 'plus', createdBy: string) => {
  // Simulate Razorpay one-time payment for gift
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  const giftRef = doc(db, 'giftCodes', code);
  
  await setDoc(giftRef, {
    plan,
    usedBy: null,
    createdBy,
    expiresAt: Timestamp.fromMillis(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  });
  
  return code;
};
