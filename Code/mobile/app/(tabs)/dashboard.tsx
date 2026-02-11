import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Dimensions, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, G, Defs, ClipPath, Rect, Circle } from 'react-native-svg';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { BioIcon } from '@/components/ui/BioIcon';
import { SleepIcon } from '@/components/ui/SleepIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';

// --- RESPONSIVE SCALING ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FIGMA_WIDTH = 402;
const scale = (size: number) => (SCREEN_WIDTH / FIGMA_WIDTH) * size;

// --- ICONS ---

function HeartRateIcon({ color = "#434F4D" }) {
    return (
        <Svg width={scale(13)} height={scale(13)} viewBox="0 0 13 13" fill="none">
            <Path d="M3.59912 5.58283H4.95903L5.61397 4.27637L6.87309 6.81589L7.83725 5.58276H9.15461" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M6.22448 1.55977L6.50003 1.85707L6.77552 1.55977C8.08512 0.146742 10.2083 0.146742 11.5178 1.55977C12.8274 2.9728 12.8274 5.26378 11.5178 6.67683L6.50003 12.0911L1.48217 6.67683C0.172611 5.26378 0.172611 2.9728 1.48217 1.55977C2.79172 0.146742 4.91493 0.146742 6.22448 1.55977Z" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    );
}

function BrainIcon({ color = "#434F4D" }) {
    return (
        <Svg width={scale(12)} height={scale(11)} viewBox="0 0 12 11" fill="none">
            {/* Top Left Detail */}
            <Path d="M4.791 7.80637C4.791 7.42773 4.62695 7.06459 4.33491 6.79681C4.04288 6.52903 3.64678 6.37853 3.23371 6.37842C3.20832 6.37842 3.1858 6.38413 3.1604 6.38545" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>

            {/* Left Hemisphere Main */}
            <Path d="M4.62905 2.1567C4.79624 2.10503 4.94462 2.01205 5.05784 1.88801C5.17106 1.76397 5.24473 1.61369 5.27073 1.45372C5.29673 1.29376 5.27405 1.13032 5.20519 0.981412C5.13633 0.832508 5.02396 0.703919 4.88046 0.609815C4.73697 0.515712 4.56792 0.459747 4.39195 0.448087C4.21597 0.436427 4.0399 0.469525 3.88314 0.543734C3.72637 0.617943 3.595 0.730382 3.50349 0.868661C3.41198 1.00694 3.3639 1.16569 3.36453 1.32742C3.36584 1.40685 3.3789 1.48576 3.40334 1.56197C3.35016 1.55802 3.29889 1.54704 3.24474 1.54704C2.90921 1.54547 2.57998 1.63047 2.29466 1.79231C2.00934 1.95415 1.77944 2.1863 1.63125 2.46226C1.48306 2.7382 1.42255 3.0468 1.45664 3.35278C1.49072 3.65875 1.61803 3.94977 1.82401 4.19256C1.46179 4.21451 1.12222 4.36188 0.874144 4.60482C0.626066 4.84775 0.488037 5.16806 0.488037 5.50082C0.488037 5.83358 0.626066 6.1539 0.874144 6.39683C1.12222 6.63976 1.46179 6.78714 1.82401 6.80909C1.61826 7.05184 1.49115 7.34275 1.45719 7.64858C1.42323 7.95441 1.4838 8.26283 1.63198 8.53861C1.78015 8.81438 2.00996 9.04639 2.29514 9.20813C2.58032 9.36988 2.90939 9.45483 3.24474 9.45329C3.29889 9.45329 3.35016 9.44319 3.40334 9.43879C3.3523 9.60431 3.35539 9.77991 3.41222 9.94383C3.46905 10.1077 3.57712 10.2528 3.72303 10.3609C3.86894 10.469 4.04627 10.5355 4.23303 10.5521C4.41979 10.5687 4.60775 10.5347 4.77361 10.4543C4.93947 10.3739 5.07593 10.2506 5.16606 10.0997C5.25619 9.94889 5.29603 9.77711 5.28064 9.60569C5.26525 9.43427 5.1953 9.27077 5.07947 9.13546C4.96364 9.00015 4.80703 8.89898 4.62905 8.84451" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>

            {/* Left Inner Line */}
            <Path d="M3.1604 4.61526C3.18532 4.61526 3.20832 4.62185 3.23371 4.62185C3.64669 4.62174 4.04272 4.4713 4.33474 4.20361C4.62677 3.93593 4.79088 3.5729 4.791 3.19434" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>

            {/* Top Right Detail */}
            <Path d="M7.20898 7.80637C7.20898 7.42773 7.37304 7.06459 7.66508 6.79681C7.95711 6.52903 8.35321 6.37853 8.76628 6.37842C8.79167 6.37842 8.81419 6.38413 8.83959 6.38545" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>

            {/* Right Hemisphere Main */}
            <Path d="M7.37089 2.1567C7.2037 2.10503 7.05532 2.01205 6.9421 1.88801C6.82888 1.76397 6.75521 1.61369 6.72921 1.45372C6.70321 1.29376 6.72589 1.13032 6.79475 0.981412C6.86361 0.832508 6.97598 0.703919 7.11947 0.609815C7.26297 0.515712 7.43201 0.459747 7.60799 0.448087C7.78396 0.436427 7.96004 0.469525 8.1168 0.543734C8.27357 0.617943 8.40494 0.730382 8.49645 0.868661C8.58795 1.00694 8.63604 1.16569 8.63541 1.32742C8.6341 1.40685 8.62104 1.48576 8.59659 1.56197C8.64978 1.55758 8.70105 1.54704 8.7552 1.54704C9.09064 1.54554 9.41978 1.63055 9.70502 1.79238C9.99025 1.9542 10.2201 2.1863 10.3683 2.46216C10.5164 2.73803 10.577 3.04654 10.543 3.35245C10.509 3.65835 10.3818 3.94932 10.1759 4.19212C10.5381 4.21407 10.8777 4.36145 11.1258 4.60438C11.3739 4.84731 11.5119 5.16762 11.5119 5.50038C11.5119 5.83314 11.3739 6.15346 11.1258 6.39639C10.8777 6.63932 10.5381 6.7867 10.1759 6.80865C10.3818 7.0514 10.509 7.34235 10.5431 7.64825C10.5771 7.95415 10.5166 8.26266 10.3684 8.53851C10.2202 8.81436 9.99033 9.04643 9.70506 9.2082C9.41979 9.36996 9.09063 9.4549 8.7552 9.45329C8.70105 9.45329 8.64978 9.44319 8.59659 9.43879C8.64763 9.60431 8.64455 9.77991 8.58772 9.94383C8.53089 10.1077 8.42282 10.2528 8.27691 10.3609C8.13099 10.469 7.95366 10.5355 7.76691 10.5521C7.58015 10.5687 7.39219 10.5347 7.22633 10.4543C7.06047 10.3739 6.92401 10.2506 6.83387 10.0997C6.74374 9.94889 6.7039 9.77711 6.7193 9.60569C6.73469 9.43427 6.80464 9.27077 6.92047 9.13546C7.0363 9.00015 7.19291 8.89898 7.37089 8.84451" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>

            {/* Right Inner Line */}
            <Path d="M8.83959 4.61526C8.81467 4.61526 8.79167 4.62185 8.76628 4.62185C8.3533 4.62174 7.95727 4.4713 7.66524 4.20361C7.37322 3.93593 7.20911 3.5729 7.20898 3.19434" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>

            {/* Center Top Curve */}
            <Path d="M5.28125 0.283473C5.49978 0.16782 5.74767 0.106934 6 0.106934C6.25233 0.106934 6.50022 0.16782 6.71875 0.283473" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>

            {/* Center Vertical Line */}
            <Path d="M6 3.3042V7.91618" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    );
}

function PersonIcon({ color = "#434F4D" }) {
    return (
        <Svg width={scale(10)} height={scale(13)} viewBox="0 0 10 13" fill="none">
            <G transform="translate(3, 0)">
                <Path d="M2 3.5C2.82843 3.5 3.5 2.82843 3.5 2C3.5 1.17157 2.82843 0.5 2 0.5C1.17157 0.5 0.5 1.17157 0.5 2C0.5 2.82843 1.17157 3.5 2 3.5Z" stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </G>
            <G transform="translate(0, 3)">
                <Path d="M6.0526 7.01534L5.00366 4.95761L3.95472 7.01534C3.81169 7.29777 3.43025 7.49951 3.0965 7.49951C2.95346 7.49951 2.81042 7.45916 2.71507 7.41882C2.23827 7.21708 2.04756 6.77325 2.23827 6.36978L3.71633 3.46475V2.94023L1.09397 2.05258C0.617183 1.89119 0.378782 1.44737 0.569499 1.04389C0.773494 0.612325 1.28545 0.382444 1.80916 0.559715C2.33288 0.736991 3.19186 1.04389 4.09776 1.32632C4.39146 1.42988 4.69775 1.48028 5.00366 1.47752C5.30962 1.48028 5.61586 1.42988 5.90957 1.32632C6.81547 1.04389 7.67446 0.736991 8.19817 0.559715C8.72187 0.382444 9.23385 0.612325 9.43782 1.04389C9.62854 1.44737 9.39015 1.89119 8.91335 2.05258L6.291 2.94023V3.46475L7.76905 6.36978C7.95977 6.77325 7.76905 7.21708 7.29226 7.41882C7.1969 7.45916 7.05387 7.49951 6.91083 7.49951C6.57707 7.49951 6.19564 7.29777 6.0526 7.01534Z" stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </G>
        </Svg>
    );
}

function LightningIcon({ color = "#434F4D" }) {
    return (
        <Svg width={scale(14)} height={scale(14)} viewBox="0 0 14 14" fill="none">
            <Path d="M8 0.5V5.5H11.5L6 13.5V8.5H2.5L8 0.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    );
}

// --- NEW ARROW ICON (Scaled) ---
function TrendArrowIcon({ opacity = 1 }: { opacity?: number }) {
    return (
        // Applied opacity directly to the Svg container style
        <Svg width={scale(51)} height={scale(30)} viewBox="0 0 51 30" fill="none" style={{ opacity }}>
            <Path d="M33.8572 3H47.5715V16.7143" stroke="#F3F3F3" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M47.5714 3L28.2 22.3714C27.8796 22.6855 27.4487 22.8615 27 22.8615C26.5513 22.8615 26.1205 22.6855 25.8 22.3714L17.9143 14.4857C17.5938 14.1716 17.163 13.9957 16.7143 13.9957C16.2656 13.9957 15.8347 14.1716 15.5143 14.4857L3 27" stroke="#F3F3F3" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    );
}

// --- GRAPHS ---

function HeartRateGraph() {
    return (
        <Svg width={scale(75)} height={scale(29)} viewBox="0 0 75 29" fill="none">
            <Rect width="3" height="25.4848" rx="1.5" fill="#FF9DAB" />
            <Rect x="18" width="3" height="25.4848" rx="1.5" fill="#FF9DAB" />
            <Rect x="54" width="3" height="25.4848" rx="1.5" fill="#FF9DAB" />
            <Rect x="36" width="3" height="25.4848" rx="1.5" fill="#FF9DAB" />
            <Rect x="72" width="3" height="25.4848" rx="1.5" fill="#FF9DAB" />
            <Rect x="6" y="3.51514" width="3" height="25.4848" rx="1.5" fill="#D9D9D9" />
            <Rect x="42" y="3.51514" width="3" height="25.4848" rx="1.5" fill="#D9D9D9" />
            <Rect x="24" y="3.51514" width="3" height="25.4848" rx="1.5" fill="#D9D9D9" />
            <Rect x="60" y="3.51514" width="3" height="25.4848" rx="1.5" fill="#D9D9D9" />
            <Rect x="12" y="3.51514" width="3" height="25.4848" rx="1.5" fill="#D9D9D9" />
            <Rect x="48" y="3.51514" width="3" height="25.4848" rx="1.5" fill="#D9D9D9" />
            <Rect x="30" y="3.51514" width="3" height="25.4848" rx="1.5" fill="#D9D9D9" />
            <Rect x="66" y="3.51514" width="3" height="25.4848" rx="1.5" fill="#D9D9D9" />
        </Svg>
    );
}

// ... SleepHeatmap & BioGraph remain unchanged ...
function SleepHeatmap() {
    const gridData = [
        ['#D9D9D9', '#B0AAFF', '#9188FF', '#6255FF', '#2E1DFF', '#B0AAFF'],
        ['#D9D9D9', '#D9D9D9', '#2E1DFF', '#B0AAFF', '#9188FF', '#D9D9D9'],
        ['#D9D9D9', '#D9D9D9', '#D9D9D9', '#D9D9D9', '#D9D9D9', '#D9D9D9'],
        ['#D9D9D9', '#D9D9D9', '#D9D9D9', '#D9D9D9', '#D9D9D9', '#D9D9D9']
    ];

    return (
        <View style={styles.heatmapContainer}>
            {gridData.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.heatmapRow}>
                    {row.map((color, colIndex) => {
                        const isShort = rowIndex === 3 && colIndex >= 4;
                        return (
                            <View
                                key={colIndex}
                                style={[
                                    styles.heatmapSquare,
                                    {
                                        backgroundColor: color,
                                        height: isShort ? scale(7) : scale(20),
                                    }
                                ]}
                            />
                        );
                    })}
                </View>
            ))}
            <Text style={styles.mapQualityText}>Quality</Text>
        </View>
    );
}

