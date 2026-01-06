import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

/**
 * Ensure user is authenticated (sign in anonymously if not)
 * This is called to ensure Firestore rules work correctly
 */
export const ensureAuthenticated = async (): Promise<User> => {
  // If already authenticated, return current user
  if (auth.currentUser) {
    return auth.currentUser;
  }

  // Sign in anonymously
  try {
    const userCredential = await signInAnonymously(auth);
    console.log('✅ Signed in anonymously:', userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    console.error('❌ Error signing in anonymously:', error);
    throw error;
  }
};

/**
 * Get current user (authenticated or null)
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

