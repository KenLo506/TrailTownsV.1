import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  updateDoc, 
  doc,
  deleteDoc,
  runTransaction,
  getDoc,
  setDoc,
  Timestamp,
  GeoPoint,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { ensureAuthenticated } from './auth';

export interface Stamp {
  id: string;
  type: string;
  title: string;
  description: string;
  coordinates: { lat: number; lng: number };
  likes: number;
  dislikes: number;
  createdAt: Timestamp;
  creatorId?: string;
}

export type UserVote = 'like' | 'dislike' | null;

export interface CreateStampData {
  type: string;
  title: string;
  description: string;
  coordinates: { lat: number; lng: number };
}

/**
 * Calculate distance between two coordinates in kilometers
 */
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Query stamps within a radius (in km) of a location
 */
export const getNearbyStamps = async (
  centerLat: number,
  centerLng: number,
  radiusKm: number = 10
): Promise<Stamp[]> => {
  try {
    // Firestore doesn't support native geo queries, so we fetch all and filter
    // For production, consider using GeoFirestore or similar
    const stampsRef = collection(db, 'stamps');
    const snapshot = await getDocs(stampsRef);
    
    const stamps: Stamp[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const stamp: Stamp = {
        id: doc.id,
        type: data.type || '',
        title: data.title || '',
        description: data.description || '',
        coordinates: {
          lat: data.coordinates?.latitude || data.coordinates?.lat || 0,
          lng: data.coordinates?.longitude || data.coordinates?.lng || 0,
        },
        likes: data.likes || 0,
        dislikes: data.dislikes || 0,
        createdAt: data.createdAt || Timestamp.now(),
      };
      
      // Filter by distance
      const distance = calculateDistance(
        centerLat,
        centerLng,
        stamp.coordinates.lat,
        stamp.coordinates.lng
      );
      
      if (distance <= radiusKm) {
        stamps.push(stamp);
      }
    });
    
    return stamps;
  } catch (error) {
    console.error('Error fetching nearby stamps:', error);
    throw error;
  }
};

/**
 * Subscribe to nearby stamps with real-time updates
 */
export const subscribeToNearbyStamps = (
  centerLat: number,
  centerLng: number,
  radiusKm: number,
  callback: (stamps: Stamp[]) => void
): Unsubscribe => {
  const stampsRef = collection(db, 'stamps');
  
  return onSnapshot(stampsRef, (snapshot) => {
    const stamps: Stamp[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const stamp: Stamp = {
        id: doc.id,
        type: data.type || '',
        title: data.title || '',
        description: data.description || '',
        coordinates: {
          lat: data.coordinates?.latitude || data.coordinates?.lat || 0,
          lng: data.coordinates?.longitude || data.coordinates?.lng || 0,
        },
        likes: data.likes || 0,
        dislikes: data.dislikes || 0,
        createdAt: data.createdAt || Timestamp.now(),
      };
      
      // Filter by distance
      const distance = calculateDistance(
        centerLat,
        centerLng,
        stamp.coordinates.lat,
        stamp.coordinates.lng
      );
      
      if (distance <= radiusKm) {
        stamps.push(stamp);
      }
    });
    
    callback(stamps);
  }, (error) => {
    console.error('Error in stamps snapshot:', error);
  });
};

/**
 * Create a new stamp
 */
