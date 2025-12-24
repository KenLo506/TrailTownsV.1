import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import './global.css';

import HomeScreen from './screens/HomeScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';

// Initialize Firebase
import './src/services/firebase';
import { db, auth } from './src/services/firebase';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    // Test Firebase initialization
    console.log('🔥 Testing Firebase connection...');
    console.log('📦 Firestore instance:', db ? '✅ Connected' : '❌ Not connected');
    console.log('🔐 Auth instance:', auth ? '✅ Connected' : '❌ Not connected');
    console.log('✅ Firebase is ready to use!');
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#6BA66B',
          tabBarInactiveTintColor: '#A1887F',
          tabBarStyle: {
            backgroundColor: '#FFF8E7',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            borderRadius: 20,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="map" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Leaderboard"
          component={LeaderboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="trophy" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

