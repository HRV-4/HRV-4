import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

//DATA
export const HRV_DATA = {
    current: 58,
    baseline: 52,
    trend: 'improving' as const,
    change: 11.5,
    lastUpdated: 'Today, 8:30 AM',
    weeklyAverage: 54,
    monthlyAverage: 51,
    history: [
        { date: 'Mon', value: 48 },
        { date: 'Tue', value: 52 },
        { date: 'Wed', value: 49 },
        { date: 'Thu', value: 55 },
        { date: 'Fri', value: 53 },
        { date: 'Sat', value: 57 },
        { date: 'Today', value: 58 },
    ],
};

export const INSIGHTS = [
    { id: 1, type: 'positive' as const, icon: 'trending-up', color: '#34C759', title: 'Recovery improving', desc: 'Your HRV has increased by 11.5% compared to your baseline.', metric: '+11.5%' },
    { id: 2, type: 'info' as const, icon: 'moon', color: '#AF52DE', title: 'Sleep quality impact', desc: 'Your HRV is highest after nights with 7+ hours of sleep.', metric: '7h+' },
    { id: 3, type: 'warning' as const, icon: 'flash', color: '#FF9500', title: 'Training load optimal', desc: 'Your exercise intensity matches your recovery capacity.', metric: 'Balanced' },
];

export const HEALTH_TIPS = [
    { id: 1, icon: 'moon', color: '#AF52DE', title: 'Prioritize Rest Tonight', desc: 'Your body needs recovery time', priority: 'high' },
    { id: 2, icon: 'water', color: '#007AFF', title: 'Stay Hydrated', desc: 'Aim for 3 liters today', priority: 'medium' },
    { id: 3, icon: 'walk', color: '#34C759', title: 'Light Movement', desc: 'A gentle walk can boost recovery', priority: 'medium' },
    { id: 4, icon: 'flower', color: '#FF6B9D', title: 'Deep Breathing', desc: '4-7-8 breathing technique', priority: 'low' },
];

// COMPONENTS

//  Apple Health style Bar Chart 
function HRVBarChart({ data, isDark }: { data: typeof HRV_DATA.history; isDark: boolean }) {
    const maxVal = Math.max(...data.map(d => d.value));
    const minVal = Math.min(...data.map(d => d.value));

    return (
        <View style={chartStyles.container}>
            {/* Bars */}
            <View style={chartStyles.barsRow}>
                {data.map((point, i) => {
                    // Calculate height: normalize to 30-100% range
                    const normalizedHeight = ((point.value - minVal) / (maxVal - minVal)) * 70 + 30;
                    const isToday = i === data.length - 1;
                    
                    return (
                        <View key={i} style={chartStyles.barItem}>
                            {/* Value badge for today */}
                            {isToday && (
                                <View style={chartStyles.valueBadge}>
                                    <ThemedText style={chartStyles.valueBadgeText}>{point.value}</ThemedText>
                                </View>
                            )}
                            
                            {/* The bar */}
                            <View 
                                style={[
                                    chartStyles.bar,
                                    { 
                                        height: normalizedHeight,
                                        backgroundColor: isToday ? '#007AFF' : (isDark ? '#48484A' : '#E5E5EA'),
                                    }
                                ]} 
                            />
                            
                            {/* Date label */}
                            <ThemedText style={[
                                chartStyles.dateLabel,
                                isToday && chartStyles.dateLabelActive
                            ]}>
                                {point.date}
                            </ThemedText>
                        </View>
                    );
                })}
            </View>
            
            {/* Baseline indicator */}
            <View style={chartStyles.baselineRow}>
                <View style={chartStyles.baselineLine} />
                <View style={chartStyles.baselineBadge}>
                    <ThemedText style={chartStyles.baselineText}>Baseline: {HRV_DATA.baseline}ms</ThemedText>
                </View>
            </View>
        </View>
    );
}

