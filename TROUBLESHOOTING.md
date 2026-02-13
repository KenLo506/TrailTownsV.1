# Troubleshooting Expo Go Connection Issues

## Error: `xcrun simctl help exited with non-zero code: 72`

This error is related to iOS simulator, but if you're using Expo Go, you can ignore it. Focus on getting Expo Go connected instead.

## Quick Fixes

### 1. Clear All Caches and Restart

```bash
# Stop any running Expo processes (Ctrl+C)

# Clear Expo cache
npx expo start --clear

# If that doesn't work, clear everything:
rm -rf node_modules
rm -rf .expo
rm -rf .expo-shared
npm install
npx expo start --clear
```

### 2. Check Metro Bundler Port

Make sure port 8081 is not in use:

```bash
# Check if port is in use
lsof -ti:8081

# Kill process if needed
kill -9 $(lsof -ti:8081)

# Then restart Expo
npx expo start --clear
```

### 3. Use Tunnel Mode (if on different network)

If your phone and computer are on different networks:

```bash
npx expo start --tunnel
```

### 4. Check Network Connection

- Make sure your phone and computer are on the same Wi-Fi network
- Or use tunnel mode (see above)
- Try disabling VPN if you have one

### 5. Restart Expo Go App

- Close Expo Go completely on your phone
- Reopen it
- Scan QR code again

### 6. Check for JavaScript Errors

Look at the terminal output when you run `npx expo start`. Common issues:

- **Firebase config missing**: Make sure `.env` file exists with all Firebase variables
- **Import errors**: Check that all imports are correct
- **TypeScript errors**: Run `npx tsc --noEmit` to check for type errors

### 7. Try Web Version First

Test if the app works in web browser:

```bash
npx expo start --web
```

If web works but Expo Go doesn't, it's likely a network or Expo Go app issue.

### 8. Reset Expo Go App

On your phone:
1. Delete Expo Go app
2. Reinstall from App Store/Play Store
3. Try connecting again

### 9. Check Expo CLI Version

Make sure you have the latest Expo CLI:

```bash
npm install -g expo-cli@latest
# Or use npx (recommended)
npx expo@latest start --clear
```

### 10. Check Console for Errors

When the app tries to load in Expo Go, check:
- Terminal output for Metro bundler errors
- Expo Go app for error messages
- Browser console if using web version

## Common Issues

### Firebase Configuration Missing

If you see Firebase errors, make sure `.env` file exists with:
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

### react-native-maps Not Loading

If maps don't show:
- Make sure you're using Expo Go (not bare workflow)
- Maps should work in Expo Go without additional setup
- Check location permissions are granted

### Anonymous Auth Not Enabled

If you see auth errors:
1. Go to Firebase Console
2. Authentication > Sign-in method
3. Enable "Anonymous" authentication
4. Save

## Still Not Working?

1. Check Expo Go app version (update if needed)
2. Try creating a minimal test app to verify Expo Go works
3. Check Expo status: https://status.expo.dev/
4. Try using Expo Dev Tools: `npx expo start --dev-client`
