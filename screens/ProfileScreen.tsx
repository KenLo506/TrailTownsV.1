import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import TrailIcon from '../components/TrailIcon';
import CollectibleUnlockModal from '../components/CollectibleUnlockModal';
import { 
  getStepCount, 
  subscribeToStepCount, 
  startStepCounting 
} from '../src/services/steps';
import { 
  initializeCollectibles, 
  checkMilestones,
  type Collectible 
} from '../src/services/collectibles';
import '../global.css';

export default function ProfileScreen() {
  const [steps, setSteps] = useState<number>(0);
  const [unlockedCollectible, setUnlockedCollectible] = useState<Collectible | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  useEffect(() => {
    // Initialize collectibles on mount
    initializeCollectibles();
    
    // Get initial step count
    getStepCount().then(setSteps);
    
    // Subscribe to step count changes
    const unsubscribe = subscribeToStepCount((newSteps) => {
      setSteps(newSteps);
      
      // Check for milestones
      checkMilestones(newSteps).then((collectible) => {
        if (collectible) {
          setUnlockedCollectible(collectible);
          setShowUnlockModal(true);
        }
      });
    });
    
    // Start step counting (mock counter for development)
    let stepCounterCleanup: (() => void) | null = null;
    startStepCounting((newSteps) => {
      // Steps are already updated via subscription, but this ensures counter runs
    }).then((cleanup) => {
      stepCounterCleanup = cleanup;
    });
    
    return () => {
      unsubscribe();
      if (stepCounterCleanup) {
        stepCounterCleanup();
      }
    };
  }, []);

  return (
    <View className="flex-1 bg-ac-cream">
      <ExpoStatusBar style="dark" />
      <Header title="Profile" />
      
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <View style={styles.avatarContainer}>
            <TrailIcon name="fox-head" size={56} color="#6BA66B" />
          </View>
          <Text style={styles.nameText}>
            Trail Explorer
          </Text>
          <Text style={styles.levelText}>
            Level 5 Adventurer 🌲
          </Text>
        </View>

        {/* Steps Indicator */}
        <View style={styles.stepsCard}>
          <View style={styles.stepsHeader}>
            <TrailIcon name="hiking-boot" size={28} color="#8FD08F" />
            <Text style={styles.stepsLabel}>Steps</Text>
          </View>
          <Text style={styles.stepsNumber}>{steps.toLocaleString()}</Text>
          <Text style={styles.stepsSubtext}>Keep walking to unlock badges! 🎯</Text>
        </View>

        <View style={styles.card}>
          <View className="flex-row items-center mb-6">
            <View style={styles.iconCircle}>
              <TrailIcon name="trophy" size={24} color="#FFC107" />
            </View>
            <Text style={styles.sectionTitle}>
              Stats
            </Text>
          </View>
          
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Trails</Text>
            </View>
            <View className="items-center">
              <Text style={styles.statNumber}>450</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View className="items-center">
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.iconCircle}>
            <TrailIcon name="map" size={24} color="#8FD08F" />
          </View>
          <Text style={styles.actionText}>
            My Trails
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#A1887F" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.iconCircle}>
            <TrailIcon name="gear" size={24} color="#A1887F" />
          </View>
          <Text style={styles.actionText}>
            Settings
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#A1887F" />
        </TouchableOpacity>
      </ScrollView>

      {/* Collectible Unlock Modal */}
      <CollectibleUnlockModal
        visible={showUnlockModal}
        collectible={unlockedCollectible}
        onClose={() => {
          setShowUnlockModal(false);
          setUnlockedCollectible(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#B8E6B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#8FD08F',
    shadowColor: '#8FD08F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6D4C41',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 18,
    color: '#A1887F',
    fontWeight: '500',
  },
  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#E8F5E9',
    alignItems: 'center',
  },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  stepsLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6D4C41',
  },
  stepsNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8FD08F',
    marginBottom: 8,
  },
  stepsSubtext: {
    fontSize: 14,
    color: '#A1887F',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6D4C41',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6BA66B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#A1887F',
    fontWeight: '500',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  actionText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#6D4C41',
    marginLeft: 12,
  },
});
