import React, { useState } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView,
    Modal,
    TextInput,
    useColorScheme
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // --- STATE MANAGEMENT ---
    const [isModalVisible, setModalVisible] = useState(false);

    // Form State (Mock Data)
    const [formData, setFormData] = useState({
        age: '25',
        gender: 'Female',
        clinicalStory: 'None',
        notes: 'Regular exercise.\nLow caffeine intake.'
    });

    // --- HANDLERS ---
    const handleLogout = () => {
        router.replace('/');
    };

    const handleSaveProfile = () => {
        const payload = {
            age: parseInt(formData.age) || 0,
            gender: formData.gender,
            clinicalStory: formData.clinicalStory,
            notes: formData.notes.split('\n'),
        };
        console.log("Saving UserUpdateDto:", payload);
        setModalVisible(false);
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* 1. USER INFO CARD */}
                    <View style={styles.headerCard}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Ionicons name="person" size={48} color="#fff" />
                            </View>
                            <View style={styles.editBadge}>
                                <Ionicons name="camera" size={14} color="#fff" />
                            </View>
                        </View>
                        <ThemedText type="subtitle" style={styles.userName}>User Name</ThemedText>
                        <ThemedText type="secondary" style={styles.userEmail}>user@example.com</ThemedText>
                    </View>

                    {/* 2. MENU OPTIONS */}
                    <View style={styles.sectionCard}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => setModalVisible(true)}>
                            <View style={[styles.menuIconBg, { backgroundColor: '#E0F2FE' }]}>
                                <Ionicons name="person-circle" size={24} color="#007AFF" />
                            </View>
                            <View style={styles.menuContent}>
                                <ThemedText style={styles.menuText}>Update Profile</ThemedText>
                                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.separator} />

                        <TouchableOpacity style={styles.menuItem}>
                            <View style={[styles.menuIconBg, { backgroundColor: '#F2F2F7' }]}>
                                <Ionicons name="settings-sharp" size={22} color="#8E8E93" />
                            </View>
                            <View style={styles.menuContent}>
                                <ThemedText style={styles.menuText}>Account Settings</ThemedText>
                                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* 3. LOGOUT BUTTON */}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <ThemedText style={styles.logoutText}>Log Out</ThemedText>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>

            {/* --- UPDATE PROFILE MODAL (PageSheet Style) --- */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                presentationStyle="pageSheet" // <--- Native iOS Card Look
            >
                <View style={[styles.modalContainer, { backgroundColor: isDark ? '#000' : '#F2F2F7' }]}>

                    {/* Header Bar */}
                    <View style={[styles.modalHeader, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <ThemedText style={styles.modalCancel}>Cancel</ThemedText>
                        </TouchableOpacity>

                        <ThemedText style={styles.modalTitle}>Edit Profile</ThemedText>

                        <TouchableOpacity onPress={handleSaveProfile}>
                            <ThemedText style={styles.modalSave}>Save</ThemedText>
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView style={styles.modalBody}>

                        {/* Age Input */}
                        <ThemedText style={styles.fieldLabel}>Age</ThemedText>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#1C1C1E' : '#FFF', color: isDark ? '#FFF' : '#000' }]}
                            value={formData.age}
                            onChangeText={(text) => setFormData({...formData, age: text})}
                            keyboardType="numeric"
                            placeholder="Enter your age"
                            placeholderTextColor="#8E8E93"
                        />

                        {/* Gender Input */}
                        <ThemedText style={styles.fieldLabel}>Gender</ThemedText>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#1C1C1E' : '#FFF', color: isDark ? '#FFF' : '#000' }]}
                            value={formData.gender}
                            onChangeText={(text) => setFormData({...formData, gender: text})}
                            placeholder="Male, Female, Other"
                            placeholderTextColor="#8E8E93"
                        />

                        {/* Clinical Story Input */}
                        <ThemedText style={styles.fieldLabel}>Clinical Story</ThemedText>
                        <TextInput
                            style={[styles.input, styles.textArea, { backgroundColor: isDark ? '#1C1C1E' : '#FFF', color: isDark ? '#FFF' : '#000' }]}
                            value={formData.clinicalStory}
                            onChangeText={(text) => setFormData({...formData, clinicalStory: text})}
                            placeholder="Any relevant medical history..."
                            placeholderTextColor="#8E8E93"
                            multiline
                            textAlignVertical="top"
                        />

                        {/* Notes Input */}
                        <ThemedText style={styles.fieldLabel}>Notes</ThemedText>
                        <ThemedText type="secondary" style={styles.helperText}>
                            Add separate multiple notes with new lines.
                        </ThemedText>
                        <TextInput
                            style={[styles.input, styles.textArea, { backgroundColor: isDark ? '#1C1C1E' : '#FFF', color: isDark ? '#FFF' : '#000' }]}
                            value={formData.notes}
                            onChangeText={(text) => setFormData({...formData, notes: text})}
                            placeholder="Add notes here..."
                            placeholderTextColor="#8E8E93"
                            multiline
                            textAlignVertical="top"
                        />

                        {/* Extra space for scrolling */}
                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            </Modal>

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    safeArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },

    // --- CARDS & BUTTONS ---
    headerCard: { backgroundColor: '#fff', borderRadius: 20, paddingVertical: 30, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
    avatarContainer: { position: 'relative', marginBottom: 16 },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#D1D1D6', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#F9F9F9' },
    editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#007AFF', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
    userName: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
    userEmail: { fontSize: 14, color: '#8E8E93' },
    sectionCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#fff' },
    menuIconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    menuContent: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    menuText: { fontSize: 16, fontWeight: '500', color: '#1C1C1E' },
    separator: { height: 1, backgroundColor: '#F2F2F7', marginLeft: 72 },
    logoutButton: { backgroundColor: '#FEF2F2', borderRadius: 12, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#FECACA' },
    logoutText: { color: '#DC2626', fontWeight: '600', fontSize: 16 },
    versionText: { textAlign: 'center', color: '#C7C7CC', fontSize: 12, marginTop: 20 },

    // --- NEW MODAL STYLES (Matching Activity Modal) ---
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#C7C7CC',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    modalCancel: {
        fontSize: 17,
        color: '#007AFF',
    },
    modalSave: {
        fontSize: 17,
        fontWeight: '600',
        color: '#007AFF',
    },
    modalBody: {
        padding: 16,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        marginTop: 16,
        color: '#8E8E93',
        textTransform: 'uppercase',
    },
    helperText: {
        fontSize: 12,
        marginBottom: 8,
        marginTop: -4,
    },
    input: {
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
});