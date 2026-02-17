import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { API } from '@/api';

// ─── ICONS ───

function EditIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4C3.47 4 2.96 4.21 2.59 4.59C2.21 4.96 2 5.47 2 6V20C2 20.53 2.21 21.04 2.59 21.41C2.96 21.79 3.47 22 4 22H18C18.53 22 19.04 21.79 19.41 21.41C19.79 21.04 20 20.53 20 20V13"
        stroke="#5CB89A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.5C18.89 2.11 19.42 1.89 19.98 1.89C20.53 1.89 21.06 2.11 21.45 2.5C21.84 2.89 22.06 3.42 22.06 3.98C22.06 4.53 21.84 5.06 21.45 5.45L12 14.93L8 16L9.07 12L18.5 2.5Z"
        stroke="#5CB89A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function SettingsIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke="#434F4D" strokeWidth={1.8} />
      <Path
        d="M19.4 15C19.27 15.3 19.23 15.64 19.29 15.96C19.34 16.28 19.5 16.58 19.73 16.82L19.79 16.88C19.98 17.07 20.12 17.29 20.22 17.53C20.32 17.77 20.38 18.03 20.38 18.3C20.38 18.56 20.32 18.82 20.22 19.06C20.12 19.3 19.98 19.52 19.79 19.71C19.6 19.9 19.38 20.04 19.14 20.14C18.9 20.24 18.64 20.3 18.38 20.3C18.11 20.3 17.85 20.24 17.61 20.14C17.37 20.04 17.15 19.9 16.96 19.71L16.9 19.65C16.66 19.42 16.37 19.26 16.04 19.21C15.72 19.15 15.38 19.19 15.08 19.32C14.78 19.45 14.53 19.66 14.35 19.93C14.18 20.19 14.08 20.51 14.08 20.83V21C14.08 21.53 13.87 22.04 13.49 22.41C13.12 22.79 12.61 23 12.08 23C11.55 23 11.04 22.79 10.67 22.41C10.29 22.04 10.08 21.53 10.08 21V20.91C10.07 20.58 9.97 20.26 9.77 19.99C9.58 19.72 9.31 19.51 9 19.4C8.7 19.27 8.36 19.23 8.04 19.29C7.72 19.34 7.42 19.5 7.18 19.73L7.12 19.79C6.93 19.98 6.71 20.12 6.47 20.22C6.23 20.32 5.97 20.38 5.71 20.38C5.44 20.38 5.18 20.32 4.94 20.22C4.7 20.12 4.48 19.98 4.29 19.79C4.1 19.6 3.96 19.38 3.86 19.14C3.76 18.9 3.7 18.64 3.7 18.38C3.7 18.11 3.76 17.85 3.86 17.61C3.96 17.37 4.1 17.15 4.29 16.96L4.35 16.9C4.58 16.66 4.74 16.37 4.79 16.04C4.85 15.72 4.81 15.38 4.68 15.08C4.55 14.78 4.34 14.53 4.07 14.35C3.81 14.18 3.49 14.08 3.17 14.08H3C2.47 14.08 1.96 13.87 1.59 13.49C1.21 13.12 1 12.61 1 12.08C1 11.55 1.21 11.04 1.59 10.67C1.96 10.29 2.47 10.08 3 10.08H3.09C3.42 10.07 3.74 9.97 4.01 9.77C4.28 9.58 4.49 9.31 4.6 9C4.73 8.7 4.77 8.36 4.71 8.04C4.66 7.72 4.5 7.42 4.27 7.18L4.21 7.12C4.02 6.93 3.88 6.71 3.78 6.47C3.68 6.23 3.62 5.97 3.62 5.71C3.62 5.44 3.68 5.18 3.78 4.94C3.88 4.7 4.02 4.48 4.21 4.29C4.4 4.1 4.62 3.96 4.86 3.86C5.1 3.76 5.36 3.7 5.63 3.7C5.89 3.7 6.15 3.76 6.39 3.86C6.63 3.96 6.85 4.1 7.04 4.29L7.1 4.35C7.34 4.58 7.64 4.74 7.96 4.79C8.28 4.85 8.62 4.81 8.92 4.68H9C9.3 4.55 9.55 4.34 9.73 4.07C9.9 3.81 10 3.49 10 3.17V3C10 2.47 10.21 1.96 10.59 1.59C10.96 1.21 11.47 1 12 1C12.53 1 13.04 1.21 13.41 1.59C13.79 1.96 14 2.47 14 3V3.09C14 3.41 14.1 3.73 14.27 3.99C14.45 4.26 14.7 4.47 15 4.6C15.3 4.73 15.64 4.77 15.96 4.71C16.28 4.66 16.58 4.5 16.82 4.27L16.88 4.21C17.07 4.02 17.29 3.88 17.53 3.78C17.77 3.68 18.03 3.62 18.3 3.62C18.56 3.62 18.82 3.68 19.06 3.78C19.3 3.88 19.52 4.02 19.71 4.21C19.9 4.4 20.04 4.62 20.14 4.86C20.24 5.1 20.3 5.36 20.3 5.63C20.3 5.89 20.24 6.15 20.14 6.39C20.04 6.63 19.9 6.85 19.71 7.04L19.65 7.1C19.42 7.34 19.26 7.64 19.21 7.96C19.15 8.28 19.19 8.62 19.32 8.92V9C19.45 9.3 19.66 9.55 19.93 9.73C20.19 9.9 20.51 10 20.83 10H21C21.53 10 22.04 10.21 22.41 10.59C22.79 10.96 23 11.47 23 12C23 12.53 22.79 13.04 22.41 13.41C22.04 13.79 21.53 14 21 14H20.91C20.59 14 20.27 14.1 20.01 14.27C19.74 14.45 19.53 14.7 19.4 15Z"
        stroke="#434F4D" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function HelpIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#434F4D" strokeWidth={1.8} />
      <Path
        d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13"
        stroke="#434F4D" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      />
      <Circle cx="12" cy="17" r="0.5" fill="#434F4D" stroke="#434F4D" strokeWidth={0.5} />
    </Svg>
  );
}

function LogOutIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 21H5C4.47 21 3.96 20.79 3.59 20.41C3.21 20.04 3 19.53 3 19V5C3 4.47 3.21 3.96 3.59 3.59C3.96 3.21 4.47 3 5 3H9"
        stroke="#DC4545" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      />
      <Path d="M16 17L21 12L16 7" stroke="#DC4545" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M21 12H9" stroke="#DC4545" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function UserInfoIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="7" r="4" stroke="#5CB89A" strokeWidth={2} />
      <Path d="M4 21C4 17.134 7.582 14 12 14C16.418 14 20 17.134 20 21" stroke="#5CB89A" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function NoteIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 2H6C5.47 2 4.96 2.21 4.59 2.59C4.21 2.96 4 3.47 4 4V20C4 20.53 4.21 21.04 4.59 21.41C4.96 21.79 5.47 22 6 22H18C18.53 22 19.04 21.79 19.41 21.41C19.79 21.04 20 20.53 20 20V8L14 2Z"
        stroke="#5CB89A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      />
      <Path d="M14 2V8H20" stroke="#5CB89A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="8" y1="13" x2="16" y2="13" stroke="#5CB89A" strokeWidth={2} strokeLinecap="round" />
      <Line x1="8" y1="17" x2="12" y2="17" stroke="#5CB89A" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// ─── BACKEND HELPERS ───

async function getAuthData(): Promise<{ token: string; userId: string } | null> {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const userId = await AsyncStorage.getItem('userId');
    if (token && userId) return { token, userId };
    return null;
  } catch {
    return null;
  }
}