function BioGraph({ percentage = 40 }: { percentage: number }) {
    const size = scale(92);
    const radius = size / 2;
    const strokeWidth = scale(6);
    const circumference = 2 * Math.PI * (radius - strokeWidth / 2);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={size} height={size}>
                <Circle cx={radius} cy={radius} r={radius - strokeWidth / 2} stroke="#E1E1E1" strokeWidth={strokeWidth} fill="none" />
                <Circle cx={radius} cy={radius} r={radius - strokeWidth / 2} stroke="#AFF4EE" strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform={`rotate(-90 ${radius} ${radius})`} />
            </Svg>
            <View style={styles.graphTextContainer}>
                <Text style={styles.graphMainText}>%{percentage} better</Text>
                <Text style={styles.graphSubText}>than your age</Text>
            </View>
        </View>
    );
}

// --- NEW REUSABLE COMPONENTS FOR WIDGETS ---

interface WidgetProps {
    title: string;
    height?: number; // Optional height, defaults to Insights height if not set
    onPress?: () => void; // Added onPress
    children?: React.ReactNode;
}

function DashboardWidget({ title, height, onPress, children }: WidgetProps) {
    // If onPress is provided, wrap in TouchableOpacity, otherwise View
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            style={[styles.widgetContainer, height ? { height } : {}]}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <Text style={styles.widgetTitle}>{title}</Text>
            {children}
        </Container>
    );
}

