import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import TrailIcon from '../components/TrailIcon';
import '../global.css';

export default function LeaderboardScreen() {
  const leaderboardData: Array<{
    rank: number;
    name: string;
    score: number;
    icon?: string;
  }> = [
    { rank: 1, name: 'Trail Master', score: 1250, icon: 'trophy' },
    { rank: 2, name: 'Nature Explorer', score: 980, icon: 'medal' },
    { rank: 3, name: 'Path Finder', score: 850, icon: 'medal-outline' },
    { rank: 4, name: 'Adventure Seeker', score: 720 },
    { rank: 5, name: 'Trail Blazer', score: 650 },
  ];

  return (
    <View className="flex-1 bg-ac-cream">
      <ExpoStatusBar style="dark" />
      <Header title="Leaderboard" />
      
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text style={styles.subtitle}>
            Top trail explorers 🌟
          </Text>
        </View>

        {leaderboardData.map((item, index) => (
          <View
            key={index}
            style={styles.card}
          >
            <View style={styles.rankCircle}>
              {item.icon ? (
                <TrailIcon name="trophy" size={28} color="#FFC107" />
              ) : (
                <Text style={styles.rankText}>
                  {item.rank}
                </Text>
              )}
            </View>
            
            <View className="flex-1 ml-4">
              <Text style={styles.nameText}>
                {item.name}
              </Text>
              <Text style={styles.scoreText}>
                {item.score} points
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    color: '#A1887F',
    marginBottom: 8,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  rankCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF9C4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFE082',
  },
  rankText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6D4C41',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6D4C41',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 16,
    color: '#A1887F',
    fontWeight: '500',
  },
});
