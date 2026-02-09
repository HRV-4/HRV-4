import React, { useState, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Button, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles/sensors.styles';

const { height } = Dimensions.get('window');

const Sensors: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const navigation = useNavigation<any>();

  const DISCONNECTED_PAGES = [
    {
      title: "Enable Bluetooth!",
      body: "Go to Settings and turn on Bluetooth.\nMake sure your sensor is powered on.\nKeep the sensor close to your device."
    },
    {
      title: "Connect Your Sensor",
      body: "Tap the button below to connect your sensor.\nEnsure the sensor is in pairing mode.\nWait for the connection to establish.",
      cta: {
        label: "Connect Sensor",
        onClick: () => setIsConnected(true),
      },
    },
    {
      title: "Need Help?",
      body: "If you're having trouble connecting,\ncheck our FAQ section or contact support.",
      cta: {
        label: "Need Help?",
        onClick: () => navigation.navigate('faq'),
      },
    },
  ];

  
  const containerRef = useRef<ScrollView>(null);
  const [active, setActive] = useState(0);

  const pageHeight = height * 0.5;

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ y: index * pageHeight, animated: true });
    }
  };

  let time = 30;
  let battery = 98;

  return (
    <View style={styles.pageContainer}>
      {/* GREEN HEADER */}
      <View style={styles.horizantalTop}>
        <Text style={styles.topLeft}>My Sensors</Text>
      </View>

      {/* CONNECTED */}
      {isConnected && (
        <View style={[styles.sensorCard, styles.connectedHorizontal]}>
          <View style={styles.leftInfo}>
            <Text style={styles.sensorConnected}>Your sensor is connected!</Text>
            <Text style={styles.time}>
              For: {time} Minutes {"\n"}
              Battery: {battery}%
            </Text>
          </View>

          <View style={styles.centerDevice}>
            <View style={styles.glowCircle} />
            <Image source={require('@/assets/images/sensor.png')} style={styles.deviceImg} />
          </View>

          <View style={styles.rightAction}>
            <TouchableOpacity
              style={styles.realTimeButton}
              onPress={() => navigation.navigate('graphs')}
            >
              <Text style={styles.realTimeButtonText}>See your real-time data!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={() => setIsConnected(false)}
            >
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* DISCONNECTED */}
      {!isConnected && (
        <View style={[styles.sensorCard, styles.disconnectedShell]}>
          <ScrollView
            ref={containerRef}
            pagingEnabled
            snapToInterval={pageHeight}
            decelerationRate="fast"
            onScroll={(e) => {
              const offsetY = e.nativeEvent.contentOffset.y;
              const index = Math.round(offsetY / pageHeight);
              setActive(index);
            }}
            scrollEventThrottle={16}
          >
            {DISCONNECTED_PAGES.map((page, idx) => (
              <View key={idx} style={styles.pageWrapper}>
                <Text style={styles.sensorDisconnected}>{page.title}</Text>
                <Text style={styles.scrollDown}>{page.body}</Text>
                {page.cta && (
                  <TouchableOpacity
                    style={page.cta.label === "Connect Sensor" ? styles.connectButton : styles.disconnectButton}
                    onPress={page.cta.onClick}
                  >
                    <Text style={page.cta.label === "Connect Sensor" ? styles.connectButtonText : styles.disconnectButtonText}>
                      {page.cta.label}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>

          {/* DOTS */}
          <View style={styles.graphsDots}>
            {DISCONNECTED_PAGES.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.graphsDot, active === i && styles.activeDot]}
                onPress={() => scrollToIndex(i)}
              />
            ))}
          </View>
        </View>
      )}

      {/* TEST */}
      <TouchableOpacity
        style={styles.testButton}
        onPress={() => setIsConnected(!isConnected)}
      >
        <Text style={styles.testButtonText}>Test Connection</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Sensors;