import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Dimensions, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { PageHeader } from '@/components/ui/PageHeader';
import Svg, { Circle, Rect, Polyline, Line, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

// --- RESPONSIVE SCALING ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FIGMA_WIDTH = 402;
const scale = (size: number) => (SCREEN_WIDTH / FIGMA_WIDTH) * size;

// --- STABLE MOCK DATA (30 DAYS) ---
const DATA_SETS = {
  bioAge: [31, 31, 30, 30, 29, 29, 30, 30, 31, 30, 29, 29, 28, 29, 30, 30, 31, 30, 30, 29, 30, 30, 29, 29, 30, 30, 30, 29, 30, 30],
  sleep: [72, 75, 80, 65, 85, 90, 88, 82, 78, 85, 89, 92, 70, 75, 80, 85, 88, 90, 85, 82, 89, 88, 90, 92, 85, 80, 88, 89, 89, 89],
  health: [6.8, 6.9, 7.0, 7.0, 7.1, 7.1, 7.2, 7.0, 6.9, 7.0, 7.1, 7.2, 7.3, 7.2, 7.1, 7.0, 7.1, 7.2, 7.2, 7.1, 7.2, 7.3, 7.2, 7.1, 7.2, 7.2, 7.1, 7.2, 7.2, 7.2],
  stress: [5.5, 5.8, 6.0, 6.2, 6.1, 5.9, 6.0, 6.3, 6.5, 6.2, 6.0, 5.8, 6.0, 6.1, 6.2, 6.3, 6.1, 6.0, 6.2, 6.3, 6.4, 6.3, 6.2, 6.1, 6.2, 6.3, 6.2, 6.3, 6.3, 6.3],
  perf: [8.0, 8.1, 8.2, 8.0, 8.3, 8.4, 8.5, 8.3, 8.2, 8.4, 8.5, 8.6, 8.4, 8.3, 8.5, 8.5, 8.4, 8.5, 8.6, 8.5, 8.4, 8.5, 8.6, 8.5, 8.4, 8.5, 8.6, 8.5, 8.5, 8.5],
  burnout: [4.2, 4.1, 4.0, 3.9, 3.8, 3.9, 3.8, 3.7, 3.6, 3.7, 3.8, 3.7, 3.6, 3.5, 3.6, 3.7, 3.8, 3.7, 3.6, 3.7, 3.8, 3.7, 3.6, 3.7, 3.8, 3.7, 3.6, 3.7, 3.7, 3.7]
};

const METRICS_DB = [
  { id: 1, title: "Biological Age", value: "30", percentage: 65, type: 'pie', history: DATA_SETS.bioAge, unit: 'yrs' },
  { id: 2, title: "Sleep Quality", value: "%89", percentage: 22, type: 'heatmap', buttonText: "Get tips to increase\nyour sleep quality!", history: DATA_SETS.sleep, unit: '%' },
  { id: 3, title: "General Health", value: "7.2", percentage: 37, type: 'pie', history: DATA_SETS.health, unit: '/10' },
  { id: 4, title: "Stress", value: "6.3", percentage: 52, type: 'pie', history: DATA_SETS.stress, unit: '/10' },
  { id: 5, title: "Performance", value: "8.5", percentage: 43, type: 'pie', history: DATA_SETS.perf, unit: '/10' },
  { id: 6, title: "Burnout Res.", value: "3.7", percentage: 11, type: 'pie', history: DATA_SETS.burnout, unit: '/10' },
];

// --- TIME RANGE CARD ---
const RANGES = [ { key: "12h", label: "12h" }, { key: "24h", label: "24h" }, { key: "1w", label: "1w" }, { key: "1m", label: "1m" }, { key: "1y", label: "1y" }];
function TimeRangeCard({ activeRange, onRangeChange }: any) {
  return (
      <LinearGradient colors={['#94D4CE', '#DBFFFD']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.greetingCard}>
        <View style={styles.greetingContent}>
          <View style={styles.greetingTextContainer}>
            <Text style={styles.greetingText} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.7}>Hope you are{'\n'}good today.</Text>
          </View>
          <View style={styles.rangeContainer}>
            {RANGES.map((r) => (
                <TouchableOpacity key={r.key} style={[styles.rangeBtn, activeRange === r.key && styles.rangeBtnActive]} onPress={() => onRangeChange(r.key)}>
                  <Text style={[styles.rangeText, activeRange === r.key && styles.rangeTextActive]}>{r.label}</Text>
                </TouchableOpacity>
            ))}
          </View>
        </View>
      </LinearGradient>
  );
}

