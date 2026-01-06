import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  Unsubscribe,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { ensureAuthenticated } from './auth';

export interface Collectible {
  id: string;
  name: string;
  description: string;
  emoji: string;
  milestone: number; // Steps required to unlock
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Get or create user ID (ensures authentication)
const getUserId = async (): Promise<string> => {
  const user = await ensureAuthenticated();
  return user.uid;
};

/**
 * Initialize mock collectibles in Firestore
 */
export const initializeCollectibles = async (): Promise<void> => {
  const collectibles: Omit<Collectible, 'id'>[] = [
    {
      name: 'Spring Flower Badge',
      description: 'You walked 1,000 steps!',
      emoji: '🌸',
      milestone: 1000,
      rarity: 'common',
    },
    {
      name: 'Trail Explorer Badge',
      description: 'You walked 5,000 steps!',
      emoji: '🌲',
      milestone: 5000,
      rarity: 'rare',
    },
    {
      name: 'Mountain Climber Badge',
      description: 'You walked 10,000 steps!',
      emoji: '⛰️',
      milestone: 10000,
      rarity: 'epic',
    },
    {
      name: 'Forest Guardian Badge',
      description: 'You walked 25,000 steps!',
      emoji: '🦌',
      milestone: 25000,
      rarity: 'legendary',
    },
  ];

  try {
    for (const collectible of collectibles) {
      const collectibleRef = doc(db, 'collectibles', `milestone_${collectible.milestone}`);
      const docSnap = await getDoc(collectibleRef);
      
      if (!docSnap.exists()) {
        await setDoc(collectibleRef, {
          ...collectible,
          createdAt: Timestamp.now(),
        });
      }
    }
    console.log('✅ Collectibles initialized');
  } catch (error) {
    console.error('Error initializing collectibles:', error);
  }
};

/**
 * Get all collectibles
 */
export const getAllCollectibles = async (): Promise<Collectible[]> => {
  try {
    const collectiblesRef = collection(db, 'collectibles');
    const snapshot = await getDocs(collectiblesRef);
    
    const collectibles: Collectible[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      collectibles.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        emoji: data.emoji,
        milestone: data.milestone,
        rarity: data.rarity,
      });
    });
    
    return collectibles.sort((a, b) => a.milestone - b.milestone);
  } catch (error) {
    console.error('Error getting collectibles:', error);
    return [];
  }
};

/**
 * Get user's unlocked collectibles
 */
export const getUserCollectibles = async (): Promise<string[]> => {
  try {
    const userId = await getUserId();
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.collectibles || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user collectibles:', error);
    return [];
  }
};

/**
 * Unlock a collectible for the user
 */
export const unlockCollectible = async (collectibleId: string): Promise<void> => {
  try {
    const userId = await getUserId();
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    const currentCollectibles = userDoc.exists() 
      ? (userDoc.data().collectibles || [])
      : [];
    
    if (!currentCollectibles.includes(collectibleId)) {
      await updateDoc(userRef, {
        collectibles: [...currentCollectibles, collectibleId],
        lastCollectibleUnlocked: Timestamp.now(),
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error unlocking collectible:', error);
    throw error;
  }
};

/**
 * Check for milestone achievements and unlock collectibles
 */
export const checkMilestones = async (steps: number): Promise<Collectible | null> => {
  try {
    const collectibles = await getAllCollectibles();
    const userCollectibles = await getUserCollectibles();
    
    // Find collectibles that should be unlocked
    const newlyUnlocked = collectibles.find(
      (collectible) => 
        steps >= collectible.milestone && 
        !userCollectibles.includes(collectible.id)
    );
    
    if (newlyUnlocked) {
      await unlockCollectible(newlyUnlocked.id);
      console.log(`🎉 Unlocked collectible: ${newlyUnlocked.name} at ${steps} steps!`);
      return newlyUnlocked;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking milestones:', error);
    return null;
  }
};

/**
 * Subscribe to user's collectibles
 */
export const subscribeToUserCollectibles = (
  callback: (collectibleIds: string[]) => void
): Unsubscribe => {
  let userId: string;
  
  getUserId().then((id) => {
    userId = id;
    const userRef = doc(db, 'users', userId);
    
    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback(data.collectibles || []);
      } else {
        callback([]);
      }
    }, (error) => {
      console.error('Error in collectibles snapshot:', error);
    });
  }).catch((error) => {
    console.error('Error getting user ID:', error);
  });
  
  return () => {};
};

