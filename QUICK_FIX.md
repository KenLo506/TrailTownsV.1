# Quick Fix for Expo Go Connection Issues

## Step 1: Kill Existing Processes

```bash
# Kill any process using port 8081
kill -9 $(lsof -ti:8081) 2>/dev/null

# Kill any Expo processes
pkill -f "expo start" 2>/dev/null
```

## Step 2: Clear Caches

```bash
# Clear Expo cache
rm -rf .expo
rm -rf .expo-shared
rm -rf node_modules/.cache
```

## Step 3: Restart Expo with Clear Cache

```bash
npx expo start --clear
```

## Step 4: Connect via Expo Go

1. Open Expo Go app on your phone
2. Make sure phone and computer are on same Wi-Fi
3. Scan the QR code from terminal
4. OR manually enter the URL shown in terminal

## Alternative: Use Tunnel Mode

If same Wi-Fi doesn't work:

```bash
npx expo start --tunnel --clear
```

This uses Expo's tunnel service (slower but works across networks).

## If Still Not Working

Try web version first to verify app works:

```bash
npx expo start --web
```

Then press `w` in the terminal to open in browser.

## Check These Common Issues

1. **Firebase .env file exists?** - Check if `.env` file has all Firebase config
2. **Anonymous Auth enabled?** - Firebase Console > Authentication > Enable Anonymous
3. **Expo Go app updated?** - Update Expo Go from App Store/Play Store
4. **Network firewall?** - Some corporate networks block Expo connections
