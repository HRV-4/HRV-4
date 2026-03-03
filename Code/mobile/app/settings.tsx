import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Linking,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// import * as Notifications from 'expo-notifications';

import { ThemedText } from '@/components/themed-text';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { useTheme } from '@/context/ThemeContext';
import { API } from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── TYPE DEFINITIONS ───
type SettingItemProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isDestructive?: boolean;
  value?: boolean;
  onToggle?: (val: boolean) => void;
  onPress?: () => void;
};

// ─── SETTING ITEM COMPONENT ───
function SettingItem({
  label,
  icon,
  isDestructive,
  value,
  onToggle,
  onPress,
}: SettingItemProps) {
  const hasSwitch = typeof onToggle === 'function';
  const { isDark } = useTheme();

  const cardBg = isDark ? '#1C1C1E' : '#FAFAFA'; 
  const textColor = isDark ? '#FFFFFF' : '#434F4D';
  const iconBg = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(67,79,77,0.08)';
  const chevronColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(67,79,77,0.4)';

  return (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: cardBg }]}
      onPress={onPress}
      disabled={hasSwitch}
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconBox, { backgroundColor: iconBg }, isDestructive && styles.destructiveIconBox]}>
          <Ionicons
            name={icon}
            size={20}
            color={isDestructive ? '#DC4545' : textColor}
          />
        </View>
        <ThemedText style={[styles.itemLabel, { color: textColor }, isDestructive && styles.destructiveText]}>
          {label}
        </ThemedText>
      </View>

      {hasSwitch ? (
        <Switch
          value={!!value}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: '#5CB89A' }}
          thumbColor="#f4f3f4"
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={chevronColor} />
      )}
    </TouchableOpacity>
  );
}

// ─── API FUNCTIONS ───
async function changePassword(
  token: string, 
  userId: string, 
  oldPasswordText: string, 
  newPasswordText: string
): Promise<boolean> {
  try {
    const response = await fetch(API.changePassword(userId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        oldPassword: oldPasswordText, 
        newPassword: newPasswordText 
      }),
    });

    if (!response.ok) {
  const text = await response.text();
  console.log("TOKEN", token);
  console.log("CHANGE_PASSWORD_FAIL", response.status, text);
  Alert.alert("Operation Failed", text || "Could not change password.");
  return false;
}
    return true;

  } catch (error) {
    console.log('Network Error:', error);
    Alert.alert('Error', 'Could not reach the server. Please check your internet connection.');
    return false;
  }
  
}

