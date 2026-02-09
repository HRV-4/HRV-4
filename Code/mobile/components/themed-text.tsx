import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'secondary';
};

export function ThemedText({
                             style,
                             lightColor,
                             darkColor,
                             type = 'default',
                             ...rest
                           }: ThemedTextProps) {
  // Select the correct color based on type
  const color = useThemeColor(
      { light: lightColor, dark: darkColor },
      type === 'secondary' ? 'textSecondary' : 'text' // Use new textSecondary key if needed
  );

  return (
      <Text
          style={[
            { color },
            type === 'default' && styles.default,
            type === 'title' && styles.title,
            type === 'defaultSemiBold' && styles.defaultSemiBold,
            type === 'subtitle' && styles.subtitle,
            type === 'link' && styles.link,
            type === 'secondary' && styles.secondary, // Added support for gray text
            style,
          ]}
          {...rest}
      />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '800', // Made bolder to match web h1
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#007AFF', // Matches your brand blue
    fontWeight: '600',
  },
  secondary: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748b', // Explicit fallback if theme fails
  },
});