import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  Dimensions,
  Linking, //For bluetooth linking
  Platform,
  Alert,
  NativeModules, //for Kotlin
  NativeEventEmitter, //for communication with Kotlin
  PermissionsAndroid //for bluetooth permissions etc.
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/PageHeader';

const { width } = Dimensions.get('window');

const Sensors: React.FC = () => {
  // iOS'ta Bluetooth'u programatik olarak açıp kapama yok

  const { PolarModule } = NativeModules;
  const polarEmitter = new NativeEventEmitter(PolarModule);

  const [foundDeviceId, setFoundDeviceId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hr, setHr] = useState<number | null>(null);

  useEffect(() => {
    const foundSub = polarEmitter.addListener('onDeviceFound', (event) => {
      console.log('Device found:', event);
      setFoundDeviceId(event.deviceId);
    });

    const connectedSub = polarEmitter.addListener('onDeviceConnected', (event) => {
      console.log('Connected to:', event.deviceId);
      setIsConnected(true);
      PolarModule.startHrStreaming(); // start streaming automatically
      //PolarModule.startPPiStreaming();
    });

    const hrSub = polarEmitter.addListener('onHrData', (hrValue) => {
      console.log('HR:', hrValue);
      setHr(hrValue);
    });

    const ppiSub = polarEmitter.addListener('onPpiData', (data) => {
      console.log('PPIs:', data.ppi);
    });

    return () => {
      foundSub.remove();
      connectedSub.remove();
      hrSub.remove();
      ppiSub.remove();
    };
  }, []);

  useEffect(() => {
    if (foundDeviceId) {
      PolarModule.connectToDevice(foundDeviceId);
    }
  }, [foundDeviceId])

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ]);
    }
    else {
      //kill yourself idk
    }
  };

  async function helloPolar() {
    const result = await PolarModule.sayHello();
    console.log(result);
  }

  async function startPolar() {
    try {
      await requestBluetoothPermissions();
      await PolarModule.initializeSdk();
      await PolarModule.scanForDevice();
    } 
    catch (error) {
      console.error(error);
    }
  }
  
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(true);

  // Bluetooth navigate to settings
  //TODO we most probably gonna need to change it
  const openBluetoothSettings = () => {
    if (Platform.OS === 'ios') {
      
      Linking.openURL('App-Prefs:root=Bluetooth').catch(() => {
        Linking.openSettings(); // Hata verirse uygulamanın ayarlarına git
      });
    } else {
      // Android için  Bluetooth settings
      Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
    }
  };

  const handleToggle = (value: boolean) => {
    setIsBluetoothEnabled(value);
    // If user tries to disable navigate to settings
    if (!value) {
        Alert.alert(
            "Bluetooth Settings",
            "To turn off Bluetooth, please go to your device settings.",
            [
                { text: "Cancel", style: "cancel", onPress: () => setIsBluetoothEnabled(true) },
                { text: "Open Settings", onPress: openBluetoothSettings }
            ]
        );
    }
  };

  return (
    <ScreenBackground style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <PageHeader title="Sensors" variant="default" />
        {/* Status Message */}
        <View style={styles.statusRectangle}>
          <Text style={styles.statusText} numberOfLines={2} adjustsFontSizeToFit={false}>
            You currently don{'\u2019'}t have{'\n'}a connected sensor.
          </Text>
        </View>

        {/* Connect Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Connect with</Text>
          
          <TouchableOpacity style={styles.largeWatchCard} activeOpacity={0.9} onPress={startPolar}>
            <View style={styles.watchImageWrapper}>
              <Image 
                source={require('@/assets/images/sensor.png')} 
                style={styles.largeWatchImage} 
                resizeMode="contain"
              />
            </View>
            <Text style={styles.watchLabel}>Smart Watch</Text>
          </TouchableOpacity>
        </View>

        {/* Bluetooth Section */}
        <Text style={styles.sectionLabelOutside}>Can{'\u2019'}t see your device?</Text>
        
        <View style={styles.bluetoothRectangle}>
          
          {/* iOS Toggle Row */}
          <TouchableOpacity 
            style={styles.iosToggleRow} 
            activeOpacity={0.7}
            onPress={openBluetoothSettings} // When click open settings
          >
            <View style={styles.toggleLabelGroup}>
              <Ionicons name="bluetooth" size={20} color="#434F4D" />
              <Text style={styles.toggleText}>Bluetooth Settings</Text>
            </View>
            
          
            <Switch
              trackColor={{ false: '#D1D1D1', true: '#30D158' }}
              thumbColor="#FFF"
              ios_backgroundColor="#D1D1D1"
              onValueChange={handleToggle}
              value={isBluetoothEnabled}
            />
          </TouchableOpacity>
          
          <Text style={styles.discoverableHint}>
            Tap above to open System Bluetooth Settings to pair new devices.
          </Text>

          {/* Device List */}
          <View style={styles.deviceListContainer}>
            <Text style={styles.listHeader}>PAIRED DEVICES (EXAMPLE)</Text>
            
            <TouchableOpacity style={styles.deviceRow}>
              <Text style={styles.deviceNameText} numberOfLines={1}>Smart HR Watch</Text>
              <View style={styles.deviceActionGroup}>
                <Text style={styles.notConnectedLabel} numberOfLines={1}>Not connected</Text>
                <Ionicons name="information-circle-outline" size={22} color="#0A84FF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deviceRow}>
              <Text style={styles.deviceNameText} numberOfLines={1}>Px8 Headphones</Text>
              <View style={styles.deviceActionGroup}>
                <Text style={styles.notConnectedLabel} numberOfLines={1}>Not connected</Text>
                <Ionicons name="information-circle-outline" size={22} color="#0A84FF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.otherDevicesRow} onPress={openBluetoothSettings}>
              <Text style={styles.listHeader}>GO TO SETTINGS FOR OTHERS</Text>
              <Ionicons name="chevron-forward" size={16} color="rgba(67, 79, 77, 0.4)" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 19,paddingTop:10, paddingBottom: 40 },

  statusRectangle: { 
    backgroundColor: '#FAFAFA', 
    borderRadius: 28, 
    paddingHorizontal: 24,
    paddingVertical: 18,
    minHeight: 79,
    justifyContent: 'center', 
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  statusText: { 
    fontSize: 17, 
    color: '#434F4D', 
    fontWeight: '500', 
    lineHeight: 22,
    flexShrink: 1,
  },

  sectionContainer: { alignItems: 'center', marginBottom: 35 },
  sectionLabel: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: '#434F4D', 
    alignSelf: 'center', 
    marginBottom: 20,
  },
  largeWatchCard: { 
    width: width * 0.6, 
    height: 260, 
    backgroundColor: '#FAFAFA', 
    borderRadius: 28, 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  watchImageWrapper: { flex: 1, justifyContent: 'center' },
  largeWatchImage: { width: 150, height: 190 },
  watchLabel: { fontSize: 17, fontWeight: '600', color: '#434F4D', marginTop: 10 },

  sectionLabelOutside: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: '#434F4D', 
    marginBottom: 12, 
    marginLeft: 4,
  },
  bluetoothRectangle: { 
    backgroundColor: '#FAFAFA', 
    borderRadius: 15, 
    padding: 16, 
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  iosToggleRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#D9D9D9', 
    borderRadius: 10, 
    padding: 12,
    marginBottom: 8,
  },
  toggleLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  toggleText: { fontSize: 16, color: '#434F4D' },
  discoverableHint: { 
    fontSize: 13, 
    color: 'rgba(67, 79, 77, 0.57)', 
    lineHeight: 18, 
    marginBottom: 25,
    paddingHorizontal: 4,
  },
  deviceListContainer: { marginTop: 10 },
  listHeader: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: 'rgba(67, 79, 77, 0.57)', 
    marginBottom: 12,
  },
  deviceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 14, 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderBottomColor: 'rgba(84, 84, 88, 0.2)',
  },
  deviceNameText: { 
    fontSize: 16, 
    color: '#434F4D',
    flexShrink: 1,
    marginRight: 8,
  },
  deviceActionGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notConnectedLabel: { fontSize: 14, color: 'rgba(67, 79, 77, 0.4)' },
  otherDevicesRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginTop: 20,
  },
});

export default Sensors;