function HRVCard({ isDark }: { isDark: boolean }) {
    return (
        <View style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}>
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                    <Ionicons name="pulse" size={16} color="#007AFF" />
                    <ThemedText style={[styles.cardTitle, { color: '#007AFF' }]}>Heart Rate Variability</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </View>
            
            <ThemedText style={[styles.cardSubtitle, { color: isDark ? '#FFF' : '#000' }]}>
                Your HRV is above your baseline, indicating good recovery.
            </ThemedText>
            
            {/* Stats Row - Apple Health Style */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <View style={styles.statHeader}>
                        <View style={[styles.statDot, { backgroundColor: '#007AFF' }]} />
                        <ThemedText style={styles.statLabel}>Last 7 Days</ThemedText>
                    </View>
                    <View style={styles.statValueRow}>
                        <ThemedText style={[styles.statValueLarge, { color: '#007AFF' }]}>{HRV_DATA.current}</ThemedText>
                        <ThemedText style={styles.statUnit}>ms</ThemedText>
                    </View>
                </View>
                
                <View style={styles.statBox}>
                    <View style={styles.statHeader}>
                        <View style={[styles.statDot, { backgroundColor: '#FF9500' }]} />
                        <ThemedText style={styles.statLabel}>Baseline</ThemedText>
                    </View>
                    <View style={styles.statValueRow}>
                        <ThemedText style={styles.statValueLarge}>{HRV_DATA.baseline}</ThemedText>
                        <ThemedText style={styles.statUnit}>ms</ThemedText>
                    </View>
                </View>
            </View>
            
            {/* Bar Chart */}
            <HRVBarChart data={HRV_DATA.history} isDark={isDark} />
        </View>
    );
}

function InsightCard({ insight, isDark }: { insight: typeof INSIGHTS[0]; isDark: boolean }) {
    return (
        <View style={[styles.insightCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}>
            <View style={[styles.insightIcon, { backgroundColor: `${insight.color}20` }]}>
                <Ionicons name={insight.icon as any} size={24} color={insight.color} />
            </View>
            <View style={styles.insightContent}>
                <ThemedText style={styles.insightTitle}>{insight.title}</ThemedText>
                <ThemedText style={styles.insightDesc}>{insight.desc}</ThemedText>
            </View>
            <View style={[styles.insightMetric, { backgroundColor: `${insight.color}15` }]}>
                <ThemedText style={[styles.insightMetricText, { color: insight.color }]}>{insight.metric}</ThemedText>
            </View>
        </View>
    );
}

function TipCard({ tip, isDark }: { tip: typeof HEALTH_TIPS[0]; isDark: boolean }) {
    return (
        <TouchableOpacity style={[styles.tipCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}>
            <View style={[styles.tipIcon, { backgroundColor: `${tip.color}20` }]}>
                <Ionicons name={tip.icon as any} size={22} color={tip.color} />
            </View>
            <View style={styles.tipContent}>
                <ThemedText style={styles.tipTitle}>{tip.title}</ThemedText>
                <ThemedText style={styles.tipDesc}>{tip.desc}</ThemedText>
            </View>
            {tip.priority === 'high' && (
                <View style={styles.priorityBadge}>
                    <ThemedText style={styles.priorityText}>Priority</ThemedText>
                </View>
            )}
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
    );
}

function QuickActionCard({ icon, label, color, onPress }: { icon: string; label: string; color: string; onPress?: () => void }) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    return (
        <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}
            onPress={onPress}
        >
            <View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>
                <Ionicons name={icon as any} size={24} color={color} />
            </View>
            <ThemedText style={styles.quickActionLabel}>{label}</ThemedText>
        </TouchableOpacity>
    );
}