// --- DROPDOWN HEADER COMPONENT ---
const GRAPH_TYPES = [
  { id: 'overview', label: 'Performance Metrics' },
  { id: 'distribution', label: 'Distribution Analysis' },
  { id: 'trend', label: 'Trend Analysis' },
];

function GraphTypeSelector({ currentType, onSelect }: { currentType: string, onSelect: (t: string) => void }) {
  const [visible, setVisible] = useState(false);
  const currentLabel = GRAPH_TYPES.find(t => t.id === currentType)?.label;

  return (
      <View style={{ zIndex: 100 }}>
        <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setVisible(!visible)}
            activeOpacity={0.7}
        >
          <Text style={styles.sectionTitle}>{currentLabel}</Text>
          <Ionicons name={visible ? "chevron-up" : "chevron-down"} size={scale(20)} color="#434F4D" style={{ marginBottom: scale(22) }} />
        </TouchableOpacity>

        {visible && (
            <View style={styles.dropdownMenu}>
              {GRAPH_TYPES.map((type) => (
                  <TouchableOpacity
                      key={type.id}
                      style={styles.dropdownItem}
                      onPress={() => { onSelect(type.id); setVisible(false); }}
                  >
                    <Text style={[styles.dropdownItemText, currentType === type.id && styles.dropdownItemTextActive]}>{type.label}</Text>
                    {currentType === type.id && <View style={styles.activeDot} />}
                  </TouchableOpacity>
              ))}
            </View>
        )}
      </View>
  );
}

// --- CHART 1: PIE & HEATMAP ---
function MetricPieChart({ percentage }: { percentage: number }) {
  const size = scale(146);
  const strokeWidth = scale(10);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        <Svg width={size} height={size}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#E1E1E1" strokeWidth={strokeWidth} fill="none" />
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#434F4D" strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="butt" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        </Svg>
        <View style={{ position: 'absolute' }}>
          <Text style={styles.chartPercentageText}>%{percentage}</Text>
        </View>
      </View>
  );
}

function SleepHeatmapChart() {
  const width = scale(155);
  const height = scale(105);
  return (
      <View style={{ width: width, height: height, justifyContent: 'center', alignItems: 'center' }}>
        <Svg width="100%" height="100%" viewBox="0 0 188 128" preserveAspectRatio="xMidYMid meet">
          <Rect y="100.174" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/><Rect x="32.1331" y="100.174" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/><Rect x="64.2662" y="100.174" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/><Rect x="96.3994" y="100.174" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/><Rect x="128.533" y="100.174" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/><Rect x="160.666" y="100.174" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/>
          <Rect y="66.7827" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/><Rect x="32.1331" y="66.7827" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/><Rect x="64.2662" y="66.7827" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/><Rect x="96.3994" y="66.7827" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/><Rect x="128.533" y="66.7827" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/><Rect x="160.666" y="66.7827" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/>
          <Rect y="33.3911" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/><Rect x="32.1331" y="33.3911" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/><Rect x="64.2662" y="33.3911" width="26.7776" height="27.8261" rx="4" fill="#2E1DFF"/><Rect x="96.3994" y="33.3911" width="26.7776" height="27.8261" rx="4" fill="#B0AAFF"/><Rect x="128.533" y="33.3911" width="26.7776" height="27.8261" rx="4" fill="#9188FF"/><Rect x="160.666" y="33.3911" width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/>
          <Rect width="26.7776" height="27.8261" rx="4" fill="#D9D9D9"/><Rect x="32.1331" width="26.7776" height="27.8261" rx="4" fill="#B0AAFF"/><Rect x="64.2662" width="26.7776" height="27.8261" rx="4" fill="#9188FF"/><Rect x="96.3994" width="26.7776" height="27.8261" rx="4" fill="#6255FF"/><Rect x="128.533" width="26.7776" height="27.8261" rx="4" fill="#2E1DFF"/><Rect x="160.666" width="26.7776" height="27.8261" rx="4" fill="#B0AAFF"/>
        </Svg>
      </View>
  );
}

