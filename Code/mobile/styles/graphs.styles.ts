import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // PAGE CONTAINER
  graphsContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  // HEADER BAR
  horizantalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 24,
    padding: 20,
    paddingTop: 20,
    paddingBottom: 30,
    minHeight: 80,
    backgroundColor: '#34C759',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.3)',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  topLeft: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },

  // TIME RANGE
  timeRange: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 6,
  },

  timeRangeLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
    color: '#666',
  },

  timeRangeSegmented: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 3,
    borderRadius: 10,
    backdropFilter: 'blur(10px)',
  },

  timeRangeBtn: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 6,
    minWidth: 30,
  },

  timeRangeBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#34C759',
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // SCROLL CONTAINER
  graphsScroll: {
    height: height * 0.5,
    position: 'relative',
  },

  graphsScrollWrapper: {
    position: 'relative',
  },

  // SINGLE PAGE
  graphsPage: {
    height: height * 0.5,
    padding: 20,
    paddingRight: 56,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },

  graphHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },

  // HORIZONTAL GRAPH ROW
  scrollableGraphsHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20,
  },

  graphsTogether: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 0,
  },

  // GRAPH BOXES
  chartBox: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  chartBoxPie: {
    width: 200,
    height: 180,
  },

  chartBoxBar: {
    width: 160,
    height: 150,
  },

  topMetric: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },

  bottomMetric: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    textAlign: 'left',
  },

  // TIPS BUTTON
  tipsBtn: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#34C759',
    color: '#34C759',
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 0,
    marginLeft: 'auto',
  },

  tipsBtnText: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: '600',
  },

  // SECTION HEADERS
  sectionHeader: {
    backgroundColor: '#f8f9fa', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 12, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },

  sectionHeaderText: {
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1a1a1a', 
    textAlign: 'center',
  },

  // DOT NAVIGATION (Fixed position, outside scrollable pages)
  graphsDots: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -60 }],
    flexDirection: 'column',
    gap: 12,
    zIndex: 10,
  },

  graphsDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },

  activeDot: {
    backgroundColor: '#34C759',
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // PULSE CARD
  pulseCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  pulseCardInner: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pulseHeader: {
    width: '100%',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },

  pulseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  // Simple chart styles
  pieChartContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pieChartCenter: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },

  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    width: 140,
  },

  bar: {
    width: 12,
    borderRadius: 6,
  },

  lineChartContainer: {
    width: Math.max(width * 1.2, 300),
    height: 200,
    marginTop: 20,
  },
});

export default styles;
