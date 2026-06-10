import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

export const syncUserStats = async (uid: string, stats: any) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, stats, { merge: true });
};