// --- CHART 2: DISTRIBUTION BAR CHART ---
function DistributionChart({ history }: { history: number[] }) {
  if (!history || history.length === 0) return null;

  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const bucketCount = 5;
  const bucketSize = range / bucketCount;
  const useDecimals = bucketSize < 1;

  const buckets = Array(bucketCount).fill(0).map((_, i) => {
    const val = min + i * bucketSize;
    return {
      label: useDecimals ? val.toFixed(1) : Math.round(val).toString(),
      count: 0
    };
  });

  history.forEach(val => {
    const index = Math.min(Math.floor((val - min) / bucketSize), bucketCount - 1);
    buckets[index].count++;
  });

  const maxCount = Math.max(...buckets.map(b => b.count));
  const containerHeight = scale(90);

  return (
      <View style={styles.barChartContainer}>
        {buckets.map((bucket, index) => {
          const barHeight = (bucket.count / maxCount) * (containerHeight * 0.7);
          const isMax = bucket.count === maxCount;

          return (
              <View key={index} style={styles.barColumn}>
                {isMax && <Text style={styles.barValueLabel}>{bucket.count}</Text>}
                <View style={[styles.bar, { height: Math.max(barHeight, scale(4)), backgroundColor: isMax ? '#94D4CE' : '#E1E1E1' }]} />
                <Text style={styles.barLabel}>{bucket.label}</Text>
              </View>
          );
        })}
      </View>
  );
}

// --- CHART 3: TREND LINE CHART (Updated) ---
function TrendLineChart({ history, activeRange }: { history: number[], activeRange: string }) {
  if (!history || history.length === 0) return null;

  // 1. FILTER DATA based on active range
  let data = [];
  if (activeRange === '12h' || activeRange === '24h') {
    data = history.slice(-5); // Show last 5 points for very short term
  } else if (activeRange === '1w') {
    data = history.slice(-7); // Last 7 days
  } else if (activeRange === '1m') {
    data = history; // Full 30 days
  } else {
    data = history; // Default to full for 1y (in real app would average)
  }

  // 2. SCALE CALCULATION
  // Reduced height to accommodate min/max labels comfortably
  const width = scale(145);
  const height = scale(80);
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Format Labels (integer or 1 decimal)
  const maxLabel = max % 1 !== 0 ? max.toFixed(1) : max;
  const minLabel = min % 1 !== 0 ? min.toFixed(1) : min;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    // Padding top and bottom (scale(10)) to fit within dashed lines
    const y = height - ((val - min) / range) * (height - scale(20)) - scale(10);
    return `${x},${y}`;
  }).join(' ');

  const startX = 0;
  const startY = height - ((data[0] - min) / range) * (height - scale(20)) - scale(10);
  const endX = width;
  const endY = height - ((data[data.length-1] - min) / range) * (height - scale(20)) - scale(10);

  return (
      <View style={{ width, height, justifyContent: 'center' }}>
        <Svg width={width} height={height} style= {{overflow:"visible"}}>
          {/* Min Dotted Line */}
          <Line x1="0" y1={height - scale(5)} x2={width} y2={height - scale(5)} stroke="#E1E1E1" strokeWidth="1" strokeDasharray="4 2" />
          <SvgText x={0} y={height + scale(8)} fontSize={scale(9)} fill="#B0B0B0">{minLabel}</SvgText>

          {/* Max Dotted Line */}
          <Line x1="0" y1={scale(5)} x2={width} y2={scale(5)} stroke="#E1E1E1" strokeWidth="1" strokeDasharray="4 2" />
          <SvgText x={0} y={0} fontSize={scale(9)} fill="#B0B0B0">{maxLabel}</SvgText>

          {/* Trend Line */}
          <Polyline
              points={points}
              fill="none"
              stroke="#434F4D"
              strokeWidth={scale(2)}
              strokeLinecap="round"
              strokeLinejoin="round"
          />

          {/* Start Dot */}
          <Circle cx={startX} cy={startY} r={scale(3)} fill="#94D4CE" />

          {/* End Dot */}
          <Circle cx={endX} cy={endY} r={scale(3)} fill="#94D4CE" />
        </Svg>
      </View>
  );
}

