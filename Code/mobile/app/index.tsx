import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';

export default function LandingScreen() {
    const router = useRouter();

    const navigateToLogin = () => {
        router.push('/login'); 
    };

    const navigateToRegister = () => {
        router.push('/register');
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>

                {/* KeyboardAvoidingView keeps inputs visible when typing */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                        {/* --- 1. HERO SECTION --- */}
                        <View style={styles.heroSection}>
                            <Ionicons name="heart-circle" size={80} color={Colors.light.tint} style={{ marginBottom: 10 }} />

                            <ThemedText type="title" style={styles.heroTitle}>
                                Master Your Health with{' '}
                                <ThemedText style={{ color: Colors.light.tint, fontSize: 32, fontWeight: '800' }}>
                                    HRV-4
                                </ThemedText>
                            </ThemedText>

                            <ThemedText type="secondary" style={styles.heroSubtitle}>
                                Unlock the secrets of your body. We track and analyze your Heart Rate Variability to optimize recovery.
                            </ThemedText>
                        </View>

                        {/* --- 2. AUTH CARD (Login Form) --- */}
                        <View style={styles.authCard}>

                            <TouchableOpacity style={styles.loginButton} onPress={navigateToLogin}>
                                <ThemedText style={styles.loginButtonText}>Log In to Dashboard</ThemedText>
                            </TouchableOpacity>

                            <View style={styles.dividerContainer}>
                                <View style={styles.dividerLine} />
                                <ThemedText style={styles.dividerText}>or</ThemedText>
                                <View style={styles.dividerLine} />
                            </View>

                            <TouchableOpacity style={styles.registerButton} onPress={navigateToRegister}>
                                <ThemedText style={styles.registerButtonText}>Create New Account</ThemedText>
                            </TouchableOpacity>
                        </View>

                        {/* --- 3. STATS ROW --- */}
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <ThemedText type="defaultSemiBold" style={styles.statValue}>98%</ThemedText>
                                <ThemedText type="secondary" style={styles.statLabel}>Accuracy</ThemedText>
                            </View>
                            <View style={styles.verticalDivider} />
                            <View style={styles.statItem}>
                                <ThemedText type="defaultSemiBold" style={styles.statValue}>24/7</ThemedText>
                                <ThemedText type="secondary" style={styles.statLabel}>Monitoring</ThemedText>
                            </View>
                            <View style={styles.verticalDivider} />
                            <View style={styles.statItem}>
                                <ThemedText type="defaultSemiBold" style={styles.statValue}>10k+</ThemedText>
                                <ThemedText type="secondary" style={styles.statLabel}>Users</ThemedText>
                            </View>
                        </View>

                        {/* --- 4. FEATURES LIST --- */}
                        <View style={styles.featuresSection}>
                            <ThemedText type="subtitle" style={styles.featuresTitle}>Why HRV-4?</ThemedText>

                            {/* Feature 1: HRV */}
                            <View style={styles.featureCard}>
                                <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                                    <Ionicons name="heart" size={24} color="#007AFF" />
                                </View>
                                <View style={styles.featureTextContainer}>
                                    <ThemedText type="defaultSemiBold">What is HRV?</ThemedText>
                                    <ThemedText type="secondary" style={styles.featureDescription}>
                                        The #1 biomarker for stress and recovery. We decode your nervous system.
                                    </ThemedText>
                                </View>
                            </View>

                            {/* Feature 2: ML Analysis */}
                            <View style={styles.featureCard}>
                                <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
                                    <FontAwesome5 name="brain" size={24} color="#8b5cf6" />
                                </View>
                                <View style={styles.featureTextContainer}>
                                    <ThemedText type="defaultSemiBold">ML-Powered Analysis</ThemedText>
                                    <ThemedText type="secondary" style={styles.featureDescription}>
                                        Algorithms detect patterns hidden in the noise, predicting fatigue early.
                                    </ThemedText>
                                </View>
                            </View>

                            {/* Feature 3: Actionable Trends */}
                            <View style={styles.featureCard}>
                                <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}>
                                    <Ionicons name="trending-up" size={24} color="#10b981" />
                                </View>
                                <View style={styles.featureTextContainer}>
                                    <ThemedText type="defaultSemiBold">Actionable Trends</ThemedText>
                                    <ThemedText type="secondary" style={styles.featureDescription}>
                                        Don&#39;t just see data. Get daily scores that tell you exactly how hard to push.
                                    </ThemedText>
                                </View>
                            </View>

                        </View>

                        {/* Bottom Padding */}
                        <View style={{ height: 40 }} />

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 20 },

    // HERO STYLES
    heroSection: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
    heroBadge: {
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 16
    },
    heroBadgeText: { color: '#007AFF', fontWeight: '600', fontSize: 12 },
    heroTitle: { textAlign: 'center', fontSize: 32, lineHeight: 40, marginBottom: 12 },
    heroSubtitle: { textAlign: 'center', fontSize: 16, lineHeight: 24, paddingHorizontal: 10 },

    // AUTH CARD STYLES
    authCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4, // Android shadow
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#F2F2F7',
    },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#333' },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#F9F9F9',
    },
    loginButton: {
        backgroundColor: '#007AFF',
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E5EA' },
    dividerText: { marginHorizontal: 10, color: '#999', fontSize: 14 },
    registerButton: {
        backgroundColor: '#F2F2F7',
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },

    // STATS ROW
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 10,
        marginBottom: 30,
    },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
    statLabel: { fontSize: 12 },
    verticalDivider: { width: 1, height: 30, backgroundColor: '#E5E5EA' },

    // FEATURES STYLES
    featuresSection: { gap: 16 },
    featuresTitle: { marginBottom: 10, fontSize: 22 },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F2F2F7',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featureTextContainer: { flex: 1 },
    featureDescription: { marginTop: 4, lineHeight: 20 },
});