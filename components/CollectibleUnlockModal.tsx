import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Collectible } from '../src/services/collectibles';

interface CollectibleUnlockModalProps {
  visible: boolean;
  collectible: Collectible | null;
  onClose: () => void;
}

export default function CollectibleUnlockModal({
  visible,
  collectible,
  onClose,
}: CollectibleUnlockModalProps) {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && collectible) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      
      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, collectible]);

  if (!collectible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{collectible.emoji}</Text>
          </View>
          
          <Text style={styles.title}>You Unlocked!</Text>
          <Text style={styles.collectibleName}>{collectible.name}</Text>
          <Text style={styles.description}>{collectible.description}</Text>
          
          <View style={styles.rarityBadge}>
            <Text style={styles.rarityText}>
              {collectible.rarity.toUpperCase()}
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFF8E1',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#FFE082',
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF9C4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#FFE082',
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6D4C41',
    marginBottom: 8,
  },
  collectibleName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6BA66B',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#A1887F',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  rarityBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8FD08F',
  },
  rarityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6BA66B',
    letterSpacing: 1,
  },
});

