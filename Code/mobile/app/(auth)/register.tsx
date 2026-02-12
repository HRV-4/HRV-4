import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { API } from '../../api';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API.register(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || 'Registration failed');
      }

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'Log In', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground style={styles.outerContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Glassmorphism card — same style as login */}
          <View style={styles.card}>
            <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
              <Defs>
                <RadialGradient
                  id="regGrad"
                  cx="51%"
                  cy="-14%"
                  rx="115%"
                  ry="115%"
                >
                  <Stop offset="0" stopColor="#E6E6E6" stopOpacity="1" />
                  <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.68" />
                </RadialGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" rx="42" fill="url(#regGrad)" />
            </Svg>

            <View style={styles.cardContent}>
              <Text style={styles.title}>Create Account </Text>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Username"
                placeholderTextColor="#A0A0A0"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                style={styles.input}
              />

              {error && <Text style={styles.error}>{error}</Text>}
            </View>
          </View>

          {/* Sign Up button */}
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.back()} style={styles.linkWrap}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkBold}>Sign In</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },

  card: {
    width: '100%',
    maxWidth: 336,
    borderRadius: 42,
    overflow: 'hidden',
    shadowColor: '#3D4E4A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  cardContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#434F4D',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 17,
    color: '#434F4D',
    marginBottom: 12,
  },
  error: {
    color: '#E55A5A',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },

  button: {
    width: '100%',
    maxWidth: 248,
    backgroundColor: '#5CB89A',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#5CB89A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontWeight: '600', fontSize: 17 },

  linkWrap: { marginTop: 16 },
  linkText: { fontSize: 14, color: 'rgba(67,79,77,0.6)' },
  linkBold: { fontWeight: '600', color: '#5CB89A' },
});