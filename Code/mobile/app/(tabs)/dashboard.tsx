import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    TouchableOpacity,
    Dimensions,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Svg, { Circle, Path, Rect, Polygon, Line, Polyline } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '@/components/ui/ScreenBackground';

const { width } = Dimensions.get('window');

// Mock data similar to web frontend
const DEFAULT_METRICS = {
    biologicalAge: 30,
    comparisonScore: 40,
    avgHeartRate: 78,
    sleepDuration: '7h 20m',
    sleepQuality: 82,
    performancePotential: '94%',
    burnoutResistance10: 8.2,
    stressProcessing10: 6.8,
    impulse: 65,
    regenerationScore10: 7.5,
    overallRegeneration: '3h 20m',
    maxHr: 185,
    minHr: 54,
    avgHrDay: 82,
    avgHrNight: 58,
};

// Mock data for new sections
const INSIGHTS_DATA = [
    { id: 1, type: 'positive', icon: 'trending-up', color: '#34C759', title: 'Recovery improving', desc: 'Your HRV has increased by 11.5% compared to your baseline.', metric: '+11.5%' },
    { id: 2, type: 'info', icon: 'moon', color: '#AF52DE', title: 'Sleep quality impact', desc: 'Your HRV is highest after nights with 7+ hours of sleep.', metric: '7h+' },
    { id: 3, type: 'warning', icon: 'flash', color: '#FF9500', title: 'Training load optimal', desc: 'Your exercise intensity matches your recovery capacity.', metric: 'Balanced' },
];

const TIPS_DATA = [
    { id: 1, icon: 'moon', color: '#AF52DE', title: 'Prioritize Rest Tonight', desc: 'Your body needs recovery time', priority: 'high' },
    { id: 2, icon: 'water', color: '#007AFF', title: 'Stay Hydrated', desc: 'Aim for 3 liters today', priority: 'medium' },
    { id: 3, icon: 'walk', color: '#34C759', title: 'Light Movement', desc: 'A gentle walk can boost recovery', priority: 'medium' },
    { id: 4, icon: 'flower-outline', color: '#FF6B9D', title: 'Deep Breathing', desc: '4-7-8 breathing technique', priority: 'low' },
];

const ACTIVITIES_DATA = [
    { id: 1, type: 'running', icon: 'fitness', color: '#FF6B35', title: 'Morning Run', desc: '5.2 km in 32 minutes', time: '8:30 AM', duration: '32 min' },
    { id: 2, type: 'meditation', icon: 'leaf', color: '#34C759', title: 'Meditation', desc: 'Mindfulness session', time: '12:00 PM', duration: '15 min' },
    { id: 3, type: 'sleep', icon: 'moon', color: '#AF52DE', title: 'Sleep', desc: 'Night rest', time: '10:30 PM', duration: '7h 20m' },
];

