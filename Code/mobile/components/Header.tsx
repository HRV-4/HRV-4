import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';

type CustomHeaderProps = {
    title: string;
};

export default function CustomHeader({ title }: CustomHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();

    // Check if we are on a "Stack" page
    const isModalPage = pathname === '/profile' || pathname === '/faq';

    return (
        <ThemedView style={styles.headerContainer}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.headerContent}>

                    {/* 1. CENTER TITLE (Only for Profile/FAQ) */}
                    {/* We use absolute positioning to ensure it is perfectly centered */}
                    {isModalPage && (
                        <View style={styles.centeredTitleOverlay}>
                            <ThemedText type="subtitle" style={styles.headerTitle}>{title}</ThemedText>
                        </View>
                    )}

                    {/* 2. LEFT SIDE */}
                    <View style={styles.leftContainer}>
                        {isModalPage ? (
                            // STACK MODE: Arrow + "Back" Text
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={styles.backButton}
                            >
                                <Ionicons name="chevron-back" size={28} color={Colors.light.tint} />
                                <ThemedText style={styles.backText}>Back</ThemedText>
                            </TouchableOpacity>
                        ) : (
                            // DASHBOARD MODE: Title + Subtitle on the left
                            <View>
                                <ThemedText type="subtitle" style={styles.headerTitle}>{title}</ThemedText>
                            </View>
                        )}
                    </View>

                    {/* 3. RIGHT SIDE (Icons only for Dashboard/Main tabs) */}
                    <View style={styles.rightContainer}>
                        {!isModalPage && (
                            <View style={styles.iconRow}>
                                <TouchableOpacity onPress={() => router.push('/faq')} style={styles.iconButton}>
                                    <Ionicons name="help-circle-outline" size={26} color={Colors.light.tint} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => router.push('/profile')}>
                                    <Ionicons name="person-circle" size={36} color="#C7C7CC" />
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
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
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
    // Absolute positioning for the centered title
    centeredTitleOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 8,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1, // Ensures it doesn't block clicks on buttons
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
        marginLeft: -8, // Pulls the arrow slightly to the edge
    },
    backText: {
        color: Colors.light.tint, // Blue color
        fontSize: 17,
        marginLeft: -2, // Pulls text closer to arrow
    },
    headerTitle: {
        fontSize: 18, // Slightly smaller to fit "Back" button nicely
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