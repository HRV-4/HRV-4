import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ScreenBackgroundProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function ScreenBackground({ children, style }: ScreenBackgroundProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    if (isDark) {
        return (
            <View style={[styles.container, { backgroundColor: '#0F1211' }, style]}>
                {children}
            </View>
        );
    }

    return (
        <LinearGradient
            colors={['#EDEDED', '#D0EFEC']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            locations={[0.4253, 0.9552]}
            style={[styles.container, style]}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});