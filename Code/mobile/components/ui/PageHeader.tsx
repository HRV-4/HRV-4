import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform, StyleSheet } from 'react-native';
import Svg, { Path, G, Defs, ClipPath, Rect, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';

// --- RESPONSIVE SCALING ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FIGMA_WIDTH = 402;
const scale = (size: number) => (SCREEN_WIDTH / FIGMA_WIDTH) * size;

// --- PROFILE ICON (Moved here for reusability) ---
function ProfileIcon() {
    return (
        <View style={{ width: scale(38), height: scale(38), justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={scale(38)} height={scale(38)} viewBox="0 0 38 38" fill="none" style={{ position: 'absolute' }}>
                <Circle cx="19" cy="19" r="19" fill="white"/>
            </Svg>
            <View style={{ marginTop: scale(2) }}>
                <Svg width={scale(29)} height={scale(28)} viewBox="0 0 29 28" fill="none">
                    <G clipPath="url(#clip0_profile)">
                        <Path d="M14.5 14C15.9339 14 17.3356 13.5895 18.5279 12.8203C19.7201 12.0511 20.6494 10.9579 21.1981 9.67879C21.7469 8.3997 21.8904 6.99224 21.6107 5.63437C21.331 4.2765 20.6405 3.02922 19.6265 2.05026C18.6126 1.07129 17.3208 0.404603 15.9144 0.134506C14.508 -0.13559 13.0503 0.003033 11.7255 0.532846C10.4008 1.06266 9.26849 1.95987 8.47185 3.11101C7.67521 4.26216 7.25 5.61553 7.25 7C7.25192 8.85595 8.01637 10.6354 9.3756 11.9477C10.7348 13.2601 12.5778 13.9982 14.5 14ZM14.5 2.33334C15.4559 2.33334 16.3904 2.60703 17.1853 3.11981C17.9801 3.63259 18.5996 4.36143 18.9654 5.21415C19.3312 6.06687 19.427 7.00518 19.2405 7.91043C19.054 8.81567 18.5936 9.64719 17.9177 10.2998C17.2417 10.9525 16.3805 11.3969 15.4429 11.577C14.5054 11.7571 13.5335 11.6647 12.6504 11.3114C11.7672 10.9582 11.0123 10.3601 10.4812 9.59266C9.95014 8.82524 9.66667 7.92298 9.66667 7C9.66667 5.76233 10.1759 4.57534 11.0823 3.70017C11.9887 2.825 13.2181 2.33334 14.5 2.33334Z" fill="#374957"/>
                        <Path d="M14.5 16.334C11.6168 16.3371 8.85251 17.4443 6.81375 19.4128C4.77498 21.3812 3.6282 24.0502 3.625 26.834C3.625 27.1434 3.75231 27.4402 3.97891 27.6589C4.20552 27.8777 4.51286 28.0007 4.83333 28.0007C5.1538 28.0007 5.46115 27.8777 5.68775 27.6589C5.91436 27.4402 6.04167 27.1434 6.04167 26.834C6.04167 24.6681 6.93281 22.5908 8.51906 21.0593C10.1053 19.5277 12.2567 18.6673 14.5 18.6673C16.7433 18.6673 18.8947 19.5277 20.4809 21.0593C22.0672 22.5908 22.9583 24.6681 22.9583 26.834C22.9583 27.1434 23.0856 27.4402 23.3122 27.6589C23.5389 27.8777 23.8462 28.0007 24.1667 28.0007C24.4871 28.0007 24.7945 27.8777 25.0211 27.6589C25.2477 27.4402 25.375 27.1434 25.375 26.834C25.3718 24.0502 24.225 21.3812 22.1863 19.4128C20.1475 17.4443 17.3832 16.3371 14.5 16.334Z" fill="#374957"/>
                    </G>
                    <Defs>
                        <ClipPath id="clip0_profile">
                            <Rect width="29" height="28" fill="white"/>
                        </ClipPath>
                    </Defs>
                </Svg>
            </View>
        </View>
    );
}

// --- PAGE HEADER COMPONENT ---
interface PageHeaderProps {
    title: string;
    variant?: 'dashboard' | 'default';
}

export const PageHeader = ({ title, variant = 'default' }: PageHeaderProps) => {
    const router = useRouter();

    return (
        <View style={styles.header}>
            <Text style={[
                styles.title,
                variant === 'dashboard' ? styles.dashboardTitle : styles.defaultTitle
            ]}>
                {title}
            </Text>
            <TouchableOpacity onPress={() => router.push('/profile')}>
                <ProfileIcon />
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(20),
        paddingHorizontal: scale(4),
    },
    title: {
        color: '#434F4D',
        fontSize: scale(22),
        lineHeight: scale(41),
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: scale(2) },
        textShadowRadius: scale(11),
    },
    // Dashboard: Bold + Rounded (As per your current setup)
    dashboardTitle: {
        fontWeight: '700',
        fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
        fontVariant: ['no-common-ligatures'],
    },
    // Other Pages: Regular + Standard SF Pro (As per 2nd screenshot)
    defaultTitle: {
        fontWeight: '400',
        fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
        // No rounded design here
    }
});