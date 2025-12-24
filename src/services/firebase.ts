import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Validate that all required config values are present
const validateConfig = () => {
  const requiredKeys = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID',
  ];

  const missingKeys = requiredKeys.filter(
    (key) => !process.env[key] || process.env[key] === ''
  );

  if (missingKeys.length > 0) {
    console.warn(
      `⚠️ Firebase configuration missing: ${missingKeys.join(', ')}\n` +
      'Please add these to your .env file. See .env.example for reference.'
    );
    return false;
  }

  return true;
};

// Initialize Firebase App
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

try {
  // Check if Firebase is already initialized
  if (getApps().length === 0) {
    if (!validateConfig()) {
      throw new Error('Firebase configuration is incomplete');
    }

    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');

    // Initialize Firestore
    db = getFirestore(app);
    console.log('✅ Firestore initialized successfully');

    // Initialize Auth with AsyncStorage persistence for React Native
    try {
      if (Platform.OS !== 'web') {
        // For React Native, use initializeAuth with AsyncStorage persistence
        // Try to get getReactNativePersistence from the react-native subpath
        let getReactNativePersistence;
        try {
          // Try to require the react-native module
          const authReactNative = require('firebase/auth/react-native');
          getReactNativePersistence = authReactNative.getReactNativePersistence;
        } catch (requireError) {
          // If that fails, use getAuth as fallback
          console.warn('⚠️ Could not load getReactNativePersistence, using getAuth instead');
          auth = getAuth(app);
          console.log('✅ Firebase Auth initialized with getAuth (fallback)');
        }
        
        if (getReactNativePersistence) {
          auth = initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
          });
          console.log('✅ Firebase Auth initialized successfully with persistence');
        }
      } else {
        auth = getAuth(app);
        console.log('✅ Firebase Auth initialized successfully');
      }
    } catch (error: any) {
      // If auth is already initialized, get the existing instance
      if (error.code === 'auth/already-initialized') {
        auth = getAuth(app);
        console.log('✅ Firebase Auth already initialized, using existing instance');
      } else {
        // Fallback: try getAuth if initializeAuth fails
        console.warn('⚠️ Could not initialize auth with persistence, falling back to getAuth:', error.message);
        auth = getAuth(app);
      }
    }
  } else {
    // Use existing app instance
    app = getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('✅ Using existing Firebase instance');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

// Export initialized instances
export { app, db, auth };
export default app;

