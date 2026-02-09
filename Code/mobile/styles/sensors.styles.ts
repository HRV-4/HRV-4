import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // PAGE CONTAINER
  pageContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  // GREEN HEADER CONTAINER
  horizantalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  title: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  sensorCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: 16,
    width: width * 0.9,
    alignItems: 'center',
    marginBottom: 20,
  },
  connectedHorizontal: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  leftInfo: {
    alignItems: 'center',
  },
  sensorConnected: {
    fontSize: 20,
    fontWeight: '700',
    color: '#34C759',
    textAlign: 'center',
  },
  time: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  centerDevice: {
    width: width * 0.6,
    height: width * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  glowCircle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    backgroundColor: 'rgba(0,255,0,0.2)',
    position: 'absolute',
  },
  deviceImg: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    borderWidth: 4,
    borderColor: 'white',
  },
  rightAction: {
    marginTop: 12,
    alignItems: 'center',
  },
  realTimeButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 12,
  },
  realTimeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  disconnectButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  disconnectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  connectButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disconnectedShell: {
    height: height * 0.5,
    position: 'relative',
    overflow: 'hidden',
    width: width * 0.9,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    elevation: 6,
  },
  pageWrapper: {
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sensorDisconnected: {
    fontSize: 20,
    fontWeight: '700',
    color: '#34C759',
    marginBottom: 12,
    textAlign: 'center',
  },
  scrollDown: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  faq: {
    backgroundColor: '#34C759',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  graphsDots: {
    position: 'absolute',
    top: '50%',
    right: 12,
    flexDirection: 'column',
  },
  graphsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginVertical: 4,
  },
  activeDot: {
    width: 8,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#34C759',
  },
  testButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default styles;