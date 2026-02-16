import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { PageHeader } from '@/components/ui/PageHeader';
import { API } from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// ─── CONSTANTS & TYPES ───

const ACTIVITY_CATEGORIES = [
  { id: 'public_transportation', name: 'Public Transport', icon: 'bus-outline', color: '#7B9FE0' },
  { id: 'drive', name: 'Drive', icon: 'car-outline', color: '#A0ABA8' },
  { id: 'rest', name: 'Rest', icon: 'bed-outline', color: '#B8A9E0' },
  { id: 'eat_drink', name: 'Eat/Drink', icon: 'restaurant-outline', color: '#E3C937' },
  { id: 'manual_work', name: 'Manual Work', icon: 'hammer-outline', color: '#FF8A5C' },
  { id: 'sleep', name: 'Sleep', icon: 'moon-outline', color: '#7B9FE0' },
  { id: 'personal_hygiene', name: 'Personal Hygiene', icon: 'water-outline', color: '#90E2DA' },
  { id: 'exercise', name: 'Exercise', icon: 'flame-outline', color: '#FF6B6B' },
  { id: 'communication', name: 'Communication', icon: 'chatbubble-outline', color: '#5CB89A' },
  { id: 'other', name: 'Other Activities', icon: 'ellipsis-horizontal-outline', color: '#A0ABA8' },
];

interface Activity {
  id: string;
  date: string;
  time: string;
  type: string;
  category: string;
  durationMin: number;
  intensity: string;
  calories?: number;
  note: string;
  synced?: boolean; // Whether this activity has been saved to backend
}

const SEED_ACTIVITIES: Activity[] = [
  { id: '1', date: new Date().toISOString().split('T')[0], time: '08:30', type: 'Morning Run', category: 'exercise', durationMin: 32, intensity: 'Vigorous', calories: 320, note: '5K around the park', synced: true },
  { id: '2', date: new Date().toISOString().split('T')[0], time: '12:00', type: 'Meditation', category: 'rest', durationMin: 15, intensity: 'Light', note: 'Guided breathing', synced: true },
  { id: '3', date: new Date().toISOString().split('T')[0], time: '22:30', type: 'Sleep', category: 'sleep', durationMin: 440, intensity: 'Rest', note: '7h 20m total', synced: true },
  { id: '4', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], time: '06:00', type: 'Yoga Flow', category: 'exercise', durationMin: 45, intensity: 'Moderate', calories: 150, note: '', synced: true },
  { id: '5', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], time: '20:00', type: 'Evening Walk', category: 'exercise', durationMin: 30, intensity: 'Light', calories: 120, note: '', synced: true },
];

// ─── HELPER FUNCTIONS ───

function getCategoryInfo(catId: string) {
  return ACTIVITY_CATEGORIES.find(c => c.id === catId) || ACTIVITY_CATEGORIES[ACTIVITY_CATEGORIES.length - 1];
}

