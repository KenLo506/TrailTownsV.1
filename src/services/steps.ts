import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  Unsubscribe,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { ensureAuthenticated } from './auth';

// Get or create user ID (ensures authentication)
const getUserId = async (): Promise<string> => {
  const user = await ensureAuthenticated();
  return user.uid;
};

/**
 * Get current step count from Firestore
 */
export const getStepCount = async (): Promise<number> => {
  try {
    const userId = await getUserId();
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.steps || 0;
    }
    
    // Initialize user document with 0 steps
    await setDoc(userRef, { steps: 0, lastUpdated: Timestamp.now() });
    return 0;
  } catch (error) {
    console.error('Error getting step count:', error);
    return 0;
  }
};

/**
 * Update step count in Firestore
 */
export const updateStepCount = async (steps: number): Promise<void> => {
  try {
    const userId = await getUserId();
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      steps,
      lastUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating step count:', error);
    throw error;
  }
};

/**
 * Subscribe to step count changes
 */
export const subscribeToStepCount = (
  callback: (steps: number) => void
): Unsubscribe => {
  let unsubscribe: Unsubscribe | null = null;
  
  getUserId().then((userId) => {
    const userRef = doc(db, 'users', userId);
    
    unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback(data.steps || 0);
      } else {
        callback(0);
      }
    }, (error) => {
      console.error('Error in step count snapshot:', error);
    });
  }).catch((error) => {
    console.error('Error getting user ID:', error);
  });
  
  // Return unsubscribe function
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

/**
 * Start step counting (mock implementation for now)
 * In production, integrate with HealthKit (iOS) or Google Fit (Android)
 */
export const startStepCounting = async (
  onStepUpdate: (steps: number) => void
): Promise<() => void> => {
  // For now, use mock step counter
  // TODO: Integrate with HealthKit/Google Fit for real step counting
  console.log('Using mock step counter (integrate HealthKit/Google Fit for production)');
  return startMockStepCounter(onStepUpdate);
};

/**
 * Mock step counter for development (increments steps periodically)
 */
const startMockStepCounter = (
  onStepUpdate: (steps: number) => void
): (() => void) => {
  let currentSteps = 0;
  
  // Get initial steps from Firestore
  getStepCount().then((steps) => {
    currentSteps = steps;
    onStepUpdate(currentSteps);
  });
  
  // Increment steps every 5 seconds (for testing)
  const interval = setInterval(async () => {
    currentSteps += Math.floor(Math.random() * 10) + 1; // Add 1-10 steps
    await updateStepCount(currentSteps);
    onStepUpdate(currentSteps);
  }, 5000);
  
  return () => {
    clearInterval(interval);
  };
};