export const createStamp = async (stampData: CreateStampData): Promise<string> => {
  try {
    const userId = await getUserId();
    const docRef = await addDoc(collection(db, 'stamps'), {
      type: stampData.type,
      title: stampData.title,
      description: stampData.description,
      coordinates: new GeoPoint(stampData.coordinates.lat, stampData.coordinates.lng),
      likes: 0,
      dislikes: 0,
      createdAt: Timestamp.now(),
      creatorId: userId,
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating stamp:', error);
    throw error;
  }
};

/**
 * Get or create a user ID (ensures authentication)
 */
const getUserId = async (): Promise<string> => {
  const user = await ensureAuthenticated();
  return user.uid;
};

/**
 * Get user's vote for a stamp
 */
export const getUserVote = async (stampId: string): Promise<UserVote> => {
  try {
    const userId = await getUserId();
    const userVotesRef = doc(db, 'users', userId);
    const userVotesDoc = await getDoc(userVotesRef);
    
    if (!userVotesDoc.exists()) {
      return null;
    }
    
    const data = userVotesDoc.data();
    const likedStamps = data.likedStamps || {};
    
    if (likedStamps[stampId] === 'like') return 'like';
    if (likedStamps[stampId] === 'dislike') return 'dislike';
    return null;
  } catch (error) {
    console.error('Error getting user vote:', error);
    return null;
  }
};

/**
 * Toggle like on a stamp using transaction
 */
export const toggleLikeStamp = async (stampId: string): Promise<{ newLikes: number; newDislikes: number; userVote: UserVote }> => {
  try {
    const userId = await getUserId();
    const stampRef = doc(db, 'stamps', stampId);
    const userVotesRef = doc(db, 'users', userId);
    
    return await runTransaction(db, async (transaction) => {
      // Get current stamp data
      const stampDoc = await transaction.get(stampRef);
      if (!stampDoc.exists()) {
        throw new Error('Stamp does not exist');
      }
      
      const stampData = stampDoc.data();
      const currentLikes = stampData.likes || 0;
      const currentDislikes = stampData.dislikes || 0;
      
      // Get user's current vote
      const userVotesDoc = await transaction.get(userVotesRef);
      const likedStamps = userVotesDoc.exists() ? (userVotesDoc.data().likedStamps || {}) : {};
      const currentVote: UserVote = likedStamps[stampId] || null;
      
      let newLikes = currentLikes;
      let newDislikes = currentDislikes;
      let newVote: UserVote;
      
      if (currentVote === 'like') {
        // User already liked, so undo the like
        newLikes = Math.max(0, currentLikes - 1);
        newVote = null;
        delete likedStamps[stampId];
      } else {
        // User didn't like or disliked, so add like
        newLikes = currentLikes + 1;
        newVote = 'like';
        likedStamps[stampId] = 'like';
        
        // If user previously disliked, remove that dislike
        if (currentVote === 'dislike') {
          newDislikes = Math.max(0, currentDislikes - 1);
        }
      }
      
      // Update stamp
      transaction.update(stampRef, {
        likes: newLikes,
        dislikes: newDislikes,
      });
      
      // Update user votes
      transaction.set(userVotesRef, {
        likedStamps,
      }, { merge: true });
      
      return { newLikes, newDislikes, userVote: newVote };
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

/**
 * Toggle dislike on a stamp using transaction
 */
export const toggleDislikeStamp = async (stampId: string): Promise<{ newLikes: number; newDislikes: number; userVote: UserVote }> => {
  try {
    const userId = await getUserId();
    const stampRef = doc(db, 'stamps', stampId);
    const userVotesRef = doc(db, 'users', userId);
    
    return await runTransaction(db, async (transaction) => {
      // Get current stamp data
      const stampDoc = await transaction.get(stampRef);
      if (!stampDoc.exists()) {
        throw new Error('Stamp does not exist');
      }
      
      const stampData = stampDoc.data();
      const currentLikes = stampData.likes || 0;
      const currentDislikes = stampData.dislikes || 0;
      
      // Get user's current vote
      const userVotesDoc = await transaction.get(userVotesRef);
      const likedStamps = userVotesDoc.exists() ? (userVotesDoc.data().likedStamps || {}) : {};
      const currentVote: UserVote = likedStamps[stampId] || null;
      
      let newLikes = currentLikes;
      let newDislikes = currentDislikes;
      let newVote: UserVote;
      
      if (currentVote === 'dislike') {
        // User already disliked, so undo the dislike
        newDislikes = Math.max(0, currentDislikes - 1);
        newVote = null;
        delete likedStamps[stampId];
      } else {
        // User didn't dislike or liked, so add dislike
        newDislikes = currentDislikes + 1;
        newVote = 'dislike';
        likedStamps[stampId] = 'dislike';
        
        // If user previously liked, remove that like
        if (currentVote === 'like') {
          newLikes = Math.max(0, currentLikes - 1);
        }
      }
      
      // Update stamp
      transaction.update(stampRef, {
        likes: newLikes,
        dislikes: newDislikes,
      });
      
      // Update user votes
      transaction.set(userVotesRef, {
        likedStamps,
      }, { merge: true });
      
      return { newLikes, newDislikes, userVote: newVote };
    });
  } catch (error) {
    console.error('Error toggling dislike:', error);
    throw error;
  }
};

/**
 * Delete a stamp
 */
export const deleteStamp = async (stampId: string): Promise<void> => {
  try {
    const stampRef = doc(db, 'stamps', stampId);
    await deleteDoc(stampRef);
  } catch (error) {
    console.error('Error deleting stamp:', error);
    throw error;
  }
};


