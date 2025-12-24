# Deploy Firestore Rules

The Firestore security rules need to be deployed to Firebase for the stamps feature to work.

## Option 1: Deploy via Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `trailtowns-7cf55`
3. Navigate to **Firestore Database** > **Rules** tab
4. Copy the contents of `firestore.rules` file
5. Paste into the rules editor
6. Click **Publish**

## Option 2: Deploy via Firebase CLI

If you have Firebase CLI installed:

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

## Current Rules

The current rules allow:
- ✅ **Read**: Anyone can read stamps
- ✅ **Create**: Anyone can create stamps (unauthenticated allowed)
- ✅ **Update**: Anyone can update stamps (for likes/dislikes)
- ❌ **Delete**: Deletes are disabled

**Important**: These rules are permissive for MVP/testing. Update them to require authentication for production use.