function formatDuration(min: number) {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${min} min`;
}

function formatDate(dateStr: string) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── BACKEND SERVICE ───

async function getAuthToken(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem('accessToken');
    if (!raw) return null;

    // Login stores the full JSON response: {"accessToken":"eyJ...","refreshToken":"..."}
    // We need to extract just the JWT
    if (raw.startsWith('{')) {
      try {
        const parsed = JSON.parse(raw);
        return parsed.accessToken || parsed.access_token || parsed.token || raw;
      } catch {
        return raw;
      }
    }
    return raw;
  } catch {
    return null;
  }
}

async function getUserId(): Promise<string | null> {
  try {
    // First check if userId is stored separately
    const stored = await AsyncStorage.getItem('userId');
    if (stored) return stored;

    // Otherwise try to extract from login response
    const raw = await AsyncStorage.getItem('accessToken');
    if (raw && raw.startsWith('{')) {
      try {
        const parsed = JSON.parse(raw);
        return parsed.userId || parsed.user_id || parsed.id || null;
      } catch {
        return null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function saveActivityToBackend(activity: Activity): Promise<boolean> {
  try {
    const token = await getAuthToken();
    const userId = await getUserId();
    if (!token) {
      console.warn('No auth token found, saving locally only');
      return false;
    }

    // DEBUG — remove after fixing
    console.log('DEBUG token (first 80 chars):', token.substring(0, 80));
    console.log('DEBUG token starts with {?:', token.startsWith('{'));
    console.log('DEBUG userId:', userId);

    const response = await fetch(API.activities(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        // Required
        name: activity.type,
        category: activity.category,
        durationMin: activity.durationMin,
        // Optional - send null if empty
        intensity: activity.intensity || null,
        calories: activity.calories || null,
        note: activity.note || null,
        date: activity.date || null,
        time: activity.time || null,
        userId: userId || null,
      }),
    });

    if (response.ok) {
      return true;
    } else {
      console.error('Failed to save activity:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error saving activity to backend:', error);
    return false;
  }
}

async function fetchActivitiesFromBackend(): Promise<Activity[] | null> {
  try {
    const token = await getAuthToken();
    const userId = await AsyncStorage.getItem('userId');
    if (!token || !userId) return null;

    const response = await fetch(API.activitiesByUser(userId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.map((item: any) => ({
        id: item.measurementId || item.id || String(Date.now()),
        date: item.date || new Date().toISOString().split('T')[0],
        time: item.time || '00:00',
        type: item.name || item.type || 'Unknown',
        category: item.category || 'other',
        durationMin: item.durationMin || 0,
        intensity: item.intensity || 'Moderate',
        calories: item.calories || 0,
        note: item.note || '',
        synced: true,
      }));
    }
    return null;
  } catch (error) {
    console.error('Error fetching activities:', error);
    return null;
  }
}

// ─── SUB-COMPONENTS ───

function TodaySummaryCard({ activities }: { activities: Activity[] }) {
  const today = activities.filter(a => a.date === new Date().toISOString().split('T')[0]);
  const totalMin = today.reduce((s, a) => s + a.durationMin, 0);
  const totalCal = today.reduce((s, a) => s + (a.calories || 0), 0);

  return (
    <View style={styles.summaryCard}>
      <ThemedText style={styles.cardTitle}>Today{'\u2019'}s Summary</ThemedText>
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryValue}>{today.length}</ThemedText>
          <ThemedText style={styles.summaryLabel}>Activities</ThemedText>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryValue}>{formatDuration(totalMin)}</ThemedText>
          <ThemedText style={styles.summaryLabel}>Total Time</ThemedText>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryValue}>{totalCal}</ThemedText>
          <ThemedText style={styles.summaryLabel}>Calories</ThemedText>
        </View>
      </View>
    </View>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const cat = getCategoryInfo(activity.category);
  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: `${cat.color}18` }]}>
        <Ionicons name={cat.icon as any} size={22} color={cat.color} />
      </View>
      <View style={styles.activityInfo}>
        <ThemedText style={styles.activityType}>{activity.type}</ThemedText>
        <ThemedText style={styles.activityMeta}>
          {activity.time} · {formatDuration(activity.durationMin)}
          {activity.calories ? ` · ${activity.calories} cal` : ''}
        </ThemedText>
      </View>
      <View style={styles.activityRight}>
        <View style={[styles.intensityBadge, { backgroundColor: `${cat.color}18` }]}>
          <ThemedText style={[styles.intensityText, { color: cat.color }]}>{activity.intensity}</ThemedText>
        </View>
        {activity.synced === false && (
          <Ionicons name="cloud-offline-outline" size={14} color="rgba(67,79,77,0.3)" style={{ marginTop: 4 }} />
        )}
      </View>
    </View>
  );
}

// ─── MAIN COMPONENT ───

export default function ActivitiesScreen() {
  const params = useLocalSearchParams<{ preselectedCategory?: string; openModal?: string }>();
  
  const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [form, setForm] = useState({ 
    type: '', 
    category: 'exercise', 
    durationMin: '', 
    calories: '', 
    note: '' 
  });

  // Handle deep link from Insights Quick Actions
  useEffect(() => {
    if (params.openModal === 'true' && params.preselectedCategory) {
      setForm(prev => ({ ...prev, category: params.preselectedCategory! }));
      setShowModal(true);
    }
  }, [params.openModal, params.preselectedCategory]);

  // Fetch activities from backend on mount
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const backendActivities = await fetchActivitiesFromBackend();
      if (backendActivities && backendActivities.length > 0) {
        setActivities(backendActivities);
      }
      // If backend fails, keep seed data
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save new activity
  const handleSave = async () => {
    if (!form.type.trim()) {
      Alert.alert("Missing Info", "Please enter an activity name.");
      return;
    }

    const duration = parseInt(form.durationMin) || 0;
    if (duration <= 0) {
      Alert.alert("Missing Info", "Please enter a valid duration.");
      return;
    }

    const calories = parseInt(form.calories) || 0;

    // Intensity logic
    let calculatedIntensity = 'Moderate';

    if (duration > 0) {
      const cpm = calories / duration;
      
      if (form.category === 'sleep' || form.category === 'rest' || form.category === 'personal_hygiene') {
        calculatedIntensity = 'Light'; 
      } else if (form.category === 'exercise' || form.category === 'manual_work') {
        if (cpm < 4) calculatedIntensity = 'Light';
        else if (cpm < 9) calculatedIntensity = 'Moderate';
        else calculatedIntensity = 'Vigorous';
      } else {
        calculatedIntensity = 'Light';
      }
    }

    const now = new Date();
    const newActivity: Activity = {
      id: String(Date.now()),
      date: now.toISOString().split('T')[0], 
      time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), 
      type: form.type,
      category: form.category,
      durationMin: duration, 
      intensity: calculatedIntensity,
      calories: calories, 
      note: form.note,
      synced: false,
    };

    // Optimistic update - add to UI immediately
    setActivities(prev => [newActivity, ...prev]);
    setForm({ type: '', category: 'exercise', durationMin: '', calories: '', note: '' });
    setShowModal(false);

    // Save to backend
    setIsSaving(true);
    try {
      const success = await saveActivityToBackend(newActivity);
      if (success) {
        // Mark as synced
        setActivities(prev => 
          prev.map(a => a.id === newActivity.id ? { ...a, synced: true } : a)
        );
      } else {
        // Keep activity locally but show it's not synced
        console.warn('Activity saved locally only');
      }
    } catch (error) {
      console.error('Backend save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Group activities by date
  const grouped = useMemo(() => {
    const map: Record<string, Activity[]> = {};
    [...activities]
      .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
      .forEach(a => { if (!map[a.date]) map[a.date] = []; map[a.date].push(a); });
    return Object.entries(map);
  }, [activities]);

  return (
    <ScreenBackground style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <PageHeader title="Activities" variant="default" />
        
        {isLoading && (
          <View style={styles.loadingBar}>
            <ActivityIndicator size="small" color="#5CB89A" />
            <ThemedText style={styles.loadingText}>Loading activities...</ThemedText>
          </View>
        )}

        <TodaySummaryCard activities={activities} />

        {/* Categories */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Categories</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
            {ACTIVITY_CATEGORIES.map(cat => (
              <View key={cat.id} style={styles.catChip}>
                <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                <ThemedText style={styles.catChipText}>{cat.name}</ThemedText>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Activity Log */}
        <View style={styles.card}>
          <View style={styles.listHeader}>
            <ThemedText style={styles.cardTitle}>Activity Log</ThemedText>
            <View style={styles.listHeaderRight}>
              {isSaving && <ActivityIndicator size="small" color="#5CB89A" style={{ marginRight: 8 }} />}
              <TouchableOpacity onPress={() => setShowModal(true)}>
                <Ionicons name="add-circle" size={28} color="#5CB89A" />
              </TouchableOpacity>
            </View>
          </View>
          {grouped.map(([date, items]) => (
            <View key={date} style={styles.dateGroup}>
              <ThemedText style={styles.dateHeader}>{formatDate(date)}</ThemedText>
              {items.map(item => <ActivityItem key={item.id} activity={item} />)}
            </View>
          ))}
        </View>
      </ScrollView>
      </SafeAreaView>

      {/* ─── Add Modal ─── */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <ScreenBackground style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <ThemedText style={styles.modalAction}>Cancel</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.modalTitleText}>New Activity</ThemedText>
              <TouchableOpacity onPress={handleSave} disabled={isSaving}>
                <ThemedText style={[styles.modalAction, { fontWeight: '600', opacity: isSaving ? 0.5 : 1 }]}>
                  {isSaving ? 'Saving...' : 'Save'}
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
              
              {/* Category Select */}
              <ThemedText style={styles.fieldLabel}>Category</ThemedText>
              <View style={styles.catGrid}>
                {ACTIVITY_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catOption, form.category === cat.id && { borderColor: cat.color, borderWidth: 2 }]}
                    onPress={() => setForm(p => ({ ...p, category: cat.id }))}
                  >
                    <View style={[styles.catIconBox, { backgroundColor: `${cat.color}18` }]}>
                      <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                    </View>
                    <ThemedText style={styles.catName} numberOfLines={2}>{cat.name}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Name Input */}
              <ThemedText style={styles.fieldLabel}>Activity Name</ThemedText>
              <TextInput 
                style={styles.mInput} 
                placeholder="e.g., Morning Run" 
                placeholderTextColor="#A0ABA8" 
                value={form.type} 
                onChangeText={t => setForm(p => ({ ...p, type: t }))} 
              />

              {/* Duration & Calories */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.fieldLabel}>Duration (min)</ThemedText>
                  <TextInput 
                    style={styles.mInput} 
                    placeholder="30" 
                    placeholderTextColor="#A0ABA8" 
                    keyboardType="number-pad" 
                    value={form.durationMin} 
                    onChangeText={t => setForm(p => ({ ...p, durationMin: t }))} 
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.fieldLabel}>Calories</ThemedText>
                  <TextInput 
                    style={styles.mInput} 
                    placeholder="0" 
                    placeholderTextColor="#A0ABA8" 
                    keyboardType="number-pad" 
                    value={form.calories} 
                    onChangeText={t => setForm(p => ({ ...p, calories: t }))} 
                  />
                </View>
              </View>

              {/* Notes */}
              <ThemedText style={styles.fieldLabel}>Notes</ThemedText>
              <TextInput 
                style={[styles.mInput, { minHeight: 90, textAlignVertical: 'top' }]} 
                placeholder="How did it go?" 
                placeholderTextColor="#A0ABA8" 
                multiline 
                numberOfLines={4} 
                value={form.note} 
                onChangeText={t => setForm(p => ({ ...p, note: t }))} 
              />
              
              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        </ScreenBackground>
      </Modal>
    </ScreenBackground>
  );
}

// ─── STYLES ───

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 40 },

  loadingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
    marginBottom: 8,
  },
  loadingText: { fontSize: 13, color: 'rgba(67,79,77,0.55)' },

  summaryCard: {
    backgroundColor: '#FCFCFC', borderRadius: 20, padding: 18, marginBottom: 16,
    shadowColor: '#3D4E4A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#434F4D', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: 20, fontWeight: '700', color: '#434F4D' },
  summaryLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(67,79,77,0.55)', marginTop: 4 },
  summaryDivider: { width: 1, height: 36, backgroundColor: 'rgba(67,79,77,0.1)' },

  card: {
    backgroundColor: '#FCFCFC', borderRadius: 20, padding: 18, marginBottom: 16,
    shadowColor: '#3D4E4A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  catRow: { gap: 10 },
  catChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F2', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8, gap: 8 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catChipText: { fontSize: 13, fontWeight: '600', color: '#434F4D' },

  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  listHeaderRight: { flexDirection: 'row', alignItems: 'center' },
  dateGroup: { marginBottom: 14 },
  dateHeader: { fontSize: 14, fontWeight: '600', color: 'rgba(67,79,77,0.55)', marginBottom: 10, marginTop: 4 },
  activityItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 14, padding: 14, marginBottom: 8, gap: 12 },
  activityIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  activityInfo: { flex: 1 },
  activityType: { fontSize: 15, fontWeight: '600', color: '#434F4D' },
  activityMeta: { fontSize: 12, fontWeight: '500', color: 'rgba(67,79,77,0.55)', marginTop: 3 },
  activityRight: { alignItems: 'center' },
  intensityBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  intensityText: { fontSize: 11, fontWeight: '600' },

  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(67,79,77,0.1)' },
  modalAction: { fontSize: 17, color: '#5CB89A' },
  modalTitleText: { fontSize: 17, fontWeight: '600', color: '#434F4D' },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(67,79,77,0.55)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catOption: { width: (width - 80) / 3, padding: 10, borderRadius: 16, alignItems: 'center', backgroundColor: '#F2F2F2', borderWidth: 1, borderColor: 'transparent' },
  catIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  catName: { fontSize: 11, fontWeight: '600', color: '#434F4D', textAlign: 'center' },
  mInput: { backgroundColor: '#F2F2F2', borderRadius: 14, paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 14 : 12, fontSize: 16, color: '#434F4D' },
});