//MAIN SCREEN
export default function InsightsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [activeTab, setActiveTab] = useState<'insights' | 'tips'>('insights');

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F2F2F7' }]}>
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Gradient Header */}
                <LinearGradient
                    colors={['#34C759', '#30D158', '#63E6BE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <SafeAreaView edges={['top']}>
                        <View style={styles.headerContent}>
                            <View>
                                <ThemedText style={styles.headerTitle}>Insights</ThemedText>
                                <ThemedText style={styles.headerSubtitle}>Your Health Summary</ThemedText>
                            </View>
                            <View style={styles.headerAvatar}>
                                <Ionicons name="person-circle" size={44} color="rgba(255,255,255,0.9)" />
                            </View>
                        </View>
                    </SafeAreaView>
                </LinearGradient>

                {/* Status Banner */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.statusBanner}>
                        <LinearGradient
                            colors={['#34C759', '#30D158']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.statusGradient}
                        >
                            <View style={styles.statusIcon}>
                                <Ionicons name="trending-up" size={28} color="#FFF" />
                            </View>
                            <View style={styles.statusContent}>
                                <ThemedText style={styles.statusTitle}>You're Getting Better!</ThemedText>
                                <ThemedText style={styles.statusSubtitle}>Your body is responding well to your routine.</ThemedText>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* HRV Card */}
                <View style={styles.section}>
                    <HRVCard isDark={isDark} />
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
                    <View style={styles.quickActionsGrid}>
                        <QuickActionCard icon="fitness" label="Log Activity" color="#FF6B35" onPress={() => router.push('/activities')} />
                        <QuickActionCard icon="moon" label="Log Sleep" color="#AF52DE" />
                        <QuickActionCard icon="leaf" label="Meditate" color="#34C759" />
                        <QuickActionCard icon="stats-chart" label="View Trends" color="#007AFF" />
                    </View>
                </View>

                {/* Tab Selector */}
                <View style={styles.section}>
                    <View style={[styles.tabContainer, { backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA' }]}>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'insights' && styles.tabActive]}
                            onPress={() => setActiveTab('insights')}
                        >
                            <Ionicons name="analytics" size={18} color={activeTab === 'insights' ? '#FFF' : '#8E8E93'} />
                            <ThemedText style={[styles.tabText, activeTab === 'insights' && styles.tabTextActive]}>AI Insights</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'tips' && styles.tabActive]}
                            onPress={() => setActiveTab('tips')}
                        >
                            <Ionicons name="bulb" size={18} color={activeTab === 'tips' ? '#FFF' : '#8E8E93'} />
                            <ThemedText style={[styles.tabText, activeTab === 'tips' && styles.tabTextActive]}>Health Tips</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.section}>
                    {activeTab === 'insights' ? (
                        <>
                            <ThemedText style={styles.contentTitle}>Personalized Insights</ThemedText>
                            <ThemedText style={styles.contentSubtitle}>Based on your HRV data and activity patterns</ThemedText>
                            {INSIGHTS.map(insight => (
                                <InsightCard key={insight.id} insight={insight} isDark={isDark} />
                            ))}
                        </>
                    ) : (
                        <>
                            <ThemedText style={styles.contentTitle}>Health Tips</ThemedText>
                            <ThemedText style={styles.contentSubtitle}>Actionable recommendations for your wellbeing</ThemedText>
                            {HEALTH_TIPS.map(tip => (
                                <TipCard key={tip.id} tip={tip} isDark={isDark} />
                            ))}
                        </>
                    )}
                </View>

                {/* Mental Wellbeing Section */}
                <View style={styles.section}>
                    <View style={[styles.wellbeingCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}>
                        <View style={styles.wellbeingHeader}>
                            <ThemedText style={styles.wellbeingSectionTitle}>MENTAL WELLBEING</ThemedText>
                            <TouchableOpacity>
                                <Ionicons name="close" size={22} color="#C7C7CC" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.wellbeingBody}>
                            <View style={[styles.wellbeingIcon, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="clipboard" size={28} color="#34C759" />
                            </View>
                            <View style={styles.wellbeingContent}>
                                <ThemedText style={styles.wellbeingTitle}>Wellness Check-In</ThemedText>
                                <ThemedText style={styles.wellbeingDesc}>
                                    Regular reflection on your mental state can help you understand patterns.
                                </ThemedText>
                                <TouchableOpacity>
                                    <ThemedText style={styles.wellbeingAction}>Take Assessment</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// ============ CHART STYLES ============
const chartStyles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
    },
    barsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 120,
        paddingHorizontal: 4,
    },
    barItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    valueBadge: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 6,
    },
    valueBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFF',
    },
    bar: {
        width: 24,
        borderRadius: 6,
    },
    dateLabel: {
        fontSize: 11,
        color: '#8E8E93',
        marginTop: 8,
    },
    dateLabelActive: {
        color: '#007AFF',
        fontWeight: '600',
    },
    baselineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
    },
    baselineLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#FF9500',
        borderRadius: 1,
    },
    baselineBadge: {
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginLeft: 12,
    },
    baselineText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FF9500',
    },
});

