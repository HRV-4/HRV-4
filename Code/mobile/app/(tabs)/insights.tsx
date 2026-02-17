import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import Svg, { Path, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { PageHeader } from '@/components/ui/PageHeader';

const { width } = Dimensions.get('window');
const WEIGHT_REGULAR = '400';
const WEIGHT_SEMIBOLD = '600';

//DATA
const CHART_DATA = [
  { day: 'Mon', val: 64, active: false },
  { day: 'Tue', val: 90, active: false },
  { day: 'Wed', val: 73, active: false },
  { day: 'Thu', val: 104, active: false },
  { day: 'Fri', val: 85, active: false },
  { day: 'Sat', val: 92, active: false },
  { day: 'Today', val: 113, active: true },
];

//ICONS

function PulseIcon() {
  return (
    <Svg width={24} height={18} viewBox="0 0 24 18" fill="none">
      <Path d="M1 9H5L8 2L12 16L16 6L18 9H23" stroke="#434F4D" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function HeroArrow() {
  return (
    <Svg width={150} height={100} viewBox="0 0 160 100" fill="none">
      <Path
        d="M100.072 7.5H141.214V48.6429"
        stroke="#A7F59E"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M141.214 7.5L83.1 65.6143C82.1387 66.5566 80.8462 67.0844 79.5 67.0844C78.1538 67.0844 76.8614 66.5566 75.9 65.6143L52.2429 41.9571C51.2815 41.0148 49.989 40.487 48.6429 40.487C47.2967 40.487 46.0042 41.0148 45.0429 41.9571L7.5 79.5"
        stroke="#A7F59E"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function WalkIcon() {
  return (
    <Svg width={34} height={31} viewBox="0 0 47 43" fill="none">
      <Path
        d="M13.7083 37.625L19.5833 30.4583M31.3333 37.625L27.4167 30.4583L21.5417 25.0833L23.5 14.3333M23.5 14.3333L15.6667 16.125L11.75 21.5M23.5 14.3333L29.375 19.7083L35.25 21.5M23.5 7.16667C23.5 7.64185 23.7063 8.09756 24.0736 8.43357C24.4408 8.76957 24.939 8.95833 25.4583 8.95833C25.9777 8.95833 26.4758 8.76957 26.8431 8.43357C27.2103 8.09756 27.4167 7.64185 27.4167 7.16667C27.4167 6.69149 27.2103 6.23577 26.8431 5.89977C26.4758 5.56376 25.9777 5.375 25.4583 5.375C24.939 5.375 24.4408 5.56376 24.0736 5.89977C23.7063 6.23577 23.5 6.69149 23.5 7.16667Z"
        stroke="#F2F2F2" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function SleepIcon() {
  return (
    <Svg width={26} height={21} viewBox="0 0 33 26" fill="none">
      <Path
        d="M28.7124 11.12C27.9884 10.7933 27.2061 10.6249 26.4154 10.6256H5.74248C4.95182 10.6248 4.16962 10.7929 3.44549 11.1192C2.42204 11.5793 1.55114 12.336 0.93925 13.2966C0.327359 14.2573 0.000977978 15.3804 0 16.5287V24.7931C0 25.1062 0.121002 25.4065 0.336387 25.6279C0.551772 25.8493 0.843896 25.9737 1.1485 25.9737C1.4531 25.9737 1.74522 25.8493 1.96061 25.6279C2.17599 25.4065 2.29699 25.1062 2.29699 24.7931V24.2028C2.29885 24.0468 2.35995 23.8977 2.46724 23.7875C2.57454 23.6772 2.71952 23.6144 2.87124 23.6124H29.2867C29.4384 23.6144 29.5834 23.6772 29.6907 23.7875C29.7979 23.8977 29.859 24.0468 29.8609 24.2028V24.7931C29.8609 25.1062 29.9819 25.4065 30.1973 25.6279C30.4127 25.8493 30.7048 25.9737 31.0094 25.9737C31.314 25.9737 31.6061 25.8493 31.8215 25.6279C32.0369 25.4065 32.1579 25.1062 32.1579 24.7931V16.5287C32.1568 15.3806 31.8303 14.2576 31.2184 13.2971C30.6066 12.3365 29.7357 11.58 28.7124 11.12ZM24.6927 0H7.46523C6.39913 0 5.37669 0.435353 4.62284 1.21029C3.869 1.98522 3.44549 3.03626 3.44549 4.13218V9.44498C3.44552 9.49071 3.45589 9.53582 3.47579 9.57673C3.49568 9.61764 3.52455 9.65324 3.56012 9.68072C3.59569 9.7082 3.63699 9.7268 3.68075 9.73506C3.72451 9.74332 3.76954 9.74102 3.81229 9.72832C4.43927 9.53982 5.08924 9.4444 5.74248 9.44498H6.04612C6.11699 9.44544 6.18552 9.41894 6.23852 9.37058C6.29153 9.32222 6.32527 9.25542 6.33324 9.18303C6.39588 8.60614 6.66305 8.07318 7.08371 7.68594C7.50437 7.29871 8.04905 7.08432 8.61372 7.08373H12.6335C13.1985 7.08378 13.7437 7.29792 14.1648 7.68521C14.5859 8.0725 14.8534 8.60576 14.9161 9.18303C14.9241 9.25542 14.9578 9.32222 15.0108 9.37058C15.0638 9.41894 15.1323 9.44544 15.2032 9.44498H16.959C17.0299 9.44544 17.0984 9.41894 17.1514 9.37058C17.2044 9.32222 17.2381 9.25542 17.2461 9.18303C17.3087 8.60652 17.5756 8.07387 17.9958 7.68668C18.416 7.29949 18.9601 7.08486 19.5244 7.08373H23.5442C24.1092 7.08378 24.6544 7.29792 25.0755 7.68521C25.4967 8.0725 25.7641 8.60576 25.8268 9.18303C25.8348 9.25542 25.8685 9.32222 25.9215 9.37058C25.9745 9.41894 26.0431 9.44544 26.1139 9.44498H26.4154C27.0687 9.44465 27.7187 9.54032 28.3456 9.72906C28.3884 9.74177 28.4335 9.74407 28.4773 9.73577C28.5211 9.72747 28.5625 9.7088 28.5981 9.68124C28.6336 9.65368 28.6625 9.61798 28.6823 9.57697C28.7022 9.53597 28.7125 9.49078 28.7124 9.44498V4.13218C28.7124 3.03626 28.2889 1.98522 27.5351 1.21029C26.7812 0.435353 25.7588 0 24.6927 0Z"
        fill="#F2F2F2"
      />
    </Svg>
  );
}

function LotusIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 33 33" fill="none">
      <Path d="M16.5 28.46C16.32 28.46 16.16 28.4 16.03 28.28C14.16 26.61 12.67 24.57 11.65 22.29C10.63 20.01 10.1 17.54 10.1 15.04C10.1 12.54 10.63 10.07 11.65 7.79C12.67 5.51 14.16 3.47 16.03 1.8C16.16 1.69 16.32 1.62 16.5 1.62C16.67 1.62 16.84 1.69 16.97 1.8C18.84 3.47 20.33 5.51 21.35 7.79C22.37 10.07 22.9 12.54 22.9 15.04C22.9 17.54 22.37 20.01 21.35 22.29C20.33 24.57 18.84 26.61 16.97 28.28C16.84 28.4 16.67 28.46 16.5 28.46Z" fill="#F2F2F2" />
      <Path d="M15.79 24.28C15.79 20.47 14.39 16.79 11.86 13.93C9.34 11.08 5.86 9.24 2.07 8.77C1.9 8.75 1.72 8.79 1.58 8.89C1.43 8.99 1.33 9.14 1.29 9.32C0.75 11.58 0.72 13.93 1.2 16.2C1.69 18.47 2.67 20.61 4.09 22.45C5.51 24.29 7.31 25.79 9.39 26.85C11.46 27.9 13.74 28.47 16.06 28.53L16.5 28.54C15.99 27.18 15.75 25.73 15.79 24.28Z" fill="#F2F2F2" />
      <Path d="M17.21 24.28C17.21 20.47 18.61 16.79 21.13 13.93C23.66 11.08 27.14 9.24 30.93 8.77C31.1 8.75 31.28 8.79 31.42 8.89C31.57 8.99 31.67 9.14 31.71 9.32C32.25 11.58 32.28 13.93 31.8 16.2C31.31 18.47 30.33 20.61 28.91 22.45C27.49 24.29 25.68 25.79 23.61 26.85C21.54 27.9 19.26 28.47 16.94 28.53L16.5 28.54C17.01 27.18 17.25 25.73 17.21 24.28Z" fill="#F2F2F2" />
      <Path d="M16.5 28.54C16.32 28.54 16.16 28.48 16.02 28.36C14.95 27.4 14.09 26.22 13.5 24.91C12.91 23.59 12.6 22.17 12.6 20.73C12.6 19.28 12.91 17.86 13.5 16.54C14.09 15.23 14.95 14.05 16.02 13.09C16.16 12.97 16.32 12.91 16.5 12.91C16.67 12.91 16.84 12.97 16.97 13.09C18.05 14.05 18.91 15.23 19.5 16.54C20.09 17.86 20.39 19.28 20.39 20.73C20.39 22.17 20.09 23.59 19.5 24.91C18.91 26.22 18.05 27.4 16.97 28.36C16.84 28.48 16.67 28.54 16.5 28.54Z" fill="#F2F2F2" />
      <Path d="M9.26 31.38C8.91 31.38 8.56 31.36 8.2 31.33C6.61 31.18 5.07 30.69 3.69 29.9C2.3 29.12 1.09 28.05 0.14 26.76C0.04 26.62 -0.01 26.45 0 26.27C0.02 26.1 0.1 25.93 0.23 25.82C1.4 24.73 2.79 23.9 4.3 23.39C5.81 22.88 7.42 22.69 9.01 22.84C10.6 22.99 12.14 23.48 13.53 24.26C14.92 25.05 16.13 26.12 17.07 27.41C17.18 27.55 17.22 27.72 17.21 27.9C17.19 28.07 17.11 28.24 16.98 28.35C14.88 30.3 12.12 31.38 9.26 31.38Z" fill="#F2F2F2" />
      <Path d="M16.02 28.35C15.89 28.24 15.81 28.07 15.79 27.9C15.78 27.72 15.82 27.55 15.93 27.41C16.87 26.12 18.08 25.05 19.47 24.26C20.86 23.48 22.4 22.99 23.99 22.84C25.58 22.69 27.19 22.88 28.7 23.39C30.21 23.9 31.6 24.73 32.77 25.82C32.9 25.93 32.98 26.1 33 26.27C33.01 26.45 32.96 26.62 32.86 26.76C31.91 28.05 30.7 29.12 29.31 29.9C27.93 30.69 26.39 31.18 24.8 31.33C24.44 31.36 24.09 31.38 23.74 31.38C20.88 31.38 18.12 30.3 16.02 28.35Z" fill="#F2F2F2" />
    </Svg>
  );
}

//SECTIONS

function HeroCard() {
  return (
    <View style={styles.heroCard}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="heroGrad" cx="19%" cy="50%" rx="104%" ry="104%" gradientUnits="objectBoundingBox">
            <Stop offset="0" stopColor="#12B600" />
            <Stop offset="1" stopColor="#BEFFB7" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" rx="20" fill="url(#heroGrad)" />
      </Svg>
      
      <View style={styles.heroArrowWrap}>
        <HeroArrow />
      </View>

      <View style={styles.heroContent}>
        <ThemedText style={styles.heroTitle}>You are getting better.</ThemedText>
        <ThemedText style={styles.heroSubtitle}>
          Your body is responding{'\n'}well to your routine.
        </ThemedText>
      </View>
    </View>
  );
}

function HRVSection() {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.hrvTitleRow}>
        <PulseIcon />
        <ThemedText style={styles.hrvTitle}>Heart Rate Variability</ThemedText>
      </View>
      <ThemedText style={styles.hrvDesc}>
        Your HRV is above your baseline, indicating good{'\n'}recovery.
      </ThemedText>
      
      <View style={styles.chartWrapper}>
        <ThemedText style={styles.last7DaysLabel}>Last 7 Days : 58</ThemedText>
        
        
        <View style={styles.dashedLineContainer}>
          <Svg width="100%" height="2">
            <Path 
              d="M330 1L0 1" 
              stroke="#87A29F" 
              strokeWidth="0.25"
              strokeDasharray="6.5 6.5"
              opacity={0.3} 
            />
          </Svg>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartRow}>
            {CHART_DATA.map((item, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barContainer}>
                  {item.active && (
                    <View style={styles.valueBubble}>
                      <ThemedText style={styles.valueText}>58</ThemedText>
                    </View>
                  )}
                  {item.active ? (
                    <LinearGradient
                      colors={['#D0EFEC', '#90E2DA']}
                      style={[styles.bar, { height: item.val }]}
                    />
                  ) : (
                    <View style={[styles.bar, { height: item.val, backgroundColor: '#D9D9D9' }]} />
                  )}
                </View>
                <ThemedText style={[styles.dayLabel, item.active && styles.activeDayLabel]}>
                  {item.day}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.baselineContainer}>
        <View style={styles.baselineLine} />
        <View style={styles.baselineBadge}>
          <ThemedText style={styles.baselineText}>Baseline: 52 ms</ThemedText>
        </View>
      </View>
    </View>
  );
}

function QuickActions() {
  const router = useRouter();

  const actions = [
    { label: 'Activity', grad: ['#FFCC00', '#FFE500'], icon: <WalkIcon />, category: 'exercise' },
    { label: 'Sleep', grad: ['#0084FF', '#BBF1FF'], icon: <SleepIcon />, category: 'sleep' },
    { label: 'Meditation', grad: ['#7700FF', '#DFBBFF'], icon: <LotusIcon />, category: 'other' },
  ];

  const handleLog = (category: string) => {
    // Navigate to Activities screen with pre-selected category and open modal
    router.push({
      pathname: '/activities',
      params: { preselectedCategory: category, openModal: 'true' },
    });
  };

  return (
    <View style={styles.quickActionsCard}>
      <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
      <View style={styles.actionsRow}>
        {actions.map((act, i) => (
          <View key={i} style={styles.actionBox}>
            <ThemedText style={styles.actionLabel}>{act.label}</ThemedText>
            <View style={styles.iconCircle}>
              <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
                <Defs>
                  <RadialGradient id={`grad${i}`} cx="50%" cy="50%" rx="50%" ry="50%">
                    <Stop offset="0" stopColor={act.grad[0]} stopOpacity="0.3" />
                    <Stop offset="1" stopColor={act.grad[1]} stopOpacity="0.3" />
                  </RadialGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" rx="19" fill={`url(#grad${i})`} />
              </Svg>
              {act.icon}
            </View>
            <TouchableOpacity style={styles.logButton} onPress={() => handleLog(act.category)}>
              <ThemedText style={styles.logButtonText}>Log</ThemedText>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

//MAIN SCREEN 

export default function InsightsScreen() {
  return (
    <ScreenBackground style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
           <PageHeader title="Insights" variant="default" />
          <HeroCard />
          <HRVSection />
          <QuickActions />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

//STYLES

const CHART_HEIGHT = 130;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 18,paddingTop:10, paddingBottom: 40 },

  // Hero Card
  heroCard: {
    borderRadius: 20, height: 101, flexDirection: 'row', alignItems: 'center',
    marginBottom: 16, marginTop: 0,overflow: 'hidden', elevation: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8,
  },
  heroContent: { flex: 1, zIndex: 1, paddingLeft: 16 },
  heroTitle: { fontSize: 22, color: '#D1EFEC', fontWeight: WEIGHT_REGULAR as any, marginBottom: 4 },
  heroSubtitle: { fontSize: 16, color: 'rgba(209,239,236,0.75)', fontWeight: WEIGHT_REGULAR as any, lineHeight: 18 },
  heroArrowWrap: { 
    position: 'absolute', 
    right: 5, 
    top: 10,
    opacity: 0.4,
    zIndex: 0 
  },

  // HRV Section
  cardContainer: {
    backgroundColor: '#FCFCFC', borderRadius: 20, padding: 18, marginBottom: 16,
    elevation: 4, shadowColor: '#3D4E4A', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 12,
  },
  hrvTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  hrvTitle: { fontSize: 16, fontWeight: WEIGHT_SEMIBOLD as any, color: '#434F4D' },
  hrvDesc: { fontSize: 12, fontWeight: WEIGHT_SEMIBOLD as any, color: 'rgba(67,79,77,0.80)', marginBottom: 12, lineHeight: 20 },
  
  chartWrapper: { position: 'relative', marginTop: 8 },
  last7DaysLabel: { fontSize: 12, fontWeight: WEIGHT_SEMIBOLD as any, color: '#83CEC7', marginBottom: 12 },
  
  dashedLineContainer: { 
    position: 'absolute', 
    top: 20,
    left: 0, 
    right: 0, 
    zIndex: 0 
  },

  chartContainer: { position: 'relative', zIndex: 1 },
  chartRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', height: CHART_HEIGHT, marginBottom: 10,
  },
  barWrapper: { alignItems: 'center', flex: 1 },
  barContainer: { justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: 24, borderRadius: 10 },
  valueBubble: { 
    backgroundColor: '#90E2DA', 
    borderRadius: 10, 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    marginBottom: 4,
    zIndex: 2,
    minWidth: 28,
    alignItems: 'center',
  },
  valueText: { fontSize: 12, color: '#FFF', fontWeight: WEIGHT_SEMIBOLD as any },
  dayLabel: { marginTop: 8, fontSize: 12, color: '#D9D9D9', fontWeight: WEIGHT_SEMIBOLD as any },
  activeDayLabel: { color: '#90E1DA' },

  // Baseline
  baselineContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  baselineLine: { flex: 1, height: 3, backgroundColor: '#E3C937', opacity: 0.35, borderRadius: 1.5 },
  baselineBadge: { marginLeft: 10, backgroundColor: 'rgba(227,201,55,0.13)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  baselineText: { color: '#E3C937', fontSize: 12, fontWeight: WEIGHT_SEMIBOLD as any },

  // Quick Actions
  quickActionsCard: { 
    backgroundColor: '#FCFCFC', borderRadius: 20, padding: 18, marginBottom: 30, 
    elevation: 4, shadowColor: '#3D4E4A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8
  },
  sectionTitle: { fontSize: 16, fontWeight: WEIGHT_SEMIBOLD as any, color: '#434F4D', marginBottom: 14 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  actionBox: { 
    flex: 1, backgroundColor: '#F8F8F8', borderRadius: 20, 
    paddingTop: 12, paddingBottom: 12, alignItems: 'center' 
  },
  actionLabel: { fontSize: 12, fontWeight: WEIGHT_SEMIBOLD as any, color: 'rgba(67,79,77,0.80)', marginBottom: 8 },
  iconCircle: { 
    width: 47, height: 47, borderRadius: 19, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
    overflow: 'hidden'
  },
  logButton: { 
    width: 51, height: 21, backgroundColor: '#E7E7E7', 
    borderRadius: 9, justifyContent: 'center', alignItems: 'center' 
  },
  logButtonText: { fontSize: 12, fontWeight: WEIGHT_SEMIBOLD as any, color: '#FFFFFF' },
});