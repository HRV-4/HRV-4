// hooks/use-color-scheme.web.ts
import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

export function useColorScheme(): 'light' | 'dark' {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (hasHydrated) {
    return isDark ? 'dark' : 'light';
  }

  return 'light';
}