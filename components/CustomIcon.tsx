import React from 'react';
import { Image, StyleSheet, ImageStyle, ViewStyle } from 'react-native';

export type IconName = 
  | 'fox-head'        // App icon/avatar
  | 'compass'         // Navigation
  | 'map'             // Map view
  | 'signpost'        // Directional sign
  | 'plus'            // Add/create
  | 'gear'            // Settings
  | 'tree'            // Pine tree
  | 'mountains'       // Mountains
  | 'campfire'        // Campfire
  | 'lantern'         // Lantern
  | 'tent'            // Tent
  | 'bridge'          // Bridge
  | 'paw-print'       // Explore/tracking
  | 'hiking-boot'     // Hiking gear
  | 'water-bottle'    // Water bottle
  | 'camera'          // Camera
  | 'backpack'        // Backpack
  | 'shop'            // Shop/store
  | 'bicycle'         // Bicycle
  | 'trophy';         // Trophy/achievements

interface CustomIconProps {
  name: IconName;
  size?: number;
  color?: string; // For future tinting support
  style?: ImageStyle | ViewStyle;
}

/**
 * Custom Icon Component using TrailTowns icon sprite sheet
 * 
 * Note: Currently uses the full sprite sheet. For production,
 * you may want to crop individual icons and reference them directly.
 */
export default function CustomIcon({ 
  name, 
  size = 24, 
  color,
  style 
}: CustomIconProps) {
  // For now, we'll use MaterialCommunityIcons as fallback
  // until individual icons are cropped from the sprite sheet
  // This allows the app to work while icons are being prepared
  
  // Icon mapping to MaterialCommunityIcons equivalents
  const iconMap: Record<IconName, string> = {
    'fox-head': 'account', // Using account as placeholder
    'compass': 'compass-outline',
    'map': 'map',
    'signpost': 'sign-direction',
    'plus': 'plus',
    'gear': 'cog',
    'tree': 'tree',
    'mountains': 'terrain',
    'campfire': 'fire',
    'lantern': 'lightbulb-on-outline',
    'tent': 'tent',
    'bridge': 'bridge',
    'paw-print': 'paw',
    'hiking-boot': 'shoe-formal',
    'water-bottle': 'water',
    'camera': 'camera',
    'backpack': 'bag-personal',
    'shop': 'store',
    'bicycle': 'bike',
    'trophy': 'trophy',
  };

  // TODO: Replace with actual sprite sheet implementation
  // For now, return null and we'll use MaterialCommunityIcons fallback
  // This component structure is ready for when icons are cropped
  
  return null;
}

// Export icon names for type safety
export { type IconName };