async function fetchUserProfile(token: string, userId: string) {
  try {
    const response = await fetch(API.userById(userId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

async function updateUserProfile(
  token: string,
  userId: string,
  data: { age?: number; gender?: string; clinicalStory?: string; notes?: string[] }
): Promise<boolean> {
  try {
    const response = await fetch(API.updateUser(userId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        age: data.age,
        gender: data.gender,
        clinicalStory: data.clinicalStory,
        notes: data.notes,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

// ─── MAIN SCREEN ───

export default function ProfileScreen() {
  const router = useRouter();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [authData, setAuthData] = useState<{ token: string; userId: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    clinicalStory: '',
    notes: '',
  });

  // ─── Load user profile from backend ───
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const auth = await getAuthData();
      if (!auth) {
        // No auth data - user not logged in, use defaults or redirect
        setFormData({
          name: 'User',
          age: '',
          gender: '',
          clinicalStory: '',
          notes: '',
        });
        setIsLoading(false);
        return;
      }

      setAuthData(auth);
      const profile = await fetchUserProfile(auth.token, auth.userId);
      
      if (profile) {
        setFormData({
          name: profile.name || profile.email?.split('@')[0] || 'User',
          age: profile.age ? String(profile.age) : '',
          gender: profile.gender || '',
          clinicalStory: profile.clinicalStory || '',
          notes: Array.isArray(profile.notes) ? profile.notes.join('\n') : (profile.notes || ''),
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Handle Logout ───
  const handleLogout = async () => {
    try {
      const auth = await getAuthData();
      if (auth) {
        // Call backend logout
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            await fetch(API.logout(), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`,
              },
              body: JSON.stringify(refreshToken),
            });
          } catch (e) {
            // Ignore backend logout errors
          }
        }
      }

      // Clear local storage
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userId']);
    } catch (error) {
      console.error('Logout error:', error);
    }

    router.replace('/');
  };

  // ─── Save Profile ───
  const handleSaveProfile = async () => {
    if (!authData) {
      Alert.alert('Not Logged In', 'Please log in to save your profile.');
      setModalVisible(false);
      return;
    }

    setIsSaving(true);

    const payload = {
      age: parseInt(formData.age) || undefined,
      gender: formData.gender || undefined,
      clinicalStory: formData.clinicalStory || undefined,
      notes: formData.notes ? formData.notes.split('\n').filter(n => n.trim()) : undefined,
    };

    const success = await updateUserProfile(authData.token, authData.userId, payload);

    setIsSaving(false);

    if (success) {
      setModalVisible(false);
      Alert.alert('Saved', 'Your profile has been updated successfully.');
    } else {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const infoTags = [
    formData.age ? `${formData.age} years` : null,
    formData.gender || null,
  ].filter(Boolean);

  if (isLoading) {
    return (
      <ScreenBackground style={styles.container}>
        <SafeAreaView edges={['top']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#5CB89A" />
          <ThemedText style={{ marginTop: 12, color: 'rgba(67,79,77,0.55)' }}>Loading profile...</ThemedText>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Profile Header Card ── */}
          <View style={styles.profileCard}>
            <View style={styles.profileTop}>
              <View style={styles.avatarOuter}>
                <View style={styles.avatarCircle}>
                  <ThemedText style={styles.avatarLetter}>
                    {(formData.name || 'U').charAt(0).toUpperCase()}
                  </ThemedText>
                </View>
                <View style={styles.onlineDot} />
              </View>

              <View style={styles.profileInfo}>
                <ThemedText style={styles.profileName}>{formData.name}</ThemedText>
                {infoTags.length > 0 && (
                  <View style={styles.tagsRow}>
                    {infoTags.map((tag, i) => (
                      <View key={i} style={styles.tag}>
                        <ThemedText style={styles.tagText}>{tag}</ThemedText>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.7}
            >
              <EditIcon />
              <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
            </TouchableOpacity>
          </View>

          {/* ── Health Details Card ── */}
          <View style={styles.detailsCard}>
            <ThemedText style={styles.sectionTitle}>Health Details</ThemedText>

            <View style={styles.detailRow}>
              <View style={styles.detailIconWrap}>
                <UserInfoIcon />
              </View>
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Clinical Story</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {formData.clinicalStory || '\u2014'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={styles.detailIconWrap}>
                <NoteIcon />
              </View>
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Notes</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {formData.notes
                    ? formData.notes.split('\n').join(' · ')
                    : '\u2014'}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* ── Menu Card ── */}
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => router.push('/settings')}
            >
              <View style={styles.menuIconWrap}>
                <SettingsIcon />
              </View>
              <ThemedText style={styles.menuLabel}>Settings</ThemedText>
              <Ionicons name="chevron-forward" size={18} color="rgba(67,79,77,0.3)" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => router.push('/faq')}
            >
              <View style={styles.menuIconWrap}>
                <HelpIcon />
              </View>
              <ThemedText style={styles.menuLabel}>Help & FAQ</ThemedText>
              <Ionicons name="chevron-forward" size={18} color="rgba(67,79,77,0.3)" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: 'rgba(220,69,69,0.07)' }]}>
                <LogOutIcon />
              </View>
              <ThemedText style={[styles.menuLabel, { color: '#DC4545' }]}>Log Out</ThemedText>
              <Ionicons name="chevron-forward" size={18} color="rgba(67,79,77,0.3)" />
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.versionText}>HRV-4</ThemedText>
        </ScrollView>
      </SafeAreaView>

      {/* ── EDIT PROFILE MODAL ── */}
      <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
        <ScreenBackground style={styles.modalContainer}>
          {/* Header Bar */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={8}>
              <ThemedText style={styles.modalCancel}>Cancel</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>Edit Profile</ThemedText>
            <TouchableOpacity onPress={handleSaveProfile} hitSlop={8} disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator size="small" color="#5CB89A" />
              ) : (
                <ThemedText style={styles.modalSave}>Save</ThemedText>
              )}
            </TouchableOpacity>
          </View>

          {/* Avatar Preview in Modal */}
          <View style={styles.modalAvatarSection}>
            <View style={styles.modalAvatar}>
              <ThemedText style={styles.modalAvatarLetter}>
                {(formData.name || 'U').charAt(0).toUpperCase()}
              </ThemedText>
            </View>
          </View>

          {/* Form */}
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <ThemedText style={styles.fieldLabel}>Name</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(t) => setFormData({ ...formData, name: t })}
              placeholder="Enter your name"
              placeholderTextColor="#A0ABA8"
            />

            <ThemedText style={styles.fieldLabel}>Age</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.age}
              onChangeText={(t) => setFormData({ ...formData, age: t })}
              keyboardType="numeric"
              placeholder="Enter your age"
              placeholderTextColor="#A0ABA8"
            />

            <ThemedText style={styles.fieldLabel}>Gender</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.gender}
              onChangeText={(t) => setFormData({ ...formData, gender: t })}
              placeholder="Male, Female, Other"
              placeholderTextColor="#A0ABA8"
            />

            <ThemedText style={styles.fieldLabel}>Clinical Story</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.clinicalStory}
              onChangeText={(t) => setFormData({ ...formData, clinicalStory: t })}
              placeholder="Any relevant medical history..."
              placeholderTextColor="#A0ABA8"
              multiline
              textAlignVertical="top"
            />

            <ThemedText style={styles.fieldLabel}>Notes</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(t) => setFormData({ ...formData, notes: t })}
              placeholder="Add notes here..."
              placeholderTextColor="#A0ABA8"
              multiline
              textAlignVertical="top"
            />
            <View style={{ height: 40 }} />
          </ScrollView>
        </ScreenBackground>
      </Modal>
    </ScreenBackground>
  );
}

// ─── STYLES ───

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 40, paddingTop: 8 },

  // ── Profile Header Card ──
  profileCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#3D4E4A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarOuter: {
    position: 'relative',
    marginRight: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D0EEEB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFF',
    shadowColor: '#3D4E4A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarLetter: {
    fontSize: 26,
    fontWeight: '600',
    color: '#3D6B5E',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#5CB89A',
    borderWidth: 2.5,
    borderColor: '#FAFAFA',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2E3B39',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(92,184,154,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#3D8B6E',
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(92,184,154,0.09)',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(92,184,154,0.18)',
    gap: 8,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5CB89A',
  },

  // ── Health Details Card ──
  detailsCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#3D4E4A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(92,184,154,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 15,
    color: '#434F4D',
    lineHeight: 21,
  },
  detailDivider: {
    height: 1,
    backgroundColor: 'rgba(67,79,77,0.06)',
    marginVertical: 14,
    marginLeft: 44,
  },

  // ── Menu Card ──
  menuCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#3D4E4A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(67,79,77,0.05)',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: 'rgba(208,238,235,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#434F4D',
  },

  // ── Version ──
  versionText: {
    textAlign: 'center',
    color: 'rgba(67,79,77,0.3)',
    fontSize: 12,
    marginTop: 24,
  },

  // ── Modal ── (using ScreenBackground for consistent theme)
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(67,79,77,0.1)',
  },
  modalTitle: { fontSize: 17, fontWeight: '600', color: '#434F4D' },
  modalCancel: { fontSize: 17, color: '#5CB89A' },
  modalSave: { fontSize: 17, fontWeight: '600', color: '#5CB89A' },
  modalAvatarSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D0EEEB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#3D4E4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  modalAvatarLetter: {
    fontSize: 32,
    fontWeight: '600',
    color: '#3D6B5E',
  },
  modalBody: { padding: 16 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: '#F2F2F2',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#434F4D',
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
});