// Gauge Component for Biological Age
function Gauge({ score, text, isDark }: { score: number; text: string; isDark: boolean }) {
    const radius = 70;
    const stroke = 12;
    const size = 170;
    const center = size / 2;
    const normalizedScore = Math.min(Math.max(score, -100), 100);
    const isPositive = normalizedScore >= 0;
    
    const circumference = 2 * Math.PI * radius;
    const progress = Math.abs(normalizedScore) / 100;
    const strokeDashoffset = circumference * (1 - progress);
    
    const color = isPositive ? '#34C759' : '#FF3B30';

    return (
        <View style={gaugeStyles.wrapper}>
            <Svg width={size} height={size} style={gaugeStyles.svg}>
                {/* Background Circle */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#E5E5EA"
                    strokeWidth={stroke}
                    fill="transparent"
                />
                {/* Progress Circle */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={color}
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </Svg>
            
            {/* Text Container */}
            <View style={gaugeStyles.content}>
                <View style={gaugeStyles.stack}>
                    <ThemedText style={[gaugeStyles.value, { color: color }]}>
                        {Math.abs(score)}%
                    </ThemedText>
                    <ThemedText style={gaugeStyles.note}>{text}</ThemedText>
                </View>
            </View>
        </View>
    );
}

// Metric Card Component
function MetricCard({ 
    label, 
    value, 
    subLabel, 
    icon, 
    color, 
    onPress,
    isDark 
}: { 
    label: string; 
    value: string | number; 
    subLabel?: string; 
    icon: string; 
    color: string; 
    onPress?: () => void;
    isDark: boolean;
}) {
    return (
        <TouchableOpacity 
            style={[styles.metricCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}
            onPress={onPress}
        >
            <View style={styles.metricHeader}>
                <View style={[styles.metricIcon, { backgroundColor: `${color}20` }]}>
                    <Ionicons name={icon as any} size={20} color={color} />
                </View>
                <ThemedText style={styles.metricLabel}>{label}</ThemedText>
            </View>
            <View style={styles.metricValueRow}>
                <ThemedText style={styles.metricValue}>{value}</ThemedText>
                {subLabel && <ThemedText style={styles.metricSub}>{subLabel}</ThemedText>}
            </View>
        </TouchableOpacity>
    );
}

// Summary Card Component
function SummaryCard({ 
    title, 
    value, 
    unit, 
    icon, 
    color, 
    subtitle,
    subtitleBgColor,
    subtitleTextColor,
    onPress,
    isDark 
}: { 
    title: string; 
    value: string | number; 
    unit?: string; 
    icon: string; 
    color: string; 
    subtitle?: string;
    subtitleBgColor?: string;
    subtitleTextColor?: string;
    onPress?: () => void;
    isDark: boolean;
}) {
    return (
        <TouchableOpacity 
            style={[styles.summaryCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}
            onPress={onPress}
        >
            <View style={styles.summaryHeader}>
                <ThemedText style={styles.summaryTitle}>{title}</ThemedText>
                <View style={[styles.summaryIcon, { backgroundColor: `${color}20` }]}>
                    <Ionicons name={icon as any} size={16} color={color} />
                </View>
            </View>
            <View style={styles.summaryContent}>
                <View style={styles.summaryValueRow}>
                    <ThemedText style={[styles.summaryValue, { color: color }]}>{value}</ThemedText>
                    {unit && <ThemedText style={styles.summaryUnit}>{unit}</ThemedText>}
                </View>
                {subtitle && (
                    <View style={[styles.summarySubtitle, subtitleBgColor ? { backgroundColor: subtitleBgColor } : null]}>
                        <ThemedText style={[styles.summarySubtitleText, subtitleTextColor ? { color: subtitleTextColor } : null]}>
                            {subtitle}
                        </ThemedText>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

// Icon Component from frontend assets
function FrontendIcon({ name, size = 20, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
    const icons: { [key: string]: React.ReactNode } = {
        // Activity icons
        running: <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Circle cx="12" cy="5" r="2" fill={color} /><Path d="M4 17l4-4 2 2 4-6 4 4" /><Path d="M15 21l-3-3-2 2-4-4" /></Svg>,
        fitness: <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M22 12h-4l-3 9L9 3l-3 9H2" /></Svg>,
        activity: <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M22 12h-4l-3 9L9 3l-3 9H2" /></Svg>,
        
        // Heart icons
        heart: <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}><Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></Svg>,
        heartRate: <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M3 12h4l3-9 4 18 3-9h4" /></Svg>,
        
        // Mind/Sleep icons
        moon: <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></Svg>,
        leaf: <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></Svg>,
        brain: <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><Path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /><Path d="M12 5v13" /></Svg>,
        
        // Performance icons
        zap: <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Svg>,
        'shield-checkmark': <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><Polyline points="9 12 12 15 16 9" /></Svg>,
        'battery-charging': <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M16 8h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2" /><Rect x="4" y="11" width="8" height="8" rx="1" /><Path d="M12 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2" /></Svg>,
        
        // Arrow icons
        'arrow-up': <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Line x1="12" y1="19" x2="12" y2="5" /><Polyline points="5 12 12 5 19 12" /></Svg>,
        'arrow-down': <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Line x1="12" y1="5" x2="12" y2="19" /><Polyline points="19 12 12 19 5 12" /></Svg>,
        sunny: <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Circle cx="12" cy="12" r="5" /><Line x1="12" y1="1" x2="12" y2="3" /><Line x1="12" y1="21" x2="12" y2="23" /><Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><Line x1="1" y1="12" x2="3" y2="12" /><Line x1="21" y1="12" x2="23" y2="12" /><Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></Svg>,
        
        // Other icons
        apps: <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Rect x="3" y="3" width="7" height="7" /><Rect x="14" y="3" width="7" height="7" /><Rect x="14" y="14" width="7" height="7" /><Rect x="3" y="14" width="7" height="7" /></Svg>,
        bulb: <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M9 18h6" /><Path d="M10 22h4" /><Path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></Svg>,
        water: <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></Svg>,
        walk: <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Circle cx="12" cy="4" r="2" /><Path d="M15 22v-4l-3-3 1-4 3 3h4" /><Path d="M9 22l1-8-4-2" /></Svg>,
        flower: <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Circle cx="12" cy="12" r="3" /><Circle cx="12" cy="5" r="2" /><Circle cx="12" cy="19" r="2" /><Circle cx="5" cy="12" r="2" /><Circle cx="19" cy="12" r="2" /></Svg>,
        
        // Trending icons
        'trending-up': <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><Polyline points="17 6 23 6 23 12" /></Svg>,
    };
    
    return icons[name] || <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><Circle cx="12" cy="12" r="10" /></Svg>;
}

// SmartStack Content Component
function SmartStackContent({ isDark }: { isDark: boolean }) {
    return (
        <View style={styles.metricsGrid}>
            <MetricCard
                label="Performance Potential"
                value={DEFAULT_METRICS.performancePotential}
                icon="zap"
                color="#FF9500"
                onPress={() => {}}
                isDark={isDark}
            />
            <MetricCard
                label="Burnout Resistance"
                value={DEFAULT_METRICS.burnoutResistance10}
                subLabel="/10"
                icon="shield-checkmark"
                color="#34C759"
                onPress={() => {}}
                isDark={isDark}
            />
            <MetricCard
                label="Stress Processing"
                value={DEFAULT_METRICS.stressProcessing10}
                subLabel="/10"
                icon="brain"
                color="#007AFF"
                onPress={() => {}}
                isDark={isDark}
            />
            <MetricCard
                label="Regeneration Score"
                value={DEFAULT_METRICS.regenerationScore10}
                subLabel="/10"
                icon="battery-charging"
                color="#30B0C7"
                onPress={() => {}}
                isDark={isDark}
            />
        </View>
    );
}

// Activities Content Component
function ActivitiesContent({ isDark }: { isDark: boolean }) {
    const router = useRouter();
    
    return (
        <View style={styles.activitiesContent}>
            {ACTIVITIES_DATA.map(activity => (
                <TouchableOpacity key={activity.id} style={[styles.activityItem, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]} onPress={() => router.push('/activities')}>
                    <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
                        <Ionicons name={activity.icon as any} size={20} color={activity.color} />
                    </View>
                    <View style={styles.activityContent}>
                        <ThemedText style={styles.activityTitle}>{activity.title}</ThemedText>
                        <ThemedText style={styles.activityDesc}>{activity.desc}</ThemedText>
                        <ThemedText style={styles.activityTime}>{activity.time} • {activity.duration}</ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
                </TouchableOpacity>
            ))}
        </View>
    );
}

// Insights Content Component
function InsightsContent({ isDark }: { isDark: boolean }) {
    const router = useRouter();
    
    return (
        <View style={styles.insightsContent}>
            {INSIGHTS_DATA.slice(0, 2).map(insight => (
                <TouchableOpacity 
                    key={insight.id} 
                    style={[styles.insightItem, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
                    onPress={() => router.push('/insights' as any)}
                >
                    <View style={[styles.insightIcon, { backgroundColor: `${insight.color}20` }]}>
                        <Ionicons name={insight.icon as any} size={20} color={insight.color} />
                    </View>
                    <View style={styles.insightContent}>
                        <ThemedText style={styles.insightTitle}>{insight.title}</ThemedText>
                        <ThemedText style={styles.insightDesc}>{insight.desc}</ThemedText>
                    </View>
                    <View style={[styles.insightMetric, { backgroundColor: `${insight.color}15` }]}>
                        <ThemedText style={[styles.insightMetricText, { color: insight.color }]}>{insight.metric}</ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
                </TouchableOpacity>
            ))}
        </View>
    );
}

// Tips Content Component
function TipsContent({ isDark }: { isDark: boolean }) {
    const router = useRouter();
    
    return (
        <View style={styles.tipsContent}>
            {TIPS_DATA.slice(0, 2).map(tip => (
                <TouchableOpacity 
                    key={tip.id} 
                    style={[styles.tipItem, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
                    onPress={() => router.push('/insights' as any)}
                >
                    <View style={[styles.tipIcon, { backgroundColor: `${tip.color}20` }]}>
                        <Ionicons name={tip.icon as any} size={20} color={tip.color} />
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
                    <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
                </TouchableOpacity>
            ))}
        </View>
    );
}

export default function DashboardScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const sleepQuality = DEFAULT_METRICS.sleepQuality;
    const sleepQualityHigh = sleepQuality > 80;
    const sleepSubtitleBg = sleepQualityHigh ? '#ecfdf5' : '#fff7ed';
    const sleepSubtitleText = sleepQualityHigh ? '#047857' : '#c2410c';

    return (
        <ScreenBackground style={styles.container}>

            <ScrollView 
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
            >
                {/* Biological Age Card */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={[styles.bioAgeCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}
                        activeOpacity={0.9}
                        onPress={() => router.push('/graphs')}
                    >
                        <ThemedText style={styles.cardTitle}>Biological Age</ThemedText>
                        <View style={styles.bioAgeLayout}>
                            <View style={styles.bioAgeValueRow}>
                                <ThemedText style={styles.bioAgeValue}>{DEFAULT_METRICS.biologicalAge}</ThemedText>
                                <ThemedText style={styles.bioAgeLabel}>years</ThemedText>
                            </View>
                            <Gauge 
                                score={DEFAULT_METRICS.comparisonScore} 
                                text={DEFAULT_METRICS.comparisonScore >= 0 ? 'better than your age' : 'worse than your age'}
                                isDark={isDark}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Health Overview Section */}
                <View style={[styles.section, styles.sectionWithSpacing]}>
                    <ThemedText style={styles.sectionTitle}>Health Overview</ThemedText>
                    
                    {/* Vitals Row - Heart Rate & Sleep */}
                    <View style={styles.vitalsRow}>
                        <SummaryCard
                            title="Avg Heart Rate"
                            value={DEFAULT_METRICS.avgHeartRate}
                            unit="bpm"
                            icon="heart"
                            color="#FF2D55"
                            onPress={() => router.push('/graphs')}
                            isDark={isDark}
                        />
                        <SummaryCard
                            title="Sleep"
                            value={DEFAULT_METRICS.sleepDuration}
                            icon="moon"
                            color="#AF52DE"
                            subtitle={`Sleep Quality: ${sleepQuality}%`}
                            subtitleBgColor={sleepSubtitleBg}
                            subtitleTextColor={sleepSubtitleText}
                            onPress={() => router.push('/graphs')}
                            isDark={isDark}
                        />
                    </View>

                    {/* Performance Metrics Grid - 2x2 */}
                    <View style={styles.metricsGrid}>
                        <MetricCard
                            label="Performance Potential"
                            value={DEFAULT_METRICS.performancePotential}
                            icon="flash"
                            color="#FF9500"
                            onPress={() => router.push('/graphs')}
                            isDark={isDark}
                        />
                        <MetricCard
                            label="Burnout Resistance"
                            value={DEFAULT_METRICS.burnoutResistance10}
                            subLabel="/10"
                            icon="pulse"
                            color="#EFD516"
                            onPress={() => router.push('/graphs')}
                            isDark={isDark}
                        />
                        <MetricCard
                            label="Stress Processing"
                            value={DEFAULT_METRICS.stressProcessing10}
                            subLabel="/10"
                            icon="pulse"
                            color="#007AFF"
                            onPress={() => router.push('/graphs')}
                            isDark={isDark}
                        />
                        <MetricCard
                            label="Regeneration Score"
                            value={DEFAULT_METRICS.regenerationScore10}
                            subLabel="/10"
                            icon="battery-charging"
                            color="#30B0C7"
                            onPress={() => router.push('/graphs')}
                            isDark={isDark}
                        />
                    </View>
                </View>

                {/* Recent Activities Section */}
                <View style={styles.section}>
                    <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionHeaderLeft}>
                                <View style={[styles.sectionIcon, { backgroundColor: '#FF6B3520' }]}>
                                    <Ionicons name="fitness" size={20} color="#FF6B35" />
                                </View>
                                <ThemedText style={styles.sectionTitleText}>Activities</ThemedText>
                            </View>
                        </View>
                        <View style={styles.sectionContent}>
                            <ActivitiesContent isDark={isDark} />
                        </View>
                    </View>
                </View>

                {/* Insights Section */}
                <View style={styles.section}>
                    <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionHeaderLeft}>
                                <View style={[styles.sectionIcon, { backgroundColor: '#34C75920' }]}>
                                    <Ionicons name="bulb" size={20} color="#34C759" />
                                </View>
                                <ThemedText style={styles.sectionTitleText}>Insights</ThemedText>
                            </View>
                        </View>
                        <View style={styles.sectionContent}>
                            <InsightsContent isDark={isDark} />
                        </View>
                    </View>
                </View>

                {/* Tips Section */}
                <View style={styles.section}>
                    <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFF' }]}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionHeaderLeft}>
                                <View style={[styles.sectionIcon, { backgroundColor: '#AF52DE20' }]}>
                                    <Ionicons name="leaf" size={20} color="#AF52DE" />
                                </View>
                                <ThemedText style={styles.sectionTitleText}>Health Tips</ThemedText>
                            </View>
                        </View>
                        <View style={styles.sectionContent}>
                            <TipsContent isDark={isDark} />
                        </View>
                    </View>
                </View>
            </ScrollView>
    </ScreenBackground>
    );
}

// Gauge Styles
const gaugeStyles = StyleSheet.create({
    wrapper: {
        width: 170,
        height: 170,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    svg: {
        position: 'absolute',
    },
    content: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stack: {
        alignItems: 'center',
    },
    value: {
        fontSize: 24,
        fontWeight: '700',
    },
    note: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 4,
        maxWidth: 80,
        color: '#8E8E93',
    },
});

// Main Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    
    // Sections
    section: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sectionWithSpacing: {
        paddingHorizontal: 20,
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 16,
    },
    
    // Biological Age Card
    bioAgeCard: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        minHeight: 220,
    },
    bioAgeLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
    },
    bioAgeValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
    },
    bioAgeValue: {
        fontSize: 48,
        fontWeight: '700',
        lineHeight: 50,
    },
    bioAgeLabel: {
        fontSize: 16,
        color: '#8E8E93',
        marginTop: 0,
    },
    
    // Vitals Row
    vitalsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    summaryCard: {
        flex: 1,
        borderRadius: 12,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        minHeight: 150,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#8E8E93',
    },
    summaryIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryContent: {
        alignItems: 'flex-start',
        width: '100%',
    },
    summaryValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 38,
    },
    summaryUnit: {
        fontSize: 16,
        color: '#8E8E93',
        fontWeight: '500',
        lineHeight: 20,
    },
    summarySubtitle: {
        backgroundColor: '#F2F2F7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'transparent',
        alignSelf: 'stretch',
        marginTop: 4,
    },
    summarySubtitleText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8E8E93',
        flexShrink: 1,
        flexWrap: 'wrap',
        lineHeight: 16,
    },
    
    // Metrics Grid
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    metricCard: {
        width: (width - 52) / 2,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        backgroundColor: 'transparent',
    },
    metricHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    metricIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#8E8E93',
        flex: 1,
    },
    metricValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    metricValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    metricSub: {
        fontSize: 14,
        color: '#8E8E93',
        fontWeight: '500',
    },
    
    // Section Styles (like insights page)
    sectionCard: {
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    sectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sectionIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitleText: {
        fontSize: 18,
        fontWeight: '600',
    },
    sectionContent: {
        padding: 16,
    },
    
    // SmartStack Content
    smartStackContent: {
        // Content styles handled by metricsGrid
    },
    
    // Card Styles
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
    },
    
    // Quick Actions
    quickActionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    quickAction: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    quickActionLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#8E8E93',
        textAlign: 'center',
    },
    
    // Activities Content
    activitiesContent: {
        gap: 8,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 12,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    activityDesc: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 2,
    },
    activityTime: {
        fontSize: 12,
        color: '#8E8E93',
    },
    
    // Insights Content
    insightsContent: {
        gap: 8,
    },
    insightItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 12,
    },
    insightIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    insightContent: {
        flex: 1,
    },
    insightTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    insightDesc: {
        fontSize: 13,
        color: '#8E8E93',
        lineHeight: 16,
    },
    insightMetric: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    insightMetricText: {
        fontSize: 12,
        fontWeight: '700',
    },
    
    // Tips Content
    tipsContent: {
        gap: 8,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 12,
    },
    tipIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    tipDesc: {
        fontSize: 13,
        color: '#8E8E93',
    },
    priorityBadge: {
        backgroundColor: '#FFF3CD',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priorityText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#856404',
    },
});
