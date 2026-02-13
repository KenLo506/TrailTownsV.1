import React from 'react';
import { Image, ImageStyle, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type TrailIconName =
  | 'fox-head'
  | 'compass'
  | 'map'
  | 'signpost'
  | 'plus'
  | 'gear'
  | 'tree'
  | 'mountains'
  | 'campfire'
  | 'lantern'
  | 'tent'
  | 'bridge'
  | 'paw-print'
  | 'hiking-boot'
  | 'water-bottle'
  | 'camera'
  | 'backpack'
  | 'shop'
  | 'bicycle'
  | 'trophy';

interface TrailIconProps {
  name: TrailIconName;
  size?: number;
  color?: string;
  style?: ImageStyle | ViewStyle;
}

// Static requires so Metro can bundle assets (dynamic paths don't work)
const iconSources: Partial<Record<TrailIconName, number>> = {
  'bicycle': require('../assets/icons/bicycle.png'),
  'campfire': require('../assets/icons/campfire.png'),
  'compass': require('../assets/icons/compass.png'),
  'fox-head': require('../assets/icons/fox-head.png'),
  'gear': require('../assets/icons/gear.png'),
  'hiking-boot': require('../assets/icons/hiking-boot.png'),
  'map': require('../assets/icons/map.png'),
  'signpost': require('../assets/icons/signpost.png'),
  'tent': require('../assets/icons/tent.png'),
  'tree': require('../assets/icons/tree.png'),
  'trophy': require('../assets/icons/trophy.png'),
};

const fallbackIconMap: Record<TrailIconName, string> = {
  'fox-head': 'account-circle',
  'compass': 'compass-outline',
  'map': 'map-outline',
  'signpost': 'sign-direction',
  'plus': 'plus-circle',
  'gear': 'cog',
  'tree': 'tree',
  'mountains': 'terrain',
  'campfire': 'fire',
  'lantern': 'lightbulb-on-outline',
  'tent': 'tent',
  'bridge': 'bridge',
  'paw-print': 'paw',
  'hiking-boot': 'shoe-formal',
  'water-bottle': 'cup-water',
  'camera': 'camera-outline',
  'backpack': 'bag-personal',
  'shop': 'store',
  'bicycle': 'bike',
  'trophy': 'trophy',
};

export default function TrailIcon({
  name,
  size = 24,
  color,
  style,
}: TrailIconProps) {
  const source = iconSources[name];

  if (source != null) {
    return (
      <Image
        source={source}
        style={[
          {
            width: size,
            height: size,
          },
          style as ImageStyle,
        ]}
        resizeMode="contain"
      />
    );
  }

  return (
    <MaterialCommunityIcons
      name={fallbackIconMap[name] as any}
      size={size}
      color={color ?? '#6D4C41'}
      style={style}
    />
  );
}
