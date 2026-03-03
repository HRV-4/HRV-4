import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect, Circle, Path } from 'react-native-svg';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { API } from '../../api';

const { width, height } = Dimensions.get('window');

// ─── DECORATIVE COMPONENTS ───

function LogoMark() {
  return (
    <View style={styles.logoContainer}>
      <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
        <Circle cx="28" cy="28" r="28" fill="rgba(92,184,154,0.1)" />
        <Circle cx="28" cy="28" r="19" fill="rgba(92,184,154,0.18)" />
        <Path
          d="M19 28H23L26 21L30 35L34 25L36 28H39"
          stroke="#5CB89A"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

function BackgroundGlow() {
  return (
    <View style={styles.bgGlow} pointerEvents="none">
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="glow1" cx="20%" cy="15%" rx="60%" ry="40%">
            <Stop offset="0" stopColor="#5CB89A" stopOpacity="0.12" />
            <Stop offset="1" stopColor="#5CB89A" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="glow2" cx="85%" cy="75%" rx="50%" ry="35%">
            <Stop offset="0" stopColor="#90E2DA" stopOpacity="0.08" />
            <Stop offset="1" stopColor="#90E2DA" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill="url(#glow1)" />
        <Rect x="0" y="0" width={width} height={height} fill="url(#glow2)" />
      </Svg>
    </View>
  );
}

// ─── MAIN SCREEN ───

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API.login(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || 'Login failed');
      }

      const rawText = await response.text();
      let accessToken: string;
      let refreshToken: string | null = null;
      let userId: string | null = null;

      try {
        const json = JSON.parse(rawText);
        accessToken = json.accessToken || json.access_token || json.token || rawText;
        refreshToken = json.refreshToken || json.refresh_token || null;
        userId = json.userId || json.user_id || json.id || null;
      } catch {
        accessToken = rawText.replace(/^"|"$/g, '');
      }

      await AsyncStorage.setItem('accessToken', accessToken);
      if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);
      if (userId) await AsyncStorage.setItem('userId', userId);

      if (!userId && email) {
        try {
          const userRes = await fetch(API.userByEmail(email), {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            const fetchedId = userData.id || userData.userId || userData._id;
            if (fetchedId) await AsyncStorage.setItem('userId', fetchedId);
          }
        } catch (e) {
          console.warn('Could not fetch userId after login:', e);
        }
      }

      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground style={styles.container}>
      <BackgroundGlow />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, zIndex: 10, elevation: 10 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Header ── */}
          <View style={styles.headerSection}>
            <LogoMark />
            <Text style={styles.appName}>HRV-4</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue tracking{'\n'}your health journey
            </Text>
          </View>

          {/* ── Form ── */}
          <View style={styles.formSection}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ marginRight: 12 }}>
                  <Path
                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                    stroke="#A0ABA8"
                    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
                  />
                  <Path
                    d="M22 6L12 13L2 6"
                    stroke="#A0ABA8"
                    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
                  />
                </Svg>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor="#B8C4C2"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ marginRight: 12 }}>
                  <Path
                    d="M19 11H5C3.9 11 3 11.9 3 13V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V13C21 11.9 20.1 11 19 11Z"
                    stroke="#A0ABA8"
                    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
                  />
                  <Path
                    d="M7 11V7C7 5.67 7.53 4.4 8.46 3.46C9.4 2.53 10.67 2 12 2C13.33 2 14.6 2.53 15.54 3.46C16.47 4.4 17 5.67 17 7V11"
                    stroke="#A0ABA8"
                    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
                  />
                </Svg>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#B8C4C2"
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>

            {/* Error */}
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Sign In */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                loading && { opacity: 0.6 },
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Sign In</Text>
              )}
            </Pressable>
          </View>

          {/* ── Footer ── */}
          <View style={styles.footerSection}>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => router.push('/register')}
            >
              <Text style={styles.secondaryButtonText}>Create New Account</Text>
            </Pressable>

            <Text style={styles.footerNote}>
              By signing in, you agree to our Terms{'\n'}of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

// ─── STYLES ───

const styles = StyleSheet.create({
  container: { flex: 1 },

  bgGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingBottom: 40,
    justifyContent: 'center',
    minHeight: height,
  },

  // Header
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 14,
  },
  appName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5CB89A',
    letterSpacing: 3.5,
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#2E3B39',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(67,79,77,0.5)',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Form
  formSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A6B68',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6F5',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(67,79,77,0.05)',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    fontSize: 16,
    color: '#2E3B39',
  },

  // Error
  errorBox: {
    backgroundColor: 'rgba(217,68,68,0.07)',
    borderRadius: 12,
    padding: 12,
    marginTop: 2,
    marginBottom: 4,
  },
  errorText: {
    color: '#D94444',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Primary button
  primaryButton: {
    backgroundColor: '#5CB89A',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#5CB89A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.3,
  },

  // Footer
  footerSection: {
    alignItems: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(67,79,77,0.07)',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    color: 'rgba(67,79,77,0.3)',
    fontWeight: '500',
  },
  secondaryButton: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(92,184,154,0.22)',
    backgroundColor: 'rgba(92,184,154,0.04)',
  },
  secondaryButtonText: {
    color: '#5CB89A',
    fontWeight: '600',
    fontSize: 16,
  },
  footerNote: {
    marginTop: 28,
    fontSize: 12,
    color: 'rgba(67,79,77,0.28)',
    textAlign: 'center',
    lineHeight: 18,
  },
});