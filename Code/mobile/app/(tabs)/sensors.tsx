import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/PageHeader';

//Polar parts
// import { NativeModules, NativeEventEmitter } from 'react-native';
// const { PolarBridge } = NativeModules;
// const polarEmitter = new NativeEventEmitter(PolarBridge);

const { width } = Dimensions.get('window');

interface DiscoveredDevice {
  id: string;
  name: string | null;
  rssi: number | null;
}

interface ConnectedDevice {
  id: string;
  name: string | null;
}

// ─── PERMISSION HANDLING ───
async function requestBLEPermissions(): Promise<boolean> {
  if (Platform.OS === 'ios') return true;

  if (Platform.OS === 'android') {
    const apiLevel = Platform.Version;
    if (typeof apiLevel === 'number' && apiLevel >= 31) {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      const allGranted = Object.values(results).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );
      if (!allGranted) {
        Alert.alert('Permissions Required', 'Bluetooth and Location permissions are required.');
        return false;
      }
      return true;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }
  return false;
}

const Sensors: React.FC = () => {
  const [bleState, setBleState] = useState<'PoweredOn' | 'PoweredOff' | 'Unknown'>('PoweredOn');
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<DiscoveredDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<ConnectedDevice | null>(null);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // mock interval
  const mockIntervalRef = useRef<any>(null);

  const startScan = useCallback(async () => {
    // Since ble does not work on emulator close temporarily
    // const hasPermission = await requestBLEPermissions();
    // if (!hasPermission) return;

    setDiscoveredDevices([]);
    setScanError(null);
    setIsScanning(true);
    
    console.log("Tarama başlatıldı (Mock)");
    setTimeout(() => {
      setDiscoveredDevices([
        { id: '1A:2B:3C:4D:5E', name: 'Polar H10 12345', rssi: -55 },
        { id: 'FF:EE:DD:CC:BB', name: 'Polar Sense', rssi: -78 }
      ]);
      setIsScanning(false);
    }, 3000); 
  }, []);

  const stopScan = useCallback(() => {
    setIsScanning(false);
    console.log("Tarama durduruldu (Mock)");
  }, []);

  const connectToDevice = useCallback(async (deviceId: string, deviceName: string | null) => {
    setIsScanning(false);
    setIsConnecting(deviceId);
    
    console.log(`Cihaza bağlanılıyor: ${deviceId} (Mock)`);
    setTimeout(() => {
      setIsConnecting(null);
      setConnectedDevice({ id: deviceId, name: deviceName });
      Alert.alert('Connected', `Successfully connected to ${deviceName || 'device'}`);
      
      let fakeHr = 70;
      const interval = setInterval(() => {
        fakeHr = Math.floor(Math.random() * (85 - 65 + 1)) + 65; 
        setHeartRate(fakeHr);
      }, 1000);

      
      mockIntervalRef.current = interval;
    }, 2000); 
  }, []);

  const disconnectDevice = useCallback(async () => {
    if (!connectedDevice) return;
    
    console.log("Cihaz bağlantısı kesildi (Mock)");
    
    // clean interval
    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
      mockIntervalRef.current = null;
    }
    
    setConnectedDevice(null);
    setHeartRate(null);
  }, [connectedDevice]);

  // ─── UI Helpers ───
  const getSignalIcon = (rssi: number | null): 'wifi' | 'wifi-outline' => {
    if (rssi === null) return 'wifi-outline';
    if (rssi > -60) return 'wifi';
    if (rssi > -80) return 'wifi';
    return 'wifi-outline';
  };

  const getSignalColor = (rssi: number | null): string => {
    if (rssi === null) return '#A0ABA8';
    if (rssi > -60) return '#5CB89A';
    if (rssi > -80) return '#E3C937';
    return '#FF8A5C';
  };

  return (
    <ScreenBackground style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <PageHeader title="Sensors" variant="default" />

        {/* ─── Connection Status ─── */}
        <View style={styles.statusRectangle}>
          {connectedDevice ? (
            <View style={styles.connectedStatusRow}>
              <View style={styles.connectedDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.statusTextConnected}>
                  Connected to {connectedDevice.name || 'Unknown Device'}
                </Text>
                {heartRate !== null && (
                  <Text style={styles.heartRateText}>
                    ❤️ {heartRate} BPM
                  </Text>
                )}
              </View>
              <TouchableOpacity style={styles.disconnectBtn} onPress={disconnectDevice}>
                <Text style={styles.disconnectBtnText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.statusText} numberOfLines={2}>
              You currently don{'\u2019'}t have{'\n'}a connected sensor.
            </Text>
          )}
        </View>

        {/* ─── Connect Section ─── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Connect with</Text>
          <TouchableOpacity style={styles.largeWatchCard} activeOpacity={0.9} onPress={startScan}>
            <View style={styles.watchImageWrapper}>
              <Image source={require('@/assets/images/sensor.png')} style={styles.largeWatchImage} resizeMode="contain" />
            </View>
            <Text style={styles.watchLabel}>Polar Sensor</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Scan Section ─── */}
        <View style={styles.scanSection}>
          <View style={styles.scanHeaderRow}>
            <Text style={styles.sectionLabelInline}>Nearby Devices</Text>
            <TouchableOpacity 
              style={[styles.scanButton, isScanning && styles.scanButtonActive]}
              onPress={isScanning ? stopScan : startScan}
            >
              {isScanning ? (
                <>
                  <ActivityIndicator size="small" color="#FFF" />
                  <Text style={styles.scanButtonText}>Stop</Text>
                </>
              ) : (
                <>
                  <Ionicons name="bluetooth" size={16} color="#FFF" />
                  <Text style={styles.scanButtonText}>Scan</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {bleState === 'PoweredOff' && (
            <View style={styles.bleWarning}>
              <Ionicons name="warning-outline" size={18} color="#E3C937" />
              <Text style={styles.bleWarningText}>Bluetooth is turned off.</Text>
            </View>
          )}

          {scanError && (
            <View style={styles.bleWarning}>
              <Ionicons name="alert-circle-outline" size={18} color="#FF6B6B" />
              <Text style={[styles.bleWarningText, { color: '#FF6B6B' }]}>{scanError}</Text>
            </View>
          )}

          {isScanning && discoveredDevices.length === 0 && (
            <View style={styles.scanningIndicator}>
              <View style={styles.bluetoothIconCircle}>
                <Ionicons name="bluetooth" size={40} color="#5CB89A" />
              </View>
              <Text style={styles.scanningText}>Looking for Polar sensors...</Text>
              <Text style={styles.scanningHint}>Make sure your sensor is ON.</Text>
            </View>
          )}

          {discoveredDevices.length > 0 && (
            <View style={styles.deviceListContainer}>
              <Text style={styles.listHeader}>FOUND {discoveredDevices.length} DEVICE(S)</Text>
              {discoveredDevices.map((device) => (
                <TouchableOpacity 
                  key={device.id} 
                  style={styles.deviceRow}
                  onPress={() => connectToDevice(device.id, device.name)}
                  disabled={isConnecting !== null}
                >
                  <View style={styles.deviceInfoRow}>
                    <Ionicons name={getSignalIcon(device.rssi)} size={18} color={getSignalColor(device.rssi)} />
                    <View style={styles.deviceTextCol}>
                      <Text style={styles.deviceNameText} numberOfLines={1}>{device.name || 'Unknown Device'}</Text>
                      <Text style={styles.deviceIdText} numberOfLines={1}>{device.id}</Text>
                    </View>
                  </View>
                  <View style={styles.deviceActionGroup}>
                    {isConnecting === device.id ? (
                      <ActivityIndicator size="small" color="#5CB89A" />
                    ) : connectedDevice?.id === device.id ? (
                      <View style={styles.connectedBadge}><Text style={styles.connectedBadgeText}>Connected</Text></View>
                    ) : (
                      <TouchableOpacity style={styles.connectBtn} onPress={() => connectToDevice(device.id, device.name)}>
                        <Text style={styles.connectBtnText}>Connect</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {!isScanning && discoveredDevices.length === 0 && bleState === 'PoweredOn' && (
            <View style={styles.emptyState}>
              <Ionicons name="bluetooth-outline" size={36} color="rgba(67,79,77,0.2)" />
              <Text style={styles.emptyStateText}>Tap "Scan" to search for nearby Polar devices.</Text>
            </View>
          )}
        </View>


      </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
};

// ─── STYLES ───
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 19, paddingTop: 10, paddingBottom: 40 },
  statusRectangle: { backgroundColor: '#FAFAFA', borderRadius: 28, paddingHorizontal: 24, paddingVertical: 18, minHeight: 79, justifyContent: 'center', marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  statusText: { fontSize: 17, color: '#434F4D', fontWeight: '500', lineHeight: 22, flexShrink: 1 },
  connectedStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  connectedDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#5CB89A' },
  statusTextConnected: { fontSize: 16, color: '#434F4D', fontWeight: '600' },
  heartRateText: { fontSize: 14, color: '#FF6B6B', fontWeight: '600', marginTop: 2 },
  disconnectBtn: { backgroundColor: 'rgba(220,69,69,0.1)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  disconnectBtnText: { fontSize: 13, fontWeight: '600', color: '#DC4545' },
  sectionContainer: { alignItems: 'center', marginBottom: 35 },
  sectionLabel: { fontSize: 17, fontWeight: '600', color: '#434F4D', alignSelf: 'center', marginBottom: 20 },
  largeWatchCard: { width: width * 0.6, height: 260, backgroundColor: '#FAFAFA', borderRadius: 28, alignItems: 'center', justifyContent: 'center', padding: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 15 },
  watchImageWrapper: { flex: 1, justifyContent: 'center' },
  largeWatchImage: { width: 150, height: 190 },
  watchLabel: { fontSize: 17, fontWeight: '600', color: '#434F4D', marginTop: 10 },
  scanSection: { backgroundColor: '#FAFAFA', borderRadius: 20, padding: 18, marginBottom: 16, shadowColor: '#3D4E4A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  scanHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionLabelInline: { fontSize: 16, fontWeight: '600', color: '#434F4D' },
  scanButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#5CB89A', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
  scanButtonActive: { backgroundColor: '#DC4545' },
  scanButtonText: { fontSize: 14, fontWeight: '600', color: '#FFF' },
  bleWarning: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(227,201,55,0.08)', borderRadius: 12, padding: 14, marginBottom: 12 },
  bleWarningText: { flex: 1, fontSize: 13, color: '#E3C937', lineHeight: 18 },
  scanningIndicator: { alignItems: 'center', paddingVertical: 30 },
  bluetoothIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(92,184,154,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: 'rgba(92,184,154,0.2)' },
  scanningText: { fontSize: 16, fontWeight: '600', color: '#434F4D', marginBottom: 6 },
  scanningHint: { fontSize: 13, color: 'rgba(67,79,77,0.55)', textAlign: 'center' },
  deviceListContainer: { marginTop: 4 },
  listHeader: { fontSize: 12, fontWeight: '600', color: 'rgba(67,79,77,0.57)', marginBottom: 12, letterSpacing: 0.5 },
  deviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(84, 84, 88, 0.15)' },
  deviceInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginRight: 12 },
  deviceTextCol: { flex: 1 },
  deviceNameText: { fontSize: 16, color: '#434F4D', fontWeight: '500' },
  deviceIdText: { fontSize: 11, color: 'rgba(67,79,77,0.35)', marginTop: 2 },
  deviceActionGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  connectBtn: { backgroundColor: 'rgba(92,184,154,0.12)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  connectBtnText: { fontSize: 13, fontWeight: '600', color: '#5CB89A' },
  connectedBadge: { backgroundColor: 'rgba(92,184,154,0.12)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  connectedBadgeText: { fontSize: 12, fontWeight: '600', color: '#5CB89A' },
  emptyState: { alignItems: 'center', paddingVertical: 30, gap: 10 },
  emptyStateText: { fontSize: 14, color: 'rgba(67,79,77,0.4)', textAlign: 'center' },
  infoCard: { backgroundColor: '#FAFAFA', borderRadius: 20, padding: 18, marginBottom: 30, shadowColor: '#3D4E4A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  infoTitle: { fontSize: 14, fontWeight: '600', color: '#434F4D', marginBottom: 8 },
  infoText: { fontSize: 13, color: 'rgba(67,79,77,0.6)', lineHeight: 20 },
});

export default Sensors;