//MAIN STYLES
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
    sectionTitle: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
    
    // Status Banner
    statusBanner: { borderRadius: 16, overflow: 'hidden', shadowColor: '#34C759', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 },
    statusGradient: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 14 },
    statusIcon: { width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    statusContent: { flex: 1 },
    statusTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
    statusSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
    
    // Card
    card: { borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    cardTitle: { fontSize: 15, fontWeight: '600' },
    cardSubtitle: { fontSize: 15, fontWeight: '600', marginTop: 8, lineHeight: 20 },
    
    // Stats Row
    statsRow: { flexDirection: 'row', marginTop: 20, gap: 40 },
    statBox: {},
    statHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    statDot: { width: 8, height: 8, borderRadius: 4 },
    statLabel: { fontSize: 13, color: '#8E8E93' },
    statValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
    statValueLarge: { fontSize: 28, fontWeight: '700' },
    statUnit: { fontSize: 15, color: '#8E8E93', fontWeight: '500' },
    
    // Quick Actions
    quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    quickAction: { width: (width - 52) / 2, padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    quickActionIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    quickActionLabel: { fontSize: 15, fontWeight: '500', color: '#8E8E93' },
    
    // Tabs
    tabContainer: { flexDirection: 'row', padding: 4, borderRadius: 10 },
    tab: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 10, borderRadius: 8 },
    tabActive: { backgroundColor: '#007AFF' },
    tabText: { fontSize: 15, fontWeight: '500', color: '#8E8E93' },
    tabTextActive: { color: '#FFF' },
    
    // Content
    contentTitle: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
    contentSubtitle: { fontSize: 15, color: '#8E8E93', marginBottom: 16 },
    
    // Insight Card
    insightCard: { flexDirection: 'row', padding: 16, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, alignItems: 'center', gap: 14 },
    insightIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    insightContent: { flex: 1 },
    insightTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
    insightDesc: { fontSize: 13, color: '#8E8E93', lineHeight: 18 },
    insightMetric: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    insightMetricText: { fontSize: 13, fontWeight: '700' },
    
    // Tip Card
    tipCard: { flexDirection: 'row', padding: 16, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, alignItems: 'center', gap: 14 },
    tipIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    tipContent: { flex: 1 },
    tipTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
    tipDesc: { fontSize: 13, color: '#8E8E93' },
    priorityBadge: { backgroundColor: '#FFF3CD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    priorityText: { fontSize: 11, fontWeight: '600', color: '#856404' },
    
    // Wellbeing Card
    wellbeingCard: { borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    wellbeingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
    wellbeingSectionTitle: { fontSize: 12, fontWeight: '600', color: '#8E8E93', letterSpacing: 0.5 },
    wellbeingBody: { flexDirection: 'row', padding: 16, gap: 14 },
    wellbeingIcon: { width: 56, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    wellbeingContent: { flex: 1 },
    wellbeingTitle: { fontSize: 17, fontWeight: '600', marginBottom: 4 },
    wellbeingDesc: { fontSize: 15, color: '#666', lineHeight: 20 },
    wellbeingAction: { fontSize: 17, fontWeight: '500', color: '#007AFF', marginTop: 10 },
});
