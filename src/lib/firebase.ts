import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { PlanTier } from '../constants/plans';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock-key',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mock-project',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error logging in', error);
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};

export interface UserStats {
  displayName: string | null;
  email: string | null;
  plan: PlanTier;
  razorpaySubId?: string;
  streak: number;
  bestStreak: number;
  lastPlayed?: Timestamp;
  totalSolved: number;
  streakShieldUsed: boolean;
  shieldResetDate?: Timestamp;
  achievements: string[];
  notifTime: string;
  theme: string;
}

export const syncUserStats = async (uid: string, stats: Partial<UserStats>) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, stats, { merge: true });
};

export const getUserStats = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserStats;
  }
  return null;
};