async function deleteUser(token: string, userId: string){
  try{
    const response = await fetch(API.deleteUser(userId), {
      method: 'DELETE',
       headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting user profile:', error);
    return false;
  }
}

// ─── MAIN SCREEN ───
export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, themeMode, setThemeMode } = useTheme();

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [notifLoading, setNotifLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // ─── EFFECTS ───
  useEffect(() => {
    setNotifLoading(false);
  }, []);

  // ─── HANDLERS ───
  const handleNotificationToggle = async (enabled: boolean) => {
    Alert.alert(
      'Test Mode', 
      'Push notifications cannot be tested in Expo Go. They will work in the real app build.'
    );
    setIsNotificationsEnabled(false);
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setThemeMode(enabled ? 'dark' : 'light');
  };

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'Are you sure? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('accessToken');
            const userId = await AsyncStorage.getItem('userId');

            if (!token || !userId) {
              Alert.alert('Error', 'User session not found.');
              return;
            }

            const isDeleted = await deleteUser(token, userId);

            if (isDeleted) {
              await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userId', 'userName']);
              router.replace('/');
            } else {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          } catch (error) {
            console.error('Delete account flow error:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
          }
        },
      },
    ]);
  };

  const handleChangePasswordSubmit = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert('Warning', 'Please fill in both fields.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert('Error', 'User session not found.');
        setIsChangingPassword(false);
        return;
      }
      const isChanged = await changePassword(token, userId, oldPassword, newPassword);
      
      if (isChanged) {
        Alert.alert('Success', 'Your password has been changed successfully.');
        setPasswordModalVisible(false);
        setOldPassword('');
        setNewPassword('');
      }
    } catch (error) {
      console.error('Change password flow error:', error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const mainBg = isDark ? '#000000' : '#FFFFFF';
  const mainTextColor = isDark ? '#FFFFFF' : '#434F4D';
  const sectionCardBg = isDark ? '#1C1C1E' : '#FAFAFA';
  const sectionTitleColor = isDark ? '#8E8E93' : '#8E8E93';
  const separatorColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  const inputBg = isDark ? '#2C2C2E' : '#F2F2F2';

  return (
    <View style={[styles.container, { backgroundColor: mainBg }]}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={mainTextColor} />
          </TouchableOpacity>
          <ThemedText style={[styles.title, { color: mainTextColor }]}>Settings</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Preferences */}
          <ThemedText style={[styles.sectionTitle, { color: sectionTitleColor }]}>PREFERENCES</ThemedText>
          <View style={[styles.sectionCard, { backgroundColor: sectionCardBg }]}>
            <SettingItem
              label="Push Notifications"
              icon="notifications-outline"
              value={isNotificationsEnabled}
              onToggle={handleNotificationToggle}
            />
            <View style={[styles.separator, { backgroundColor: separatorColor }]} />
            <SettingItem
              label="Dark Mode"
              icon="moon-outline"
              value={isDark}
              onToggle={handleDarkModeToggle}
            />
          </View>

          {/* Support */}
          <ThemedText style={[styles.sectionTitle, { color: sectionTitleColor }]}>SUPPORT</ThemedText>
          <View style={[styles.sectionCard, { backgroundColor: sectionCardBg }]}>
            <SettingItem
              label="Privacy Policy"
              icon="lock-closed-outline"
              onPress={() => console.log('Open Webview')}
            />
            <View style={[styles.separator, { backgroundColor: separatorColor }]} />
            <SettingItem
              label="Terms of Service"
              icon="document-text-outline"
              onPress={() => console.log('Open Webview')}
            />
          </View>

          {/* Account */}
          <ThemedText style={[styles.sectionTitle, { color: sectionTitleColor }]}>ACCOUNT</ThemedText>
          <View style={[styles.sectionCard, { backgroundColor: sectionCardBg }]}>
            <SettingItem
              label="Change Password"
              icon="key-outline"
              onPress={() => setPasswordModalVisible(true)} 
            />
            <View style={[styles.separator, { backgroundColor: separatorColor }]} />
            <SettingItem
              label="Delete Account"
              icon="trash-outline"
              isDestructive
              onPress={handleDeleteAccount}
            />
          </View>

          <ThemedText style={styles.version}>App Version 1.0.0</ThemedText>
        </ScrollView>
      </SafeAreaView>

      {/* ─── CHANGE PASSWORD MODAL ─── */}
      <Modal visible={isPasswordModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.container, { backgroundColor: mainBg }]}>
          <View style={[styles.modalHeader, { borderBottomColor: separatorColor }]}>
            <TouchableOpacity onPress={() => setPasswordModalVisible(false)} hitSlop={8}>
              <ThemedText style={styles.modalCancel}>Cancel</ThemedText>
            </TouchableOpacity>
            <ThemedText style={[styles.modalTitle, { color: mainTextColor }]}>Change Password</ThemedText>
            <TouchableOpacity onPress={handleChangePasswordSubmit} hitSlop={8} disabled={isChangingPassword}>
              {isChangingPassword ? (
                <ActivityIndicator size="small" color="#5CB89A" />
              ) : (
                <ThemedText style={styles.modalSave}>Save</ThemedText>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <ThemedText style={[styles.fieldLabel, { color: sectionTitleColor }]}>Old Password</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, color: mainTextColor }]}
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Enter current password"
              placeholderTextColor="#A0ABA8"
              secureTextEntry
            />

            <ThemedText style={[styles.fieldLabel, { color: sectionTitleColor }]}>New Password</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, color: mainTextColor }]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              placeholderTextColor="#A0ABA8"
              secureTextEntry
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// ─── STYLES ───
const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontSize: 18, fontWeight: '600' },
  backButton: { padding: 4 },

  content: { padding: 16 },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 8,
    marginTop: 16,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },

  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIconBox: { backgroundColor: 'rgba(220,69,69,0.1)' },

  itemLabel: { fontSize: 16 },
  destructiveText: { color: '#DC4545' },

  separator: {
    height: 1,
    marginLeft: 60,
  },

  version: { textAlign: 'center', marginTop: 30, color: '#aaa', fontSize: 12 },
  
  // Modal Styles
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  modalTitle: { fontSize: 17, fontWeight: '600' },
  modalCancel: { fontSize: 17, color: '#5CB89A' },
  modalSave: { fontSize: 17, fontWeight: '600', color: '#5CB89A' },
  modalBody: { padding: 16 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
});