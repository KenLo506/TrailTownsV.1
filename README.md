# TrailTowns

A React Native app built with Expo, TypeScript, and Firebase.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env` (or create a `.env` file)
   
   **Firebase Configuration:**
   - Add your Firebase configuration values:
     ```
     EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
     EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```
   - Get these values from [Firebase Console](https://console.firebase.google.com/) > Project Settings > General
   
   **Note:** The app uses `react-native-maps` which works with Expo Go and doesn't require additional configuration.

3. Start the Expo development server:
```bash
npm start
```

4. Scan the QR code with the Expo Go app on your device, or press:
   - `i` for iOS simulator
   - `a` for Android emulator
   - `w` for web browser

## Features

- TypeScript support
- Bottom tab navigation (Home, Leaderboard, Profile)
- NativeWind (Tailwind CSS) styling
- Animal Crossing-inspired color palette
- Firebase v10+ integration (Firestore & Auth)
- Mapbox integration with user location
- Environment variable configuration

## Firebase Setup

Firebase is initialized in `/src/services/firebase.ts` and exports:
- `app` - Firebase app instance
- `db` - Firestore database instance
- `auth` - Firebase Auth instance

The app will log Firebase initialization status to the console on startup.

## Map Setup

The app uses `react-native-maps` which works seamlessly with Expo Go.

**Features:**
- Interactive map on Home screen using Google Maps (iOS/Android)
- User location tracking with permissions
- Custom marker showing current location
- Terrain map type for trail-friendly viewing
- Built-in "My Location" button

**Location Permissions:**
- The app requests location permissions on first launch
- Permissions are configured in `app.json` for iOS and Android

**Note:** If you need Mapbox specifically, you'll need to create a development build using EAS Build, as `@rnmapbox/maps` requires native code compilation.

## Stamps Feature

The app includes a stamps system for marking interesting locations on trails.

**Features:**
- **Real-time Updates**: Uses Firestore snapshot listeners for live stamp updates
- **Nearby Stamps**: Automatically fetches stamps within 10km radius
- **Custom Markers**: Stamps appear as custom markers on the map with type badges
- **Stamp Details**: Tap any stamp marker to see details in a modal
- **Like/Dislike**: Interactive buttons with optimistic UI updates
- **Add Stamps**: Floating action button to create new stamps at your location
- **Optimistic UI**: Instant feedback with automatic rollback on errors

**Stamp Schema:**
```typescript
{
  id: string;
  type: string;
  title: string;
  description: string;
  coordinates: { lat: number, lng: number };
  likes: number;
  dislikes: number;
  createdAt: Timestamp;
}
```

**Firestore Rules:**
- Stamps collection allows read/create/update for all users (MVP mode)
- **IMPORTANT**: You must deploy the Firestore rules to Firebase for stamps to work
- See `DEPLOY_RULES.md` for deployment instructions
- Update `firestore.rules` to add authentication restrictions for production

