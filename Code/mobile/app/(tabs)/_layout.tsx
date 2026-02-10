import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { TabBarIcon } from '@/components/ui/TabBarIcon';
import { HapticTab } from '@/components/haptic-tab';
import CustomHeader from '@/components/Header';

export default function TabLayout() {

    return (
        <Tabs
            backBehavior="history"
            screenOptions={{
                headerShown: true,
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
                    height: 90,
                    borderTopWidth: 0,
                    elevation: 0,
                    backgroundColor: 'transparent',

                    // --- THE FIX ---
                    // Apply the radius here too, so the shadow follows the curve
                    borderTopLeftRadius: 34,   // Matches your maskWrapper
                    borderTopRightRadius: 34,
                    // ----------------

                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.15,
                    shadowRadius: 20,

                    paddingTop: 19,
                },

                // 2. The Glass Layer
                tabBarBackground: () => (
                    <View style={styles.maskWrapper}>
                        {/* Figma Layer: Background Blur
                           Property: backdrop-filter: blur(40px)
                        */}
                        <BlurView
                            intensity={40} // EXACTLY matching Figma's 40px blur
                            tint="light"   // "light" + White Overlay = Hard Light simulation
                            style={StyleSheet.absoluteFill}
                        >
                            {/* Figma Layer: Fill & Blend Mode Simulation
                               Figma uses: rgba(0,0,0, 0.21) + Hard Light

                               React Native Equivalent:
                               To mimic 'Hard Light' (which brightens/contrasts) on a light UI,
                               we use a white overlay. A 21% black layer would just look grey.
                            */}
                            <View style={{
                                ...StyleSheet.absoluteFillObject,
                                backgroundColor: 'rgba(255, 255, 255, 0.35)',
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
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="sensors" color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="faq"
                options={{
                    title: 'FAQ',
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="chart" color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="activities"
                options={{
                    title: 'Activities',
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="activities" color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen name="profile" options={{ href: null }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    maskWrapper: {
        flex: 1,
        // Figma Shape: border-radius: 34px
        borderTopLeftRadius: 34,
        borderTopRightRadius: 34,
        overflow: 'hidden', // Clips the BlurView to the radius
    },
});