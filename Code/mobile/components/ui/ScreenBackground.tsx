import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ScreenBackgroundProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function ScreenBackground({ children, style }: ScreenBackgroundProps) {
    return (
        <LinearGradient
            // Figma Gradient: #EDEDED (42%) -> #D0EFEC (95%)
            colors={['#EDEDED', '#D0EFEC']}
            start={{ x: 1, y: 0 }} // 270deg starts Right
            end={{ x: 0, y: 0 }}   // Ends Left
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