// --- MAIN METRIC CARD COMPONENT ---
interface MetricCardProps {
  data: any;
  chartView: string;
  activeRange: string; // Passed down for trend filtering
}

function MetricCard({ data, chartView, activeRange }: MetricCardProps) {
  const router = useRouter();

  const renderChart = () => {
    switch (chartView) {
      case 'distribution':
        return <DistributionChart history={data.history} />;
      case 'trend':
        // Pass activeRange here
        return <TrendLineChart history={data.history} activeRange={activeRange} />;
      case 'overview':
      default:
        return data.type === 'heatmap' ? <SleepHeatmapChart /> : <MetricPieChart percentage={data.percentage} />;
    }
  };

  const getDescription = () => {
    switch (chartView) {
      case 'distribution':
        return `Distribution of your ${data.title.toLowerCase()} over the selected time range.`;
      case 'trend':
        return `Trend of your ${data.title.toLowerCase()} for the selected time.`;
      case 'overview':
      default:
        return `Better than %${data.percentage} of people of the same age and gender.`;
    }
  };

  const renderDescription = (text: string) => {
    const parts = text.split(/(%\d+)/g);
    return (
        <Text style={styles.cardDescription}>
          {parts.map((part, index) => {
            if (part.match(/^%\d+$/)) {
              return <Text key={index} style={{ fontWeight: '700' }}>{part}</Text>;
            }
            return <Text key={index}>{part}</Text>;
          })}
        </Text>
    );
  };

  return (
      <View style={styles.metricCard}>
        <View style={styles.cardLeftCol}>
          <Text style={styles.cardTitle}>{data.title}: {data.value}</Text>
          {renderDescription(getDescription())}
          <TouchableOpacity style={styles.tipButton} onPress={() => router.push('/insights')}>
            <Text style={styles.tipButtonText}>{data.buttonText || "Get tips to increase\nyour well-being!"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardRightCol}>
          {renderChart()}
        </View>
      </View>
  );
}

