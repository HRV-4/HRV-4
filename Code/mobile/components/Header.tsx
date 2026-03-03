import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppColors } from '@/hooks/use-app-colors';

type CustomHeaderProps = {
    title: string;
};

export default function CustomHeader({ title }: CustomHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const colors = useAppColors();

    const isModalPage = pathname === '/profile' || pathname === '/faq';

    return (
        <ThemedView style={[styles.headerContainer, { borderBottomColor: colors.border }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.headerContent}>

                    {isModalPage && (
                        <View style={styles.centeredTitleOverlay}>
                            <ThemedText type="subtitle" style={[styles.headerTitle, { color: colors.textPrimary }]}>{title}</ThemedText>
                        </View>
                    )}

                    <View style={styles.leftContainer}>
                        {isModalPage ? (
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={styles.backButton}
                            >
                                <Ionicons name="chevron-back" size={28} color={colors.accent} />
                                <ThemedText style={[styles.backText, { color: colors.accent }]}>Back</ThemedText>
                            </TouchableOpacity>
                        ) : (
                            <View>
                                <ThemedText type="subtitle" style={[styles.headerTitle, { color: colors.textPrimary }]}>{title}</ThemedText>
                            </View>
                        )}
                    </View>

                    <View style={styles.rightContainer}>
                        {!isModalPage && (
                            <View style={styles.iconRow}>
                                <TouchableOpacity onPress={() => router.push('/faq')} style={styles.iconButton}>
                                    <Ionicons name="help-circle-outline" size={26} color={colors.accent} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => router.push('/profile')}>
                                    <Ionicons name="person-circle" size={36} color={colors.textMuted} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                </View>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        borderBottomWidth: 1,
    },
    safeArea: {
        paddingBottom: 12,
        paddingHorizontal: 16,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        minHeight: 44,
    },
    centeredTitleOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 8,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    leftContainer: {
        justifyContent: 'center',
        flex: 1,
        zIndex: 1,
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
        zIndex: 1,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -8,
    },
    backText: {
        fontSize: 17,
        marginLeft: -2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        padding: 4,
    }
});