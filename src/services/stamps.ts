import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  updateDoc, 
  doc,
  Timestamp,
  GeoPoint,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';

export interface Stamp {
  id: string;
  type: string;
  title: string;
  description: string;
  coordinates: { lat: number; lng: number };
  likes: number;
  dislikes: number;
  createdAt: Timestamp;
}

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
    const docRef = await addDoc(collection(db, 'stamps'), {
      type: stampData.type,
      title: stampData.title,
      description: stampData.description,
      coordinates: new GeoPoint(stampData.coordinates.lat, stampData.coordinates.lng),
      likes: 0,
      dislikes: 0,
      createdAt: Timestamp.now(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating stamp:', error);
    throw error;
  }
};

/**
 * Like a stamp (optimistic update)
 */
export const likeStamp = async (stampId: string, currentLikes: number): Promise<void> => {
  try {
    const stampRef = doc(db, 'stamps', stampId);
    await updateDoc(stampRef, {
      likes: currentLikes + 1,
    });
  } catch (error) {
    console.error('Error liking stamp:', error);
    throw error;
  }
};

/**
 * Dislike a stamp (optimistic update)
 */
export const dislikeStamp = async (stampId: string, currentDislikes: number): Promise<void> => {
  try {
    const stampRef = doc(db, 'stamps', stampId);
    await updateDoc(stampRef, {
      dislikes: currentDislikes + 1,
    });
  } catch (error) {
    console.error('Error disliking stamp:', error);
    throw error;
  }
};


