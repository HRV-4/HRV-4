import { useNavigation } from '@react-navigation/native';
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
          {/* Grid lines */}
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
          
          {/* Min line */}
          <Polyline
            points={minPoints}
            fill="none"
            stroke="#9ACD32"
            strokeWidth={2}
          />
          
          {/* Max line */}
          <Polyline
            points={maxPoints}
            fill="none"
            stroke="#228B22"
            strokeWidth={2}
          />
          
          {/* Main pulse line */}
          <Polyline
            points={points}
            fill="none"
            stroke="#34C759"
            strokeWidth={3}
          />

          {/* X-axis labels */}
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
      {/* HEADER */}
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

      {/* PIE CHARTS SECTION */}
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
        
        {/* Pie Chart Dots  */}
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

      {/* BAR CHARTS SECTION */}
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
        
        {/* Bar Chart Dots */}
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

      {/* HEART RATE PAGE */}
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

export default Graphs;
