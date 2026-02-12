import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { PageHeader } from '@/components/ui/PageHeader';

const { width } = Dimensions.get('window');

//CONSTANTS & TYPES

const ACTIVITY_CATEGORIES = [
  { id: 'exercise', name: 'Exercise', icon: 'flame-outline', color: '#FF8A5C' },
  { id: 'mindfulness', name: 'Mindfulness', icon: 'leaf-outline', color: '#5CB89A' },
  { id: 'sleep', name: 'Sleep', icon: 'moon-outline', color: '#7B9FE0' },
  { id: 'nutrition', name: 'Nutrition', icon: 'nutrition-outline', color: '#E3C937' },
  { id: 'hydration', name: 'Hydration', icon: 'water-outline', color: '#90E2DA' },
];

interface Activity {
  id: number;
  date: string;
  time: string;
  type: string;
  category: string;
  durationMin: number;
  intensity: string;
  calories?: number;
  note: string;
}

const SEED_ACTIVITIES: Activity[] = [
  { id: 1, date: new Date().toISOString().split('T')[0], time: '08:30', type: 'Morning Run', category: 'exercise', durationMin: 32, intensity: 'Vigorous', calories: 320, note: '5K around the park' },
  { id: 2, date: new Date().toISOString().split('T')[0], time: '12:00', type: 'Meditation', category: 'mindfulness', durationMin: 15, intensity: 'Light', note: 'Guided breathing' },
  { id: 3, date: new Date().toISOString().split('T')[0], time: '22:30', type: 'Sleep', category: 'sleep', durationMin: 440, intensity: 'Rest', note: '7h 20m total' },
  { id: 4, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], time: '06:00', type: 'Yoga Flow', category: 'mindfulness', durationMin: 45, intensity: 'Moderate', calories: 150, note: '' },
  { id: 5, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], time: '20:00', type: 'Evening Walk', category: 'exercise', durationMin: 30, intensity: 'Light', calories: 120, note: '' },
];

//HELPER FUNCTIONS

function getCategoryInfo(catId: string) {
  return ACTIVITY_CATEGORIES.find(c => c.id === catId) || ACTIVITY_CATEGORIES[0];
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

//SUB-COMPONENTS

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
      <View style={[styles.intensityBadge, { backgroundColor: `${cat.color}18` }]}>
        <ThemedText style={[styles.intensityText, { color: cat.color }]}>{activity.intensity}</ThemedText>
      </View>
    </View>
  );
}

//MAIN COMPONENT

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [form, setForm] = useState({ 
    type: '', 
    category: 'exercise', 
    durationMin: '', 
    calories: '', 
    note: '' 
  });

  // Saving new activity func
  const handleSave = () => {
    if (!form.type.trim()) {
      Alert.alert("Eksik Bilgi", "Lütfen aktivite ismi giriniz.");
      return;
    }

    const duration = parseInt(form.durationMin) || 0;
    const calories = parseInt(form.calories) || 0;

    //INTENSITY logic
    let calculatedIntensity = 'Moderate'; //default

    if (duration > 0) {
      const cpm = calories / duration; // calories per minute
      
      if (form.category === 'sleep' || form.category === 'mindfulness') {
        calculatedIntensity = 'Light'; 
      } else {
        if (cpm < 4) calculatedIntensity = 'Light';
        else if (cpm < 9) calculatedIntensity = 'Moderate';
        else calculatedIntensity = 'Vigorous';
      }
    }

    // Create new obj
    const now = new Date();
    const newActivity: Activity = {
      id: Date.now(),
      date: now.toISOString().split('T')[0], 
      time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), 
      type: form.type,
      category: form.category,
      durationMin: parseInt(form.durationMin) || 0, 
      intensity: calculatedIntensity,
      calories: parseInt(form.calories) || 0, 
      note: form.note
    };

    // Add to top
    setActivities(prev => [newActivity, ...prev]);

    // Close form
    setForm({ type: '', category: 'exercise', durationMin: '', calories: '', note: '' });
    setShowModal(false);
  };

  // Group according to date
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
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Ionicons name="add-circle" size={28} color="#5CB89A" />
            </TouchableOpacity>
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

      {/* Add Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <ScreenBackground style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <ThemedText style={styles.modalAction}>Cancel</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.modalTitleText}>New Activity</ThemedText>
              
              {/* SAVE BUTTON*/}
              <TouchableOpacity onPress={handleSave}>
                <ThemedText style={[styles.modalAction, { fontWeight: '600' }]}>Save</ThemedText>
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
                      <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                    </View>
                    <ThemedText style={styles.catName}>{cat.name}</ThemedText>
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
              
              {/* Space */}
              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        </ScreenBackground>
      </Modal>
    </ScreenBackground>
  );
}

//STYLES

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 18,paddingTop:10, paddingBottom: 40 },

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
  dateGroup: { marginBottom: 14 },
  dateHeader: { fontSize: 14, fontWeight: '600', color: 'rgba(67,79,77,0.55)', marginBottom: 10, marginTop: 4 },
  activityItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 14, padding: 14, marginBottom: 8, gap: 12 },
  activityIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  activityInfo: { flex: 1 },
  activityType: { fontSize: 15, fontWeight: '600', color: '#434F4D' },
  activityMeta: { fontSize: 12, fontWeight: '500', color: 'rgba(67,79,77,0.55)', marginTop: 3 },
  intensityBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  intensityText: { fontSize: 11, fontWeight: '600' },

  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(67,79,77,0.1)' },
  modalAction: { fontSize: 17, color: '#5CB89A' },
  modalTitleText: { fontSize: 17, fontWeight: '600', color: '#434F4D' },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(67,79,77,0.55)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catOption: { width: (width - 80) / 3, padding: 12, borderRadius: 16, alignItems: 'center', backgroundColor: '#F2F2F2', borderWidth: 1, borderColor: 'transparent' },
  catIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  catName: { fontSize: 12, fontWeight: '600', color: '#434F4D', textAlign: 'center' },
  mInput: { backgroundColor: '#F2F2F2', borderRadius: 14, paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 14 : 12, fontSize: 16, color: '#434F4D' },
});