export default function GraphsScreen() {
  const [range, setRange] = useState("24h");
  const [chartView, setChartView] = useState("overview");

  return (
      <ScreenBackground style={styles.container}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <PageHeader title="Graphs" variant="default" />
            <TimeRangeCard activeRange={range} onRangeChange={setRange} />

            <View style={{ marginTop: scale(13), zIndex: 10 }}>
              <GraphTypeSelector currentType={chartView} onSelect={setChartView} />
              <View style={styles.cardsContainer}>
                {METRICS_DB.map((item) => (
                    <MetricCard
                        key={item.id}
                        data={item}
                        chartView={chartView}
                        activeRange={range} // Passing down the range
                    />
                ))}
              </View>
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
    paddingTop: scale(10),
    paddingBottom: scale(110),
    paddingLeft: scale(16),  // Matches the 17px redline
    paddingRight: scale(16), // Matches the 16px redline
  },

  // --- GREETING CARD STYLES ---
  greetingCard: {
    width: '100%',
    height: scale(101),
    borderRadius: scale(20),
    paddingHorizontal: scale(20), // Outer padding for the whole card
    justifyContent: 'center',
    shadowColor: 'rgb(61, 78, 74)',
    shadowOffset: { width: 0, height: scale(8) },
    shadowOpacity: 0.25,
    shadowRadius: scale(13),
    elevation: 6,
  },
  greetingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  // TEXT CONTAINER: Scales proportionally
  greetingTextContainer: {
    flex: 0.45,
    justifyContent: 'center',
    paddingRight: scale(5), // Small buffer between text and bar
    paddingBottom: scale(2), // FIX: Adds space for descenders (g, y, j)
  },
  greetingText: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
    fontSize: scale(22),
    fontWeight: '400',
    color: '#EDEDED',
    lineHeight: scale(32),
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: scale(2) },
    textShadowRadius: scale(11),
  },

  // SELECTOR BAR: Scales proportionally
  rangeContainer: {
    flex: 0.55,
    height: scale(38),
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(4),
  },
  rangeBtn: {
    flex: 1, // Buttons share the bar width equally
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeBtnActive: {
    backgroundColor: '#EDEDED',
    borderRadius: scale(12),
    // Give the active button slightly more weight if needed,
    // or keep flex:1 to prevent shifting
    flex: 1,
    marginHorizontal: scale(2),
    height: scale(28),
  },
  rangeText: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
    fontSize: scale(17),
    fontWeight: '300',
    color: '#FFF',
  },
  rangeTextActive: {
    color: '#A3D1CE',
    fontWeight: '300',
  },

  // --- NEW PERFORMANCE METRICS STYLES ---

  // --- DROPDOWN STYLES ---
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  sectionTitle: {
    fontSize: scale(22),
    fontWeight: '400',
    color: '#434F4D',
    marginBottom: scale(22),
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: scale(3) },
    textShadowRadius: scale(2),
  },
  dropdownMenu: {
    position: 'absolute',
    top: scale(35),
    left: 0,
    backgroundColor: '#FDFDFD',
    borderRadius: scale(12),
    padding: scale(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    width: scale(220),
  },
  dropdownItem: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: scale(14),
    color: '#434F4D',
    fontWeight: '400',
  },
  dropdownItemTextActive: {
    fontWeight: '700',
    color: '#434F4D'
  }, // Updated color to theme dark grey
  activeDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: '#94D4CE' }, // Updated color to theme teal

  cardsContainer: {
    gap: scale(15),
    paddingBottom: scale(20), // Added padding for bottom shadow visibility
  },

  // Metric Card Container
  metricCard: {
    width: '100%',
    height: scale(190),
    backgroundColor: '#F2F2F2',
    borderRadius: scale(11),
    shadowColor: 'rgb(61, 78, 74)',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.15,
    shadowRadius: scale(8),
    elevation: 4,
    flexDirection: 'row',
    padding: scale(12),
  },

  cardLeftCol: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: scale(5),
  },
  cardTitle: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
    fontSize: scale(20),
    fontWeight: '500',
    color: '#434F4D',
  },
  cardDescription: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
    fontSize: scale(13),
    fontWeight: '400',
    color: '#434F4D',
    marginTop: scale(8),
    lineHeight: scale(16),
  },
  tipButton: {
    width: scale(155),
    height: scale(38),
    borderWidth: 1,
    borderColor: '#434F4D',
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(10),
  },
  tipButtonText: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
    fontSize: scale(12),
    fontWeight: '300',
    color: '#434F4D',
    textAlign: 'center',
  },

  cardRightCol: {
    width: scale(165),
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPercentageText: {
    fontSize: scale(38),
    fontWeight: '700',
    color: '#D6D6D6',
    ...Platform.select({ ios: { fontDesign: 'rounded' } }),
  },
  // --- NEW CHART STYLES ---
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    height: scale(100),
    paddingHorizontal: scale(4),
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    width: scale(25), // Fixed width for columns to keep alignment
  },
  bar: {
    width: scale(8),
    borderRadius: scale(4),
    marginBottom: scale(4),
  },
  barLabel: {
    fontSize: scale(10),
    color: '#8E8E93',
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
  },
  barValueLabel: {
    fontSize: scale(9),
    color: '#434F4D',
    marginBottom: scale(2),
    fontWeight: '600'
  }
});










// OLD VERSION
/*import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';
import styles from '../../styles/graphs.styles';

const { width, height } = Dimensions.get('window');

const Graphs: React.FC = () => {
  // Time ranges
  const RANGES = [
    { key: "12h", label: "12h" },
    { key: "24h", label: "24h" },
    { key: "1w", label: "1w" },
    { key: "1m", label: "1m" },
    { key: "1y", label: "1y" },
  ];

  const [range, setRange] = useState("24h");
  const navigation = useNavigation<any>();

  // Scroll
  const pieContainerRef = useRef<ScrollView>(null);
  const barContainerRef = useRef<ScrollView>(null);
  const [pieActive, setPieActive] = useState(0);
  const [barActive, setBarActive] = useState(0);
  const piePages = [0, 1, 2, 3, 4];
  const barPages = [0, 1, 2, 3, 4];

  const pageHeight = height * 0.5;

  const scrollToPieIndex = (index: number) => {
    if (pieContainerRef.current) {
      pieContainerRef.current.scrollTo({ y: index * pageHeight, animated: true });
    }
  };

  const scrollToBarIndex = (index: number) => {
    if (barContainerRef.current) {
      barContainerRef.current.scrollTo({ y: index * pageHeight, animated: true });
    }
  };

  const onPieScroll = (e: any) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / pageHeight);
    setPieActive(index);
  };

  const onBarScroll = (e: any) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / pageHeight);
    setBarActive(index);
  };

  // Heart Rate data
  const pulseData = [
    { hour: '8h', pulse: 75, min: 60, max: 90 },
    { hour: '9h', pulse: 80, min: 65, max: 95 },
    { hour: '4h', pulse: 68, min: 55, max: 85 },
  ];

  // HRV Distribution Data
  const hrvData = [
    { value: 40, count: 2 },
    { value: 45, count: 6 },
    { value: 50, count: 12 },
    { value: 55, count: 20 },
    { value: 60, count: 28 },
    { value: 65, count: 20 },
    { value: 70, count: 10 },
    { value: 75, count: 4 },
  ];

  // Pie Chart Data
  const biologicalAgeData = {
    score: "30",
    name: "Biological Age",
    pieData: [
      { name: "Better than", value: 65 },
      { name: "Worse than", value: 35 },
    ],
  };

  const healthData = {
    score: "7.2/10",
    name: "General Health Score",
    pieData: [
      { name: "Better than", value: 37 },
      { name: "Worse than", value: 63 },
    ],
  };

  const stressData = {
    score: "6.3/10",
    name: "Stress",
    pieData: [
      { name: "Better than", value: 52 },
      { name: "Worse than", value: 48 },
    ],
  };

  const performanceData = {
    score: "8.5/10",
    name: "Performance",
    pieData: [
      { name: "Better than", value: 43 },
      { name: "Worse than", value: 57 },
    ],
  };

  const burnoutData = {
    score: "3.7/10",
    name: "Burnout Resistance",
    pieData: [
      { name: "Better than", value: 11 },
      { name: "Worse than", value: 89 },
    ],
  };

  // Simple Pie Chart Component
  const HRVPie: React.FC<{ data: any[] }> = ({ data }) => {
    const percentage = data[0].value;
    const radius = 50;
    const strokeWidth = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={styles.pieChartContainer}>
        <Svg width={120} height={120}>
          <Circle
            cx={60}
            cy={60}
            r={radius}
            stroke="#CFCFCF"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={60}
            cy={60}
            r={radius}
            stroke="#34C759"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 60 60)`}
          />
          <SvgText
            x={60}
            y={65}
            fontSize={18}
            fontWeight="700"
            fill="#000"
            textAnchor="middle"
          >
            {percentage}%
          </SvgText>
        </Svg>
      </View>
    );
  };

  // Simple Bar Chart Component
  const HRVDistribution: React.FC = () => {
    const maxCount = Math.max(...hrvData.map(d => d.count));

    return (
      <View style={styles.barChartContainer}>
        {hrvData.map((item, index) => {
          const barHeight = (item.count / maxCount) * 100;
          const isHighlighted = item.value === 60;
          
          return (
            <View key={index} style={{ alignItems: 'center', flex: 1 }}>
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: isHighlighted ? '#34C759' : '#CFCFCF',
                  },
                ]}
              />
              <Text style={{ fontSize: 10, marginTop: 2 }}>{item.value}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  // Simple Line Chart Component
  const LineChartComponent: React.FC = () => {
    const chartWidth = Math.max(width * 1.1, 300);
    const chartHeight = 180;
    const padding = 20;
    const maxPulse = Math.max(...pulseData.map(d => Math.max(d.pulse, d.max)));
    const minPulse = Math.min(...pulseData.map(d => Math.min(d.pulse, d.min)));
    const range = maxPulse - minPulse;

    const points = pulseData.map((data, index) => {
      const x = padding + (index / (pulseData.length - 1)) * (chartWidth - 2 * padding);
      const y = padding + (1 - (data.pulse - minPulse) / range) * (chartHeight - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    const minPoints = pulseData.map((data, index) => {
      const x = padding + (index / (pulseData.length - 1)) * (chartWidth - 2 * padding);
      const y = padding + (1 - (data.min - minPulse) / range) * (chartHeight - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    const maxPoints = pulseData.map((data, index) => {
      const x = padding + (index / (pulseData.length - 1)) * (chartWidth - 2 * padding);
      const y = padding + (1 - (data.max - minPulse) / range) * (chartHeight - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    return (
      <View style={styles.lineChartContainer}>
        <Svg width={chartWidth} height={chartHeight}>

          {[...Array(5)].map((_, i) => {
            const y = padding + (i / 4) * (chartHeight - 2 * padding);
            return (
              <Line
                key={i}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="#e0e0e0"
                strokeWidth={1}
              />
            );
          })}
          

          <Polyline
            points={minPoints}
            fill="none"
            stroke="#9ACD32"
            strokeWidth={2}
          />
          

          <Polyline
            points={maxPoints}
            fill="none"
            stroke="#228B22"
            strokeWidth={2}
          />
          

          <Polyline
            points={points}
            fill="none"
            stroke="#34C759"
            strokeWidth={3}
          />


          {pulseData.map((data, index) => {
            const x = padding + (index / (pulseData.length - 1)) * (chartWidth - 2 * padding);
            return (
              <SvgText
                key={index}
                x={x}
                y={chartHeight - 5}
                fontSize={12}
                fill="#666"
                textAnchor="middle"
              >
                {data.hour}
              </SvgText>
            );
          })}
        </Svg>
      </View>
    );
  };

  // Pie Chart Page Component
  const PieChartPage: React.FC<{ data: any }> = ({ data }) => {
    return (
      <>
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text style={styles.topMetric}>
            {data.name}: <Text style={{ fontWeight: '700' }}>{data.score}</Text>
          </Text>
          <View style={{ alignItems: 'center' }}>
            <HRVPie data={data.pieData} />
            <View style={{ marginTop: 20 }} />
            <TouchableOpacity
              style={styles.tipsBtn}
              onPress={() => navigation.navigate('insights')}
            >
              <Text style={styles.tipsBtnText}>
                Get tips to increase{'\n'}your well being!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.bottomMetric}>
          Better than <Text style={{ fontWeight: '700' }}>{data.pieData[0].value}%</Text> of people of the same age and gender.
        </Text>
      </>
    );
  };

  // Bar Chart Page Component  
  const BarChartPage: React.FC<{ data: any }> = ({ data }) => {
    return (
      <>
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text style={styles.topMetric}>
            {data.name}: <Text style={{ fontWeight: '700' }}>{data.score}</Text>
          </Text>
          <View style={[styles.chartBox, styles.chartBoxBar]}>
            <HRVDistribution />
          </View>
        </View>
        <Text style={styles.bottomMetric}>
          HRV Distribution Analysis
        </Text>
      </>
    );
  };

  return (
    <ScrollView style={styles.graphsContainer} showsVerticalScrollIndicator={false}>

      <View style={styles.horizantalTop}>
        <Text style={styles.topLeft}>
        Hope you
        {'\n'}are good
        {'\n'}today!
      </Text>
        <View style={styles.timeRange}>
          <Text style={styles.timeRangeLabel}>Time Range</Text>
          <View style={styles.timeRangeSegmented}>
            {RANGES.map((r) => (
              <TouchableOpacity
                key={r.key}
                style={[
                  styles.timeRangeBtn,
                  range === r.key && styles.timeRangeBtnActive
                ]}
                onPress={() => setRange(r.key)}
              >
                <Text style={[
                  { color: '#666' },
                  range === r.key && { color: '#34C759' }
                ]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>


      <View style={{ marginBottom: 24, position: 'relative' }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>
            Performance Metrics
          </Text>
        </View>
        <ScrollView
          ref={pieContainerRef}
          style={styles.graphsScroll}
          pagingEnabled
          snapToInterval={pageHeight}
          decelerationRate="fast"
          onScroll={onPieScroll}
          scrollEventThrottle={16}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.graphsPage}>
            <Text style={styles.graphHeader}>Biological Age</Text>
            <PieChartPage data={biologicalAgeData} />
          </View>

          <View style={styles.graphsPage}>
            <Text style={styles.graphHeader}>General Health Score</Text>
            <PieChartPage data={healthData} />
          </View>

          <View style={styles.graphsPage}>
            <Text style={styles.graphHeader}>Stress Score</Text>
            <PieChartPage data={stressData} />
          </View>

          <View style={styles.graphsPage}>
            <Text style={styles.graphHeader}>Performance Potential</Text>
            <PieChartPage data={performanceData} />
          </View>

          <View style={styles.graphsPage}>
            <Text style={styles.graphHeader}>Burnout Resistance</Text>
            <PieChartPage data={burnoutData} />
          </View>
        </ScrollView>
        

        <View style={styles.graphsDots}>
          {piePages.map((i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.graphsDot,
                pieActive === i && styles.activeDot
              ]}
              onPress={() => scrollToPieIndex(i)}
            />
          ))}
        </View>
      </View>


      <View style={{ marginBottom: 24, position: 'relative' }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>
            HRV Distribution Analysis
          </Text>
        </View>
        <ScrollView
          ref={barContainerRef}
          style={styles.graphsScroll}
          pagingEnabled
          snapToInterval={pageHeight}
          decelerationRate="fast"
          onScroll={onBarScroll}
          scrollEventThrottle={16}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.graphsPage}>
            <Text style={styles.graphHeader}>Biological Age - HRV</Text>
            <BarChartPage data={biologicalAgeData} />
          </View>

          <View style={styles.graphsPage}>
            <Text style={styles.graphHeader}>Health Score - HRV</Text>
            <BarChartPage data={healthData} />
          </View>

          <View style={styles.graphsPage}>
            <Text style={styles.graphHeader}>Stress - HRV</Text>
            <BarChartPage data={stressData} />
          </View>

          <View style={styles.graphsPage}>
            <Text style={styles.graphHeader}>Performance - HRV</Text>
            <BarChartPage data={performanceData} />
          </View>

          <View style={styles.graphsPage}>
            <Text style={styles.graphHeader}>Burnout - HRV</Text>
            <BarChartPage data={burnoutData} />
          </View>
        </ScrollView>
        

        <View style={styles.graphsDots}>
          {barPages.map((i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.graphsDot,
                barActive === i && styles.activeDot
              ]}
              onPress={() => scrollToBarIndex(i)}
            />
          ))}
        </View>
      </View>


      <View style={styles.pulseCard}>
        <View style={styles.pulseCardInner}>
          <View style={styles.pulseHeader}>
            <Text style={styles.pulseTitle}>Pulse Rate</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={{ width: '100%' }}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            <LineChartComponent />
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

export default Graphs; */
