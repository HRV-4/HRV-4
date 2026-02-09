import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {Colors} from "@/constants/theme";

export default function FAQScreen() {
    const router = useRouter();

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>

            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    backButton: { flexDirection: 'row', alignItems: 'center', width: 60 },
    content: { padding: 24 },
    section: { marginTop: 20, padding: 20, backgroundColor: '#F2F2F7', borderRadius: 16 },
});