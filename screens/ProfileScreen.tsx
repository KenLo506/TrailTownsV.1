import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import '../global.css';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-ac-cream">
      <ExpoStatusBar style="dark" />
      
      <ScrollView className="flex-1 p-6">
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-ac-green-light items-center justify-center mb-4">
            <MaterialCommunityIcons name="account" size={48} color="#6BA66B" />
          </View>
          <Text className="text-2xl font-bold text-ac-brown-dark mb-1">
            Trail Explorer
          </Text>
          <Text className="text-ac-brown text-base">
            Level 5 Adventurer
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
          <View className="flex-row items-center mb-4">
            <MaterialCommunityIcons name="star" size={24} color="#FFC107" />
            <Text className="text-lg font-semibold text-ac-brown-dark ml-3">
              Stats
            </Text>
          </View>
          
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-ac-green-dark">12</Text>
              <Text className="text-ac-brown text-sm mt-1">Trails</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-ac-yellow-dark">450</Text>
              <Text className="text-ac-brown text-sm mt-1">Points</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-ac-brown-dark">8</Text>
              <Text className="text-ac-brown text-sm mt-1">Badges</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row items-center">
          <MaterialCommunityIcons name="map" size={24} color="#8FD08F" />
          <Text className="text-lg font-semibold text-ac-brown-dark ml-3 flex-1">
            My Trails
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center">
          <MaterialCommunityIcons name="cog" size={24} color="#A1887F" />
          <Text className="text-lg font-semibold text-ac-brown-dark ml-3 flex-1">
            Settings
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

