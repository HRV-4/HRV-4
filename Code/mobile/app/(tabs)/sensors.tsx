import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenBackground } from '@/components/ui/ScreenBackground';

const { width } = Dimensions.get('window');

const Sensors: React.FC = () => {
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(true);

  return (
    <ScreenBackground style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
       

        {/* Status Message Rectangle */}
        <View style={styles.statusRectangle}>
          <Text style={styles.statusText}>
            You currently don’t have{"\n"}a connected sensor.
          </Text>
        </View>

        {/* Connection Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Connect with</Text>
          
          <TouchableOpacity style={styles.largeWatchCard} activeOpacity={0.9}>
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

        {/* Bluetooth Section - Title Outside */}
        <Text style={styles.sectionLabelOutside}>Can’t see your device?</Text>
        
        <View style={styles.bluetoothRectangle}>
          {/* iOS Style Bluetooth Toggle */}
          <View style={styles.iosToggleRow}>
            <View style={styles.toggleLabelGroup}>
              <Ionicons name="bluetooth" size={20} color="#434F4D" />
              <Text style={styles.toggleText}>Bluetooth</Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D1D1", true: "#30D158" }}
              thumbColor={"#FFF"}
              ios_backgroundColor="#D1D1D1"
              onValueChange={setIsBluetoothEnabled}
              value={isBluetoothEnabled}
            />
          </View>
          
          <Text style={styles.discoverableHint}>
            This iPhone is discoverable as “Buse’s iPhone” while Bluetooth Settings is open.
          </Text>

          {/* Device List Section */}
          <View style={styles.deviceListContainer}>
            <Text style={styles.listHeader}>MY DEVICES</Text>
            
            <TouchableOpacity style={styles.deviceRow}>
              <Text style={styles.deviceNameText}>Smart HR Watch</Text>
              <View style={styles.deviceActionGroup}>
                <Text style={styles.notConnectedLabel}>Not connected</Text>
                <Ionicons name="information-circle-outline" size={22} color="#0A84FF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deviceRow}>
              <Text style={styles.deviceNameText}>Px8 Headphones</Text>
              <View style={styles.deviceActionGroup}>
                <Text style={styles.notConnectedLabel}>Not connected</Text>
                <Ionicons name="information-circle-outline" size={22} color="#0A84FF" />
              </View>
            </TouchableOpacity>

            <View style={styles.otherDevicesRow}>
              <Text style={styles.listHeader}>OTHER DEVICES</Text>
              <Ionicons name="sync" size={16} color="rgba(67, 79, 77, 0.4)" />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 19, paddingBottom: 40, paddingTop: 10 },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 50, 
    marginBottom: 25 
  },
  headerTitle: { 
    fontSize: 22, 
    color: '#434F4D', 
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 11
  },
  profileButton: { backgroundColor: '#FFF', borderRadius: 20 },

  statusRectangle: { 
    backgroundColor: '#FAFAFA', 
    borderRadius: 28, 
    padding: 24, 
    height: 90, 
    justifyContent: 'center', 
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10
  },
  statusText: { fontSize: 17, color: '#434F4D', fontWeight: '500', lineHeight: 22 },

  sectionContainer: { alignItems: 'center', marginBottom: 35 },
  sectionLabel: { fontSize: 17, fontWeight: '600', color: '#434F4D', alignSelf: 'center', marginBottom: 20 },
  
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
    shadowRadius: 15
  },
  watchImageWrapper: { flex: 1, justifyContent: 'center' },
  largeWatchImage: { width: 150, height: 190 },
  watchLabel: { fontSize: 17, fontWeight: '600', color: '#434F4D', marginTop: 10 },

  // Kutu dışındaki başlık
  sectionLabelOutside: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: '#434F4D', 
    marginBottom: 12, 
    marginLeft: 4 
  },

  bluetoothRectangle: { 
    backgroundColor: '#FAFAFA', 
    borderRadius: 15, 
    padding: 16, 
    marginBottom: 20 
  },
  iosToggleRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#D9D9D9', 
    borderRadius: 10, 
    padding: 12,
    marginBottom: 8
  },
  toggleLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  toggleText: { fontSize: 16, color: '#434F4D' },
  discoverableHint: { 
    fontSize: 13, 
    color: 'rgba(67, 79, 77, 0.57)', 
    lineHeight: 18, 
    marginBottom: 25,
    paddingHorizontal: 4
  },

  deviceListContainer: { marginTop: 10 },
  listHeader: { fontSize: 12, fontWeight: '600', color: 'rgba(67, 79, 77, 0.57)', marginBottom: 12 },
  deviceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 14, 
    borderBottomWidth: 0.5, 
    borderBottomColor: 'rgba(84, 84, 88, 0.2)' 
  },
  deviceNameText: { fontSize: 16, color: '#434F4D' },
  deviceActionGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notConnectedLabel: { fontSize: 14, color: 'rgba(67, 79, 77, 0.4)' },
  otherDevicesRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 }
});

export default Sensors;