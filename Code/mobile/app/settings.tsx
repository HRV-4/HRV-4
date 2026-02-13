import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ScreenBackground } from '@/components/ui/ScreenBackground';

// TYPE DEFINITIONS
type SettingItemProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isDestructive?: boolean;

  // Switch’li satırlar için
  value?: boolean;
  onToggle?: (val: boolean) => void;

  // Ok’lu satırlar için
  onPress?: () => void;
};

function SettingItem({
  label,
  icon,
  isDestructive,
  value,
  onToggle,
  onPress,
}: SettingItemProps) {
  const hasSwitch = typeof onToggle === 'function';

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      disabled={hasSwitch} // switch varsa satır press'i kapat
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconBox, isDestructive && styles.destructiveIconBox]}>
          <Ionicons
            name={icon}
            size={20}
            color={isDestructive ? '#DC4545' : '#434F4D'}
          />
        </View>

        <ThemedText style={[styles.itemLabel, isDestructive && styles.destructiveText]}>
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
        <Ionicons name="chevron-forward" size={18} color="rgba(67,79,77,0.4)" />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isSystemDark = colorScheme === 'dark';

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(isSystemDark);

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'Are you sure? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          console.log('Hesap siliniyor...');
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <ScreenBackground style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#434F4D" />
          </TouchableOpacity>

          <ThemedText style={styles.title}>Settings</ThemedText>

          {/* Başlığı ortalamak için boşluk */}
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Preferences */}
          <ThemedText style={styles.sectionTitle}>PREFERENCES</ThemedText>
          <View style={styles.sectionCard}>
            <SettingItem
              label="Push Notifications"
              icon="notifications-outline"
              value={isNotificationsEnabled}
              onToggle={setIsNotificationsEnabled}
            />
            <View style={styles.separator} />
            <SettingItem
              label="Dark Mode"
              icon="moon-outline"
              value={isDarkMode}
              onToggle={setIsDarkMode}
            />
          </View>

          {/* Support */}
          <ThemedText style={styles.sectionTitle}>SUPPORT</ThemedText>
          <View style={styles.sectionCard}>
            <SettingItem
              label="Privacy Policy"
              icon="lock-closed-outline"
              onPress={() => console.log('Open Webview')}
            />
            <View style={styles.separator} />
            <SettingItem
              label="Terms of Service"
              icon="document-text-outline"
              onPress={() => console.log('Open Webview')}
            />
          </View>

          {/* Account */}
          <ThemedText style={styles.sectionTitle}>ACCOUNT</ThemedText>
          <View style={styles.sectionCard}>
            <SettingItem
              label="Change Password"
              icon="key-outline"
              onPress={() => console.log('Navigate to Change Password')}
            />
            <View style={styles.separator} />
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
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontSize: 18, fontWeight: '600', color: '#434F4D' },
  backButton: { padding: 4 },

  content: { padding: 16 },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    marginLeft: 8,
    marginTop: 16,
  },
  sectionCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    overflow: 'hidden',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },

  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(67,79,77,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIconBox: { backgroundColor: 'rgba(220,69,69,0.1)' },

  itemLabel: { fontSize: 16, color: '#434F4D' },
  destructiveText: { color: '#DC4545' },

  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 60,
  },

  version: { textAlign: 'center', marginTop: 30, color: '#aaa', fontSize: 12 },
});
