import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { TabBarIcon } from '@/components/ui/TabBarIcon';
import { HapticTab } from '@/components/haptic-tab';
import CustomHeader from '@/components/Header';

// --- RESPONSIVE SCALING UTILITY ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FIGMA_WIDTH = 402; // Your design width
const scale = (size: number) => (SCREEN_WIDTH / FIGMA_WIDTH) * size;

export default function TabLayout() {

    return (
        <Tabs
            backBehavior="history"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarButton: HapticTab,
                tabBarActiveTintColor: '#000000',
                tabBarInactiveTintColor: '#999999',

                // 1. Container Geometry
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: scale(90), // Scaled
                    borderTopWidth: 0,
                    elevation: 0,
                    backgroundColor: 'transparent',

                    // --- THE FIX ---
                    // Apply the radius here too, so the shadow follows the curve
                    borderTopLeftRadius: scale(34),   // Scaled
                    borderTopRightRadius: scale(34),  // Scaled
                    // ----------------

                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: scale(10) }, // Scaled
                    shadowOpacity: 0.15,
                    shadowRadius: scale(20), // Scaled

                    paddingTop: scale(19), // Scaled
                },

                // 2. The Glass Layer
                tabBarBackground: () => (
                    <View style={styles.maskWrapper}>
                        {/* Figma Layer: Background Blur
                           Property: backdrop-filter: blur(40px)
                        */}
                        <BlurView
                            intensity={40} // Kept exact original
                            tint="light"   // Kept exact original
                            style={StyleSheet.absoluteFill}
                        >
                            {/* Figma Layer: Fill & Blend Mode Simulation */}
                            <View style={{
                                ...StyleSheet.absoluteFillObject,
                                backgroundColor: 'rgba(255, 255, 255, 0.35)', // Kept exact original
                            }} />
                        </BlurView>
                    </View>
                ),

                header: ({ options }) => <CustomHeader title={options.title || ''} />,
            }}
        >
            {/* ... Your Tabs.Screens remain exactly the same ... */}
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="dashboard" color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="graphs"
                options={{
                    title: 'Graphs',
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="graphs" color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="insights"
                options={{
                    title: 'Insights',
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="insights" color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="sensors"
                options={{
                    title: 'Sensors',
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="sensors_watch" color={color} focused={focused} />,
                }}
            />
            {/*
            <Tabs.Screen
                name="stress"
                options={{
                    title: 'Stress & ECG',
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="chart" color={color} focused={focused} />,
                }}
            />
            */}
            <Tabs.Screen
                name="activities"
                options={{
                    title: 'Activities',
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="activities" color={color} focused={focused} />,
                }}
            />
            {/*<Tabs.Screen
                name="profile"
                options={{
                    title: 'Activities',
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="profile" color={color} focused={focused} />,
                }}
            />*/}
            <Tabs.Screen name="profile" options={{ href: null }} />
            <Tabs.Screen name="faq" options={{ href: null }} />
            <Tabs.Screen name="stress" options={{ href: null }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    maskWrapper: {
        flex: 1,
        // Figma Shape: border-radius: 34px
        borderTopLeftRadius: scale(34),  // Scaled
        borderTopRightRadius: scale(34), // Scaled
        overflow: 'hidden',
    },
});