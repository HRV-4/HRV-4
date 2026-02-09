import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Built-in icons
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import  CustomHeader from '@/components/Header';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
        backBehavior={"history"}
        screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: true, // ENABLE the header
            tabBarButton: HapticTab,
            tabBarStyle: Platform.select({
                ios: {
                    position: 'absolute',
                    // iOS needs more height to clear the bottom swipe bar
                    height: 90,
                    paddingBottom: 30,
                    paddingTop: 8,
                },
                default: {
                    // Android/Web: Increase height to ~65-70px to fit the "g" and "p"
                    height: 70 + insets.bottom,
                    // Android: Add the bottom inset to the padding so icons move up
                    paddingBottom: 10 + insets.bottom,
                    paddingTop: 8,     // Pushes the icon down from the top edge
                },
            }),
            // ---------------------------

            // This connects your Custom Header to the Tabs
            header: ({ options }) => <CustomHeader title={options.title || ''} />,
        }}>
      <Tabs.Screen
        name="dashboard"
        options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      {/* 2. Graphs Tab */}
      <Tabs.Screen
          name="graphs"
          options={{
              title: 'Graphs',
              tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
          }}
      />
      {/* 3. Insights Tab */}
      <Tabs.Screen
          name="insights"
          options={{
              title: 'Insights',
              tabBarIcon: ({ color }) => <Ionicons name="bulb" size={24} color={color} />,
          }}
      />
      {/* 4. Activities Tab */}
      <Tabs.Screen
          name="activities"
          options={{
              title: 'Activities',
              tabBarIcon: ({ color }) => <Ionicons name="fitness" size={24} color={color} />,
          }}
      />
      {/* 5. Sensors Tab */}
      <Tabs.Screen
          name="sensors"
          options={{
              title: 'Sensors',
              tabBarIcon: ({ color }) => <Ionicons name="bluetooth" size={24} color={color} />,
          }}
      />
        {/* --- HIDDEN TABS (Keep Header & TabBar visible) --- */}

        <Tabs.Screen
            name="profile"
            options={{
                title: 'Profile',
                href: null, // This hides it from the bottom tab bar!
            }}
        />

        <Tabs.Screen
            name="faq"
            options={{
                title: 'FAQ',
                href: null, // This hides it from the bottom tab bar!
            }}
        />
    </Tabs>
  );
}
