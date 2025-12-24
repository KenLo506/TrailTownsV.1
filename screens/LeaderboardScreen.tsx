import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
      
      <ScrollView className="flex-1 p-6">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-ac-brown-dark mb-2">
            Leaderboard
          </Text>
          <Text className="text-ac-brown text-base">
            Top trail explorers
          </Text>
        </View>

        {leaderboardData.map((item, index) => (
          <View
            key={index}
            className="bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row items-center"
          >
            <View className="w-12 h-12 rounded-full bg-ac-yellow-light items-center justify-center mr-4">
              {item.icon ? (
                <MaterialCommunityIcons name={item.icon as any} size={24} color="#FFC107" />
              ) : (
                <Text className="text-ac-brown-dark font-bold text-lg">
                  {item.rank}
                </Text>
              )}
            </View>
            
            <View className="flex-1">
              <Text className="text-lg font-semibold text-ac-brown-dark">
                {item.name}
              </Text>
              <Text className="text-ac-brown text-sm">
                {item.score} points
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

