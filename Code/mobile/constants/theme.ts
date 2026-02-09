/**
 * Updated to match HRV-4 Web Palette
 * Primary Blue: #007AFF
 * Text Main: #0f172a
 * Text Secondary: #64748b
 */

import { Platform } from 'react-native';

// Your Brand Colors from web CSS
const tintColorLight = '#007AFF'; // Matches --primary
const tintColorDark = '#fff';     // White tint for dark mode

export const Colors = {
  light: {
    text: '#0f172a',        // Matches --text-main
    textSecondary: '#64748b', // Matches --text-secondary
    background: '#ffffff',  // Matches --bg-body
    tint: tintColorLight,
    icon: '#64748b',        // Matches --text-secondary
    tabIconDefault: '#9ca3af', // Light gray for inactive tabs
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif-medium',
    mono: 'monospace',
  },
});