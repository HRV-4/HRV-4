import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { PageHeader } from '@/components/ui/PageHeader';

// --- RESPONSIVE SCALING ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FIGMA_WIDTH = 402;
const scale = (size: number) => (SCREEN_WIDTH / FIGMA_WIDTH) * size;

export default function Stress() {
    return (
        <ScreenBackground style={styles.container}>
            <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                <View style={styles.content}>

                    {/* Header */}
                    <PageHeader title="Stress & ECG" variant="default" />

                    {/* Empty Content Area */}
                    <View style={styles.mainArea}>
                        {/* Your new components will go here */}
                    </View>

                </View>
            </SafeAreaView>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flex: 1,
        paddingHorizontal: scale(16),
        paddingTop: scale(10),
        paddingBottom: scale(110), // Ensures content doesn't overlap the bottom navbar
    },
    mainArea: {
        flex: 1,
        marginTop: scale(15),
    }
});