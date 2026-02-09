import React, { useState, useMemo } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    TouchableOpacity,
    TextInput,
    Modal,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

// DATA
const ACTIVITY_CATEGORIES = [
    { id: 'exercise', name: 'Exercise', icon: 'flame', color: '#FF6B35' },
    { id: 'mindfulness', name: 'Mindfulness', icon: 'leaf', color: '#34C759' },
    { id: 'sleep', name: 'Sleep', icon: 'moon', color: '#AF52DE' },
    { id: 'nutrition', name: 'Nutrition', icon: 'nutrition', color: '#FF9500' },
    { id: 'hydration', name: 'Hydration', icon: 'water', color: '#007AFF' },
    { id: 'medication', name: 'Medication', icon: 'medkit', color: '#FF3B30' },
];

const TIME_RANGES = ['12h', '24h', '1w', '1m', '1y'];

interface Activity {
    id: number;
    date: string;
    time: string;
    type: string;
    category: string;
    durationMin: number;
    intensity: string;
    calories?: number;
    heartRate?: { avg: number; max: number };
    note: string;
}

const SEED_ACTIVITIES: Activity[] = [
    { id: 1, date: new Date().toISOString().split('T')[0], time: '07:30', type: 'Morning Run', category: 'exercise', durationMin: 35, intensity: 'Vigorous', calories: 320, heartRate: { avg: 142, max: 168 }, note: '5K run around the park' },
    { id: 2, date: new Date().toISOString().split('T')[0], time: '12:00', type: 'Meditation', category: 'mindfulness', durationMin: 15, intensity: 'Light', note: 'Guided breathing' },
    { id: 3, date: new Date().toISOString().split('T')[0], time: '18:45', type: 'Strength Training', category: 'exercise', durationMin: 50, intensity: 'Vigorous', calories: 280, heartRate: { avg: 128, max: 155 }, note: 'Upper body' },
    { id: 4, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], time: '06:00', type: 'Yoga Flow', category: 'mindfulness', durationMin: 45, intensity: 'Moderate', calories: 150, note: '' },
    { id: 5, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], time: '20:00', type: 'Evening Walk', category: 'exercise', durationMin: 30, intensity: 'Light', calories: 120, note: '' },
];

// ============ COMPONENTS ============

// Apple Health style Summary Card with gradient
function SummaryHeader({ stats }: { stats: any }) {
    return (
        <LinearGradient
            colors={['#FF6B9D', '#C44BD9', '#6B8BFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
        >
            <SafeAreaView edges={['top']}>
                <View style={styles.headerContent}>
                    <View>
                        <ThemedText style={styles.headerTitle}>Activities</ThemedText>
                        <ThemedText style={styles.headerSubtitle}>Today's Summary</ThemedText>
                    </View>
                    <View style={styles.headerAvatar}>
                        <Ionicons name="person-circle" size={44} color="rgba(255,255,255,0.9)" />
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

// Apple Health style metric card
function MetricCard({ 
    title, 
    value, 
    unit, 
    subtitle, 
    color, 
    icon,
    chartData,
    onPress 
}: { 
    title: string;
    value: string | number;
    unit?: string;
    subtitle?: string;
    color: string;
    icon: string;
    chartData?: number[];
    onPress?: () => void;
}) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    return (
        <TouchableOpacity 
            style={[styles.metricCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.metricHeader}>
                <View style={styles.metricTitleRow}>
                    <Ionicons name={icon as any} size={16} color={color} />
                    <ThemedText style={[styles.metricTitle, { color }]}>{title}</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </View>
            
            {subtitle && (
                <ThemedText style={styles.metricSubtitle}>{subtitle}</ThemedText>
            )}
            
            {/* Mini Bar Chart */}
            {chartData && (
                <View style={styles.miniChart}>
                    {chartData.map((val, i) => (
                        <View 
                            key={i} 
                            style={[
                                styles.miniBar,
                                { 
                                    height: `${(val / Math.max(...chartData)) * 100}%`,
                                    backgroundColor: i === chartData.length - 1 ? color : '#E5E5EA',
                                }
                            ]} 
                        />
                    ))}
                </View>
            )}
            
            <View style={styles.metricValueRow}>
                <ThemedText style={styles.metricValue}>{value}</ThemedText>
                {unit && <ThemedText style={styles.metricUnit}>{unit}</ThemedText>}
            </View>
        </TouchableOpacity>
    );
}

// Apple Health style Alert Card 
function AlertCard({ title, description, onPress, onDismiss }: {
    title: string;
    description: string;
    onPress?: () => void;
    onDismiss?: () => void;
}) {
    return (
        <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
                <View style={styles.alertHeaderLeft}>
                    <Ionicons name="warning" size={16} color="#000" />
                    <ThemedText style={styles.alertHeaderText}>ACTIVITY GOAL</ThemedText>
                </View>
                <TouchableOpacity onPress={onDismiss}>
                    <Ionicons name="close-circle-outline" size={24} color="#666" />
                </TouchableOpacity>
            </View>
            <View style={styles.alertBody}>
                <View style={[styles.alertIcon, { backgroundColor: '#FF9500' }]}>
                    <Ionicons name="flame" size={28} color="#FFF" />
                </View>
                <View style={styles.alertContent}>
                    <ThemedText style={styles.alertTitle}>{title}</ThemedText>
                    <ThemedText style={styles.alertDesc}>{description}</ThemedText>
                    <TouchableOpacity onPress={onPress}>
                        <ThemedText style={styles.alertAction}>More Details</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// Activity Item - Apple Health style
function ActivityItem({ activity, onDelete, isDark }: { 
    activity: Activity; 
    onDelete: (id: number) => void;
    isDark: boolean;
}) {
    const [expanded, setExpanded] = useState(false);
    const category = ACTIVITY_CATEGORIES.find(c => c.id === activity.category) || ACTIVITY_CATEGORIES[0];
    
    return (
        <TouchableOpacity 
            style={[styles.activityItem, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.7}
        >
            <View style={styles.activityMain}>
                <View style={[styles.activityIcon, { backgroundColor: `${category.color}20` }]}>
                    <Ionicons name={category.icon as any} size={24} color={category.color} />
                </View>
                <View style={styles.activityInfo}>
                    <ThemedText style={styles.activityType}>{activity.type}</ThemedText>
                    <ThemedText style={styles.activityMeta}>
                        {activity.time} · {activity.durationMin} min
                        {activity.calories ? ` · ${activity.calories} kcal` : ''}
                    </ThemedText>
                </View>
                <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#C7C7CC" />
            </View>
            
            {expanded && (
                <View style={[styles.activityExpanded, { borderTopColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                    {activity.heartRate && (
                        <View style={styles.activityStat}>
                            <Ionicons name="heart" size={16} color="#FF3B30" />
                            <ThemedText style={styles.activityStatText}>
                                {activity.heartRate.avg} avg / {activity.heartRate.max} max bpm
                            </ThemedText>
                        </View>
                    )}
                    {activity.note && (
                        <ThemedText style={styles.activityNote}>{activity.note}</ThemedText>
                    )}
                    <View style={styles.activityActions}>
                        <TouchableOpacity style={styles.activityActionBtn}>
                            <Ionicons name="create-outline" size={18} color="#007AFF" />
                            <ThemedText style={[styles.activityActionText, { color: '#007AFF' }]}>Edit</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.activityActionBtn}
                            onPress={() => onDelete(activity.id)}
                        >
                            <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                            <ThemedText style={[styles.activityActionText, { color: '#FF3B30' }]}>Delete</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
}

// ============ MAIN SCREEN ============
export default function ActivitiesScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES);
    const [selectedRange, setSelectedRange] = useState('24h');
    const [modalVisible, setModalVisible] = useState(false);
    const [showAlert, setShowAlert] = useState(true);
    const [form, setForm] = useState({
        type: '',
        category: 'exercise',
        durationMin: '30',
        intensity: 'Moderate',
        calories: '',
        note: '',
    });

    // Calculate stats
    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const todayActivities = activities.filter(a => a.date === today);
        const weekActivities = activities.slice(0, 7);
        
        return {
            totalDuration: todayActivities.reduce((sum, a) => sum + a.durationMin, 0),
            totalCalories: todayActivities.reduce((sum, a) => sum + (a.calories || 0), 0),
            activityCount: todayActivities.length,
            avgCaloriesWeek: Math.round(weekActivities.reduce((sum, a) => sum + (a.calories || 0), 0) / 7),
            weeklyChart: [45, 80, 30, 95, 60, 75, 100], // Mock weekly data
        };
    }, [activities]);

    const handleDelete = (id: number) => {
        setActivities(prev => prev.filter(a => a.id !== id));
    };

    const handleSave = () => {
        if (!form.type.trim()) return;
        
        const newActivity: Activity = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().slice(0, 5),
            type: form.type,
            category: form.category,
            durationMin: parseInt(form.durationMin) || 30,
            intensity: form.intensity,
            calories: form.calories ? parseInt(form.calories) : undefined,
            note: form.note,
        };
        
        setActivities(prev => [newActivity, ...prev]);
        setModalVisible(false);
        setForm({ type: '', category: 'exercise', durationMin: '30', intensity: 'Moderate', calories: '', note: '' });
    };

    // Group activities by date
    const groupedActivities = useMemo(() => {
        const groups: { [key: string]: Activity[] } = {};
        activities.forEach(activity => {
            if (!groups[activity.date]) groups[activity.date] = [];
            groups[activity.date].push(activity);
        });
        return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
    }, [activities]);

    const formatDate = (dateStr: string) => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (dateStr === today) return 'Today';
        if (dateStr === yesterday) return 'Yesterday';
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F2F2F7' }]}>
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Gradient Header */}
                <SummaryHeader stats={stats} />

                {/* Alert Card */}
                {showAlert && (
                    <View style={styles.section}>
                        <AlertCard
                            title="You're on track!"
                            description="You've completed 3 activities today. Keep up the momentum!"
                            onDismiss={() => setShowAlert(false)}
                        />
                    </View>
                )}

                {/* Metric Cards - 2 Column Grid */}
                <View style={styles.section}>
                    <View style={styles.metricsGrid}>
                        <MetricCard
                            title="Active Energy"
                            value={stats.totalCalories}
                            unit="kcal"
                            subtitle={`The last 7 days, you burned an average of ${stats.avgCaloriesWeek} kcal a day.`}
                            color="#FF6B35"
                            icon="flame"
                            chartData={stats.weeklyChart}
                        />
                        <MetricCard
                            title="Move Minutes"
                            value={stats.totalDuration}
                            unit="min"
                            subtitle="Total active time today"
                            color="#34C759"
                            icon="walk"
                            chartData={[30, 45, 20, 60, 35, 50, stats.totalDuration]}
                        />
                    </View>
                    
                    {/* Small Cards Row */}
                    <View style={styles.smallCardsRow}>
                        <View style={[styles.smallCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}>
                            <View style={styles.smallCardHeader}>
                                <Ionicons name="fitness" size={16} color="#AF52DE" />
                                <ThemedText style={[styles.smallCardTitle, { color: '#AF52DE' }]}>Workouts</ThemedText>
                                <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
                            </View>
                            <ThemedText style={styles.smallCardValue}>{stats.activityCount}</ThemedText>
                            <ThemedText style={styles.smallCardLabel}>Today</ThemedText>
                        </View>
                        <View style={[styles.smallCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}>
                            <View style={styles.smallCardHeader}>
                                <Ionicons name="heart" size={16} color="#FF3B30" />
                                <ThemedText style={[styles.smallCardTitle, { color: '#FF3B30' }]}>Heart Rate</ThemedText>
                                <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
                            </View>
                            <ThemedText style={styles.smallCardValue}>142</ThemedText>
                            <ThemedText style={styles.smallCardLabel}>Avg BPM</ThemedText>
                        </View>
                    </View>
                </View>

                {/* Time Range Filter */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Recent Activities</ThemedText>
                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => setModalVisible(true)}
                        >
                            <Ionicons name="add-circle" size={28} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.rangeContainer}
                    >
                        {TIME_RANGES.map(range => (
                            <TouchableOpacity
                                key={range}
                                style={[
                                    styles.rangeChip,
                                    selectedRange === range && styles.rangeChipActive
                                ]}
                                onPress={() => setSelectedRange(range)}
                            >
                                <ThemedText style={[
                                    styles.rangeChipText,
                                    selectedRange === range && styles.rangeChipTextActive
                                ]}>{range}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Activities List */}
                <View style={styles.section}>
                    {groupedActivities.map(([date, acts]) => (
                        <View key={date} style={styles.dateGroup}>
                            <ThemedText style={styles.dateHeader}>{formatDate(date)}</ThemedText>
                            {acts.map(activity => (
                                <ActivityItem
                                    key={activity.id}
                                    activity={activity}
                                    onDelete={handleDelete}
                                    isDark={isDark}
                                />
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Add Activity Modal */}
            <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
                <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDark ? '#000' : '#F2F2F7' }]}>
                    <View style={[styles.modalHeader, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <ThemedText style={styles.modalCancel}>Cancel</ThemedText>
                        </TouchableOpacity>
                        <ThemedText style={styles.modalTitle}>Log Activity</ThemedText>
                        <TouchableOpacity onPress={handleSave}>
                            <ThemedText style={styles.modalSave}>Save</ThemedText>
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={styles.modalBody}>
                        <ThemedText style={styles.fieldLabel}>Category</ThemedText>
                        <View style={styles.categoryGrid}>
                            {ACTIVITY_CATEGORIES.map(cat => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.categoryOption,
                                        { backgroundColor: isDark ? '#1C1C1E' : '#FFF' },
                                        form.category === cat.id && { borderColor: cat.color, borderWidth: 2 }
                                    ]}
                                    onPress={() => setForm(prev => ({ ...prev, category: cat.id }))}
                                >
                                    <View style={[styles.categoryIcon, { backgroundColor: `${cat.color}20` }]}>
                                        <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                                    </View>
                                    <ThemedText style={styles.categoryName}>{cat.name}</ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <ThemedText style={styles.fieldLabel}>Activity Name</ThemedText>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#1C1C1E' : '#FFF', color: isDark ? '#FFF' : '#000' }]}
                            placeholder="e.g., Morning Run"
                            placeholderTextColor="#8E8E93"
                            value={form.type}
                            onChangeText={(text) => setForm(prev => ({ ...prev, type: text }))}
                        />

                        <View style={styles.formRow}>
                            <View style={styles.formField}>
                                <ThemedText style={styles.fieldLabel}>Duration (min)</ThemedText>
                                <TextInput
                                    style={[styles.input, { backgroundColor: isDark ? '#1C1C1E' : '#FFF', color: isDark ? '#FFF' : '#000' }]}
                                    placeholder="30"
                                    placeholderTextColor="#8E8E93"
                                    keyboardType="number-pad"
                                    value={form.durationMin}
                                    onChangeText={(text) => setForm(prev => ({ ...prev, durationMin: text }))}
                                />
                            </View>
                            <View style={styles.formField}>
                                <ThemedText style={styles.fieldLabel}>Calories</ThemedText>
                                <TextInput
                                    style={[styles.input, { backgroundColor: isDark ? '#1C1C1E' : '#FFF', color: isDark ? '#FFF' : '#000' }]}
                                    placeholder="0"
                                    placeholderTextColor="#8E8E93"
                                    keyboardType="number-pad"
                                    value={form.calories}
                                    onChangeText={(text) => setForm(prev => ({ ...prev, calories: text }))}
                                />
                            </View>
                        </View>

                        <ThemedText style={styles.fieldLabel}>Notes</ThemedText>
                        <TextInput
                            style={[styles.input, styles.textArea, { backgroundColor: isDark ? '#1C1C1E' : '#FFF', color: isDark ? '#FFF' : '#000' }]}
                            placeholder="How did it go?"
                            placeholderTextColor="#8E8E93"
                            multiline
                            numberOfLines={4}
                            value={form.note}
                            onChangeText={(text) => setForm(prev => ({ ...prev, note: text }))}
                        />
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </View>
    );
}

// ============ STYLES ============
const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    
    // Header
    headerGradient: { paddingBottom: 20 },
    headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 10 },
    headerTitle: { fontSize: 34, fontWeight: '700', color: '#FFF', letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 17, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    headerAvatar: { marginTop: 4 },
    
    // Sections
    section: { paddingHorizontal: 20, marginTop: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 22, fontWeight: '700' },
    addButton: {},
    
    // Alert Card
    alertCard: { backgroundColor: '#FFD60A', borderRadius: 12, overflow: 'hidden' },
    alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.05)' },
    alertHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    alertHeaderText: { fontSize: 12, fontWeight: '600', color: '#000', letterSpacing: 0.5 },
    alertBody: { flexDirection: 'row', padding: 16, gap: 14 },
    alertIcon: { width: 56, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    alertContent: { flex: 1 },
    alertTitle: { fontSize: 17, fontWeight: '600', color: '#000', marginBottom: 4 },
    alertDesc: { fontSize: 15, color: '#333', lineHeight: 20 },
    alertAction: { fontSize: 17, fontWeight: '500', color: '#007AFF', marginTop: 8 },
    
    // Metrics Grid
    metricsGrid: { gap: 12 },
    metricCard: { borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    metricTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metricTitle: { fontSize: 15, fontWeight: '600' },
    metricSubtitle: { fontSize: 15, fontWeight: '600', color: '#000', marginTop: 8, lineHeight: 20 },
    miniChart: { flexDirection: 'row', alignItems: 'flex-end', height: 60, gap: 6, marginTop: 16, marginBottom: 8 },
    miniBar: { flex: 1, borderRadius: 4, minHeight: 8 },
    metricValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 8 },
    metricValue: { fontSize: 34, fontWeight: '700' },
    metricUnit: { fontSize: 17, fontWeight: '500', color: '#8E8E93' },
    
    // Small Cards
    smallCardsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
    smallCard: { flex: 1, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    smallCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    smallCardTitle: { flex: 1, fontSize: 15, fontWeight: '600' },
    smallCardValue: { fontSize: 34, fontWeight: '700', marginTop: 12 },
    smallCardLabel: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
    
    // Time Range
    rangeContainer: { gap: 8, paddingVertical: 8 },
    rangeChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, backgroundColor: '#E5E5EA' },
    rangeChipActive: { backgroundColor: '#007AFF' },
    rangeChipText: { fontSize: 15, fontWeight: '500', color: '#666' },
    rangeChipTextActive: { color: '#FFF' },
    
    // Activity Items
    dateGroup: { marginBottom: 24 },
    dateHeader: { fontSize: 20, fontWeight: '600', marginBottom: 12, marginTop: 8 },
    activityItem: { borderRadius: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
    activityMain: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
    activityIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    activityInfo: { flex: 1 },
    activityType: { fontSize: 17, fontWeight: '600' },
    activityMeta: { fontSize: 15, color: '#8E8E93', marginTop: 2 },
    activityExpanded: { padding: 16, paddingTop: 12, borderTopWidth: 1 },
    activityStat: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    activityStatText: { fontSize: 15, color: '#666' },
    activityNote: { fontSize: 15, color: '#666', fontStyle: 'italic', marginBottom: 12 },
    activityActions: { flexDirection: 'row', gap: 16 },
    activityActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    activityActionText: { fontSize: 15, fontWeight: '500' },
    
    // Modal
    modalContainer: { flex: 1 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
    modalCancel: { fontSize: 17, color: '#007AFF' },
    modalTitle: { fontSize: 17, fontWeight: '600' },
    modalSave: { fontSize: 17, fontWeight: '600', color: '#007AFF' },
    modalBody: { flex: 1, padding: 20 },
    fieldLabel: { fontSize: 13, fontWeight: '600', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    categoryOption: { width: (width - 60) / 3, padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
    categoryIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    categoryName: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
    input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 17 },
    textArea: { minHeight: 100, textAlignVertical: 'top' },
    formRow: { flexDirection: 'row', gap: 12 },
    formField: { flex: 1 },
});