// --- ACTIVITY CARD COMPONENT ---
interface ActivityCardProps {
    title: string;
    time: string;
    duration: string;
    iconColor?: string;
}

function ActivityCard({ title, time, duration, iconColor = "#EEE" }: ActivityCardProps) {
    return (
        <View style={styles.activityCard}>
            {/* Left Column: Text Stack */}
            <View style={styles.activityTextCol}>
                <Text
                    style={styles.activityTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
                <View>
                    <Text style={styles.activityTime} numberOfLines={1}>{time}</Text>
                    <Text style={styles.activityDuration} numberOfLines={1}>{duration}</Text>
                </View>
            </View>

            {/* Right Column: Icon Placeholder */}
            <View style={styles.activityIconCol}>
                <View style={[styles.activityIconPlaceholder, { backgroundColor: iconColor }]} />
            </View>
        </View>
    );
}

function AddActivityButton() {
    return (
        <View style={styles.addActivityBtn}>
            <Svg width={scale(9)} height={scale(9)} viewBox="0 0 9 9" fill="none">
                <Path d="M4.5 0V9M0 4.5H9" stroke="rgba(106, 116, 114, 0.54)" strokeWidth="2.0" strokeLinecap="round"/>
            </Svg>
        </View>
    );
}

// --- NEW HEALTH TIP CARD ---
interface HealthTipCardProps {
    title: string;
    body: string;
}

function HealthTipCard({ title, body }: HealthTipCardProps) {
    return (
        <View style={styles.healthTipCard}>
            <Text style={styles.healthTipTitle}>{title}</Text>
            <Text style={styles.healthTipBody}>{body}</Text>
        </View>
    );
}

export default function DashboardScreen() {
    const router = useRouter();
    const bioPercentage = 40;

    return (
        <ScreenBackground style={styles.container}>
            <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* --- REUSABLE HEADER (Dashboard Variant) --- */}
                    <PageHeader title="Hello Buse," variant="dashboard" />

                    <TouchableOpacity
                        style={styles.bigWidget}
                        onPress={() => router.push('/graphs')}
                        activeOpacity={0.9} // Subtle press effect for large cards
                    >

                        {/* TOP ROW */}
                        <View style={styles.bigWidgetTopRow}>
                            <View style={styles.innerCard}>
                                <View style={styles.cardHeader}>
                                    <View style={{ transform: [{ scale: scale(1) }] }}>
                                        <BioIcon />
                                    </View>
                                    <Text style={styles.cardTitle}>Biological Age</Text>
                                </View>
                                <View style={styles.bioContent}>
                                    <View style={styles.bioTextContainer}>
                                        <Text style={styles.bioValue}>30</Text>
                                        <Text style={styles.bioUnit}>years</Text>
                                    </View>
                                    <BioGraph percentage={bioPercentage} />
                                </View>
                            </View>

                            <View style={styles.innerCard}>
                                <View style={styles.cardHeader}>
                                    <View style={{ transform: [{ scale: scale(1) }] }}>
                                        <SleepIcon />
                                    </View>
                                    <Text style={styles.cardTitle}>Sleep</Text>
                                </View>
                                <SleepHeatmap />
                                <View style={styles.sleepFooter}>
                                    <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                                        <Text style={styles.sleepValue}>7.20</Text>
                                        <Text style={styles.sleepUnit}>hr</Text>
                                    </View>
                                    <Text style={styles.sleepQuality}>%89</Text>
                                </View>
                            </View>
                        </View>

                        {/* BOTTOM ROW */}
                        <View style={styles.bigWidgetBottomRow}>

                            {/* 1. Avg Heart Rate */}
                            <View style={styles.statCard}>
                                <View style={styles.statHeader}>
                                    <HeartRateIcon />
                                    <Text style={styles.statTitle}>Avg.{'\n'}Heart Rate</Text>
                                </View>

                                <View style={styles.hrGraphPosition}>
                                    <HeartRateGraph />
                                </View>

                                {/* UPDATED: Positioned absolute bottom-right */}
                                <View style={styles.hrValueContainer}>
                                    <Text style={styles.msLabel}>ms</Text>
                                    <Text style={styles.hrValue}>99</Text>
                                </View>
                            </View>

                            {/* 2. Burnout Res. */}
                            <View style={styles.statCard}>
                                <View style={styles.statHeader}>
                                    <BrainIcon />
                                    <Text style={styles.statTitle}>Burnout{'\n'}Res.</Text>
                                </View>
                                <View style={styles.statContent}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={styles.statValue}>8.2</Text>
                                        <Text style={styles.statValueUnit}>/10</Text>
                                    </View>
                                </View>
                            </View>

                            {/* 3. Per. Potential */}
                            <View style={styles.statCard}>
                                <View style={styles.statHeader}>
                                    <PersonIcon />
                                    <Text style={styles.statTitle}>Per.{'\n'}Potential</Text>
                                </View>
                                <View style={styles.statContent}>
                                    <Text style={styles.statValue}>%94</Text>
                                </View>
                            </View>

                            {/* 4. Regen Score */}
                            <View style={styles.statCard}>
                                <View style={styles.statHeader}>
                                    <LightningIcon />
                                    <Text style={styles.statTitle}>Regen.{'\n'}Score</Text>
                                </View>
                                <View style={styles.statContent}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={styles.statValue}>7.5</Text>
                                        <Text style={styles.statValueUnit}>/10</Text>
                                    </View>
                                </View>
                            </View>

                        </View>

                    </TouchableOpacity>

                    {/* --- NEW WIDGETS SECTION --- */}
                    <View style={{ gap: scale(10), marginTop: scale(10) }}>

                        {/* 1. Insights Widget */}
                        <DashboardWidget title="Insights" onPress={() => router.push('/insights')}>
                            <View style={styles.insightsRow}>

                                {/* Recovery Improving Card */}
                                <LinearGradient
                                    colors={['#F2F2F2', '#BDE3C6']}
                                    locations={[0.60, 1.0]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.insightCard}
                                >
                                    <View style={styles.insightArrow}>
                                        {/* UPDATED OPACITY: Darker than before, but still inactive */}
                                        <TrendArrowIcon opacity={1.0} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.insightCardTitle}>Recovery Improving</Text>
                                        <Text style={styles.insightCardBody}>
                                            Your HRV has increased by 11.5 % compared to your baseline.
                                        </Text>
                                    </View>

                                </LinearGradient>

                                {/* Sleep Quality Impact */}
                                <LinearGradient
                                    colors={['#F2F2F2', '#EBD6FF']}
                                    locations={[0.60, 1.0]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.insightCard}
                                >
                                    <View style={styles.insightArrow}>
                                        {/* UPDATED OPACITY: Softens the solid #F3F3F3 */}
                                        <TrendArrowIcon opacity={1.0} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.insightCardTitle}>Sleep Quality Impact</Text>
                                        <Text style={styles.insightCardBody}>
                                            Your HRV is highest after nights with 7+ hours of sleep.
                                        </Text>
                                    </View>

                                </LinearGradient>

                            </View>
                        </DashboardWidget>

                        {/* 2. Activities Widget */}
                        <DashboardWidget title="Activities" onPress={() => router.push('/activities')}>
                            <View style={styles.activitiesRow}>
                                {/* Activity 1: Morning Run */}
                                <ActivityCard
                                    title="Morning Run"
                                    time="8:30 AM"
                                    duration="32 min"
                                    iconColor="#FDE68A" // Yellow placeholder
                                />

                                {/* Activity 2: Meditation */}
                                <ActivityCard
                                    title="Meditation"
                                    time="12:00 PM"
                                    duration="15 min"
                                    iconColor="#BAE6FD" // Blue placeholder
                                />

                                {/* Activity 3: Sleep */}
                                <ActivityCard
                                    title="Sleep"
                                    time="10:30 PM"
                                    duration="7h 20m"
                                    iconColor="#E9D5FF" // Purple placeholder
                                />

                                {/* Add Button */}
                                <AddActivityButton />
                            </View>
                        </DashboardWidget>

                        {/* 3. HEALTH TIPS WIDGET */}
                        <DashboardWidget title="Health Tips" onPress={() => router.push('/insights')}>
                            <View style={styles.activitiesRow}>
                                <HealthTipCard
                                    title="Prioritize Rest"
                                    body="Your body needs recovery time"
                                />
                                <HealthTipCard
                                    title="Stay Hydrated"
                                    body="Aim for 3 liters today"
                                />
                                <HealthTipCard
                                    title="Avoid Screens"
                                    body="Screen-free 3 hours"
                                />
                            </View>
                        </DashboardWidget>

                    </View>

                </ScrollView>
            </SafeAreaView>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: {
        paddingHorizontal: scale(18),
        paddingTop: scale(10),
        paddingBottom: scale(110),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(20),
        paddingHorizontal: scale(4),
    },
    greeting: {
        color: '#434F4D',
        fontSize: scale(22),
        fontWeight: '700',
        lineHeight: scale(41),
        fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: scale(2) },
        textShadowRadius: scale(11),
        fontVariant: ['no-common-ligatures'],
    },

    bigWidget: {
        width: '100%',
        height: scale(297),
        backgroundColor: '#FDFDFD',
        borderRadius: scale(20),
        alignSelf: 'center',
        shadowColor: 'rgb(61, 78, 74)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: scale(13),
        elevation: 5,
        padding: scale(13),
        justifyContent: 'space-between'
    },

    bigWidgetTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: scale(13),
        height: scale(173),
    },

    innerCard: {
        flex: 1,
        height: '100%',
        backgroundColor: '#F2F2F2',
        borderRadius: scale(11),
        padding: scale(12),
        justifyContent: 'space-between'
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    cardTitle: {
        color: '#434F4D',
        fontSize: scale(14),
        fontWeight: '600',
        fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },

    // Bio
    bioContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(15),
    },
    bioTextContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: scale(5),
    },
    bioValue: {
        fontSize: scale(22),
        fontWeight: '700',
        color: '#98D4CE',
        fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },
    bioUnit: {
        fontSize: scale(10),
        fontWeight: '700',
        color: '#434F4D',
        marginTop: scale(2),
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },

    graphTextContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '65%',
    },
    graphMainText: {
        fontSize: scale(10),
        color: '#BCBCBC',
        fontWeight: '700',
        textAlign: 'center',
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },
    graphSubText: {
        fontSize: scale(10),
        color: '#BCBCBC',
        textAlign: 'center',
        fontWeight: '700',
        marginTop: scale(1),
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },

    // Heatmap
    heatmapContainer: {
        width: '100%',
        height: scale(92),
        justifyContent: 'space-between',
        marginTop: scale(2),
        position: 'relative',
    },
    heatmapRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heatmapSquare: {
        width: scale(20),
        height: scale(20),
        borderRadius: scale(4),
    },
    mapQualityText: {
        position: 'absolute',
        bottom: scale(1),
        right: 0,
        width: scale(45),
        textAlign: 'center',
        fontSize: scale(11),
        fontWeight: '700',
        color: '#D9D9D9',
        letterSpacing: 0.5,
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },

    sleepFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: scale(2),
    },
    sleepValue: {
        fontSize: scale(22),
        fontWeight: '700',
        color: '#B0AAFF',
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },
    sleepUnit: {
        fontSize: scale(10),
        fontWeight: '700',
        color: '#D9D9D9',
        marginLeft: scale(2),
        marginBottom: scale(3),
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },
    sleepQuality: {
        fontSize: scale(20),
        fontWeight: '700',
        color: '#2E1DFF',
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },

    // --- BOTTOM ROW STYLES ---
    bigWidgetBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: scale(9),
        height: scale(86),
    },

    statCard: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        borderRadius: scale(12),
        // REDUCED PADDING to fit the 75px graph
        paddingHorizontal: scale(2),
        paddingVertical: scale(8),
        justifyContent: 'space-between',
    },

    statHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: scale(4),
        paddingHorizontal: scale(2), // Re-add padding for text clarity
    },
    statTitle: {
        fontSize: scale(9),
        fontWeight: '600',
        color: '#434F4D',
        lineHeight: scale(11),
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },

    // Heart Rate Specifics
    hrGraphPosition: {
        position: 'absolute',
        top: scale(36), //
        left: 0,
        right: 0,
        alignItems: 'center', // Center graph in card
    },
    // UPDATED: Absolute position for "ms 99"
    hrValueContainer: {
        position: 'absolute',
        bottom: scale(3),
        right: scale(4),
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    msLabel: {
        fontSize: scale(9),
        fontWeight: '600',
        color: '#848484',
        marginRight: scale(2),
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },
    hrValue: {
        fontSize: scale(15),
        fontWeight: '700',
        color: '#434F4D',
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },

    // General Stats
    statContent: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 1,
        paddingRight: scale(4), // Alignment buffer
    },
    statValue: {
        fontSize: scale(27),
        fontWeight: '700',
        color: '#434F4D',
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },
    statValueUnit: {
        fontSize: scale(15),
        fontWeight: '600',
        color: '#8F8F8F',
        marginLeft: scale(1),
        marginBottom: scale(3),
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },
    // --- NEW WIDGET STYLES ---
    widgetContainer: {
        width: '100%',
        backgroundColor: '#FDFDFD',
        borderRadius: scale(20),
        shadowColor: 'rgb(61, 78, 74)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: scale(13),
        elevation: 5,
        paddingHorizontal: scale(17), // Padding for title alignment
        paddingTop: scale(15),
        paddingBottom: scale(15),
    },
    widgetTitle: {
        color: '#434F4D', //
        fontSize: scale(16),
        fontWeight: '600',
        fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
        marginBottom: scale(10), // Spacing between title and content
    },
    // --- INSIGHTS STYLES (Fixed) ---
    insightsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: scale(7),
    },
    insightCard: {
        flex: 1,
        height: scale(56),
        borderRadius: scale(14),
        // Precise Redline Paddings
        paddingTop: scale(13),
        paddingLeft: scale(8),
        paddingRight: scale(8),
        paddingBottom: scale(8),
        flexDirection: 'row',
        position: 'relative',
        overflow: 'hidden',
    },
    insightCardTitle: {
        fontSize: scale(9),
        fontWeight: '600',
        color: '#434F4D',
        marginBottom: scale(3), // Gap
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },
    insightCardBody: {
        fontSize: scale(8),
        fontWeight: '600',
        color: 'rgba(67, 79, 77, 0.71)',
        lineHeight: scale(10),
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },
    insightArrow: {
        position: 'absolute',
        right: scale(12), // Positioned away from edge
        bottom: scale(8), // Positioned away from edge
    },
    // --- ACTIVITIES STYLES ---
    activitiesRow: {
        flexDirection: 'row',
        gap: scale(6), // Gap between items
    },
    activityCard: {
        flex: 1, // Equal width for cards
        height: scale(56),
        backgroundColor: '#F2F2F2',
        borderRadius: scale(14),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(8),
        justifyContent: 'space-between', // Pushes icon to right
    },
    activityTextCol: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        paddingVertical: scale(6),
        gap: scale(1), // Add gap between title and bottom text
    },
    activityTitle: {
        fontSize: scale(9),
        fontWeight:'600',
        color: '#434F4D',
        marginBottom: scale(1),
    },
    activityTime: {
        fontSize: scale(10), //
        fontWeight: '700',
        color: '#6A7472',
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },
    activityDuration: {
        fontSize: scale(12), //
        fontWeight: '700',
        color: '#434F4D',
        ...Platform.select({ ios: { fontDesign: 'rounded' } }),
    },
    activityIconCol: {
        width: scale(30),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityIconPlaceholder: {
        width: scale(24),
        height: scale(24),
        borderRadius: scale(12),
    },
    addActivityBtn: {
        width: scale(20), //
        height: scale(20),
        borderRadius: scale(7),
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    // --- HEALTH TIPS STYLES ---
    healthTipCard: {
        flex: 1, // Proportional scaling
        height: scale(56), // Matches Activity Card height
        backgroundColor: '#F2F2F2', // Light grey
        borderRadius: scale(14),
        // Padding from and
        paddingTop: scale(7),
        paddingLeft: scale(8),
        paddingRight: scale(8),
        paddingBottom: scale(4),
        justifyContent: 'flex-start',
    },
    healthTipTitle: {
        //
        fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }), // Standard SF Pro
        fontSize: scale(9),
        fontWeight: '600',
        color: '#434F4D',
        marginBottom: scale(3), // Gap
    },
    healthTipBody: {
        //
        fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }), // Standard SF Pro
        fontSize: scale(8),
        fontWeight: '600',
        color: 'rgba(67, 79, 77, 0.71)',
        lineHeight: scale(10),
    }
});