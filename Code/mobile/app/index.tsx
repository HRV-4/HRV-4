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
import { useAppColors } from '@/hooks/use-app-colors';

export default function LandingScreen() {
    const router = useRouter();
    const colors = useAppColors();

    const navigateToLogin = () => {
        //router.push('/login');
       router.push('/dashboard'); //just to test the frontend of mobile
    };

    const navigateToRegister = () => {
        router.push('/register');
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                        {/* --- 1. HERO SECTION --- */}
                        <View style={styles.heroSection}>
                            <Ionicons name="heart-circle" size={80} color={colors.accent} style={{ marginBottom: 10 }} />

                            <ThemedText type="title" style={styles.heroTitle}>
                                Master Your Health with{' '}
                                <ThemedText style={{ color: colors.accent, fontSize: 32, fontWeight: '800' }}>
                                    HRV-4
                                </ThemedText>
                            </ThemedText>

                            <ThemedText type="secondary" style={styles.heroSubtitle}>
                                Unlock the secrets of your body. We track and analyze your Heart Rate Variability to optimize recovery.
                            </ThemedText>
                        </View>

                        {/* --- 2. AUTH CARD --- */}
                        <View style={[styles.authCard, { backgroundColor: colors.cardBg, borderColor: colors.border, shadowColor: colors.shadowColor }]}>

                            <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.accent, shadowColor: colors.accent }]} onPress={navigateToLogin}>
                                <ThemedText style={styles.loginButtonText}>Log In to Dashboard</ThemedText>
                            </TouchableOpacity>

                            <View style={styles.dividerContainer}>
                                <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
                                <ThemedText style={[styles.dividerText, { color: colors.textMuted }]}>or</ThemedText>
                                <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
                            </View>

                            <TouchableOpacity style={[styles.registerButton, { backgroundColor: colors.innerCardBg }]} onPress={navigateToRegister}>
                                <ThemedText style={[styles.registerButtonText, { color: colors.accent }]}>Create New Account</ThemedText>
                            </TouchableOpacity>
                        </View>

                        {/* --- 3. STATS ROW --- */}
                        <View style={[styles.statsRow, { backgroundColor: colors.cardBgAlt }]}>
                            <View style={styles.statItem}>
                                <ThemedText type="defaultSemiBold" style={[styles.statValue, { color: colors.textPrimary }]}>98%</ThemedText>
                                <ThemedText type="secondary" style={styles.statLabel}>Accuracy</ThemedText>
                            </View>
                            <View style={[styles.verticalDivider, { backgroundColor: colors.divider }]} />
                            <View style={styles.statItem}>
                                <ThemedText type="defaultSemiBold" style={[styles.statValue, { color: colors.textPrimary }]}>24/7</ThemedText>
                                <ThemedText type="secondary" style={styles.statLabel}>Monitoring</ThemedText>
                            </View>
                            <View style={[styles.verticalDivider, { backgroundColor: colors.divider }]} />
                            <View style={styles.statItem}>
                                <ThemedText type="defaultSemiBold" style={[styles.statValue, { color: colors.textPrimary }]}>10k+</ThemedText>
                                <ThemedText type="secondary" style={styles.statLabel}>Users</ThemedText>
                            </View>
                        </View>

                        {/* --- 4. FEATURES LIST --- */}
                        <View style={styles.featuresSection}>
                            <ThemedText type="subtitle" style={styles.featuresTitle}>Why HRV-4?</ThemedText>

                            <View style={[styles.featureCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                                <View style={[styles.iconBox, { backgroundColor: 'rgba(0,122,255,0.12)' }]}>
                                    <Ionicons name="heart" size={24} color="#007AFF" />
                                </View>
                                <View style={styles.featureTextContainer}>
                                    <ThemedText type="defaultSemiBold">What is HRV?</ThemedText>
                                    <ThemedText type="secondary" style={styles.featureDescription}>
                                        The #1 biomarker for stress and recovery. We decode your nervous system.
                                    </ThemedText>
                                </View>
                            </View>

                            <View style={[styles.featureCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                                <View style={[styles.iconBox, { backgroundColor: 'rgba(139,92,246,0.12)' }]}>
                                    <FontAwesome5 name="brain" size={24} color="#8b5cf6" />
                                </View>
                                <View style={styles.featureTextContainer}>
                                    <ThemedText type="defaultSemiBold">ML-Powered Analysis</ThemedText>
                                    <ThemedText type="secondary" style={styles.featureDescription}>
                                        Algorithms detect patterns hidden in the noise, predicting fatigue early.
                                    </ThemedText>
                                </View>
                            </View>

                            <View style={[styles.featureCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                                <View style={[styles.iconBox, { backgroundColor: 'rgba(16,185,129,0.12)' }]}>
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

    // HERO
    heroSection: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
    heroTitle: { textAlign: 'center', fontSize: 32, lineHeight: 40, marginBottom: 12 },
    heroSubtitle: { textAlign: 'center', fontSize: 16, lineHeight: 24, paddingHorizontal: 10 },

    // AUTH CARD
    authCard: {
        borderRadius: 16,
        padding: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 30,
        borderWidth: 1,
    },
    loginButton: {
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
    dividerLine: { flex: 1, height: 1 },
    dividerText: { marginHorizontal: 10, fontSize: 14 },
    registerButton: {
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerButtonText: { fontSize: 16, fontWeight: '600' },

    // STATS ROW
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 10,
        marginBottom: 30,
    },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 20, fontWeight: '700' },
    statLabel: { fontSize: 12 },
    verticalDivider: { width: 1, height: 30 },

    // FEATURES
    featuresSection: { gap: 16 },
    featuresTitle: { marginBottom: 10, fontSize: 22 },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
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