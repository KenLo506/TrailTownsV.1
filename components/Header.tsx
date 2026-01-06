import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

export default function Header({ title = 'TrailTowns', showLogo = true }: HeaderProps) {
  return (
    <View style={styles.header}>
      {showLogo && (
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="tree" size={32} color="#8FD08F" />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFF8E1',
    borderBottomWidth: 2,
    borderBottomColor: '#E8F5E9',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#8FD08F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6D4C41',
    letterSpacing: 1,
  },
});

