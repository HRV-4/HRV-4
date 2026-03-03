import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { TabBarIcon } from '@/components/ui/TabBarIcon';
import { HapticTab } from '@/components/haptic-tab';
import CustomHeader from '@/components/Header';
import { useAppColors } from '@/hooks/use-app-colors';
import { useTheme } from '@/context/ThemeContext'; 

// --- RESPONSIVE SCALING UTILITY ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FIGMA_WIDTH = 402; 
const scale = (size: number) => (SCREEN_WIDTH / FIGMA_WIDTH) * size;

export default function TabLayout() {
    const colors = useAppColors(); 
    const { isDark } = useTheme(); 

    return (
        <Tabs
            backBehavior="history"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarButton: HapticTab,
                
           
                tabBarActiveTintColor: isDark ? '#FFFFFF' : '#000000',
                tabBarInactiveTintColor: isDark ? 'rgba(255, 255, 255, 0.4)' : '#999999',

                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: scale(90),
                    borderTopWidth: 0,
                    elevation: 0,
                    backgroundColor: 'transparent',

                    borderTopLeftRadius: scale(34),
                    borderTopRightRadius: scale(34),

                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: scale(10) },
                    shadowOpacity: isDark ? 0.4 : 0.15, 
                    shadowRadius: scale(20),

                    paddingTop: scale(19),
                },

    
                tabBarBackground: () => (
                    <View style={styles.maskWrapper}>
                        <BlurView
                            intensity={40}
                            tint={isDark ? "dark" : "light"} 
                            style={StyleSheet.absoluteFill}
                        >
                            <View style={{
                                ...StyleSheet.absoluteFillObject,
                                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.35)', 
                            }} />
                        </BlurView>
                    </View>
                ),

                header: ({ options }) => <CustomHeader title={options.title || ''} />,
            }}
        >
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
            <Tabs.Screen
                name="activities"
                options={{
                    title: 'Activities',
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="activities" color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen name="profile" options={{ href: null }} />
            <Tabs.Screen name="faq" options={{ href: null }} />
            <Tabs.Screen name="stress" options={{ href: null }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    maskWrapper: {
        flex: 1,
        borderTopLeftRadius: scale(34),
        borderTopRightRadius: scale(34),
        overflow: 'hidden',
    },
});