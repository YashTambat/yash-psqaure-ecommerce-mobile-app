import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#6E6E6E',
        tabBarStyle: {
          backgroundColor: '#111111',
          borderTopColor: '#1F1F1F',
          height: 68 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          display: 'none',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="search-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Add to Cart',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="bag-handle-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
