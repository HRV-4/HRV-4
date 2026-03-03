// hooks/use-color-scheme.ts
// This hook bridges our app-level ThemeContext with all themed components.
// Any component using useColorScheme() from this file will respect the
// dark mode toggle in Settings, not just the OS-level setting.

import { useTheme } from '@/context/ThemeContext';

export function useColorScheme(): 'light' | 'dark' {
  const { isDark } = useTheme();
  return isDark ? 'dark' : 'light';
}