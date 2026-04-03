import { View, Text, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'orange' | 'teal' | 'white';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'orange', style }: BadgeProps) {
  const styles = {
    orange: { bg: Colors.orangeFaint, text: Colors.orange },
    teal: { bg: 'rgba(11,76,92,0.1)', text: Colors.teal },
    white: { bg: 'rgba(255,255,255,0.15)', text: Colors.white },
  }[variant];

  return (
    <View
      style={[
        {
          backgroundColor: styles.bg,
          paddingHorizontal: 10,
          paddingVertical: 3,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: 'SpaceGrotesk_700Bold',
          fontSize: 10,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: styles.text,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
