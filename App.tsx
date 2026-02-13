import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TrailIcon from './components/TrailIcon';
import './global.css';

import HomeScreen from './screens/HomeScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';

// Initialize Firebase
import './src/services/firebase';
import { db, auth } from './src/services/firebase';
import { initializeCollectibles } from './src/services/collectibles';
import { ensureAuthenticated } from './src/services/auth';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    // Test Firebase initialization
    console.log('🔥 Testing Firebase connection...');
    console.log('📦 Firestore instance:', db ? '✅ Connected' : '❌ Not connected');
    console.log('🔐 Auth instance:', auth ? '✅ Connected' : '❌ Not connected');
    console.log('✅ Firebase is ready to use!');
    
    // Ensure user is authenticated (anonymous auth)
    ensureAuthenticated().then((user) => {
      console.log('✅ User authenticated:', user.uid);
    }).catch((error) => {
      console.error('❌ Authentication error:', error);
    });
    
    // Initialize collectibles
    initializeCollectibles();
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
            backgroundColor: '#FFF8E1',
            borderTopWidth: 0,
            elevation: 0,
            height: 70,
            paddingBottom: 12,
            paddingTop: 12,
            borderRadius: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
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
              <TrailIcon name="map" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Leaderboard"
          component={LeaderboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <TrailIcon name="trophy" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <TrailIcon name="fox-head" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

