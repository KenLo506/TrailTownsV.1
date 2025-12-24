const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add 'cjs' to source extensions for Firebase React Native modules
config.resolver.sourceExts.push('cjs');

// Disable experimental package exports to fix Firebase auth registration
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: './global.css' });

