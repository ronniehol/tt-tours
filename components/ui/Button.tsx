import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'orange' | 'teal' | 'outline-white' | 'outline-teal' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const variants = {
  orange: {
    container: { backgroundColor: Colors.orange } as ViewStyle,
    text: { color: Colors.white } as TextStyle,
  },
  teal: {
    container: { backgroundColor: Colors.teal } as ViewStyle,
    text: { color: Colors.white } as TextStyle,
  },
  'outline-white': {
    container: { backgroundColor: 'transparent', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' } as ViewStyle,
    text: { color: Colors.white } as TextStyle,
  },
  'outline-teal': {
    container: { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.teal } as ViewStyle,
    text: { color: Colors.teal } as TextStyle,
  },
  ghost: {
    container: { backgroundColor: 'transparent' } as ViewStyle,
    text: { color: Colors.teal } as TextStyle,
  },
};

const sizes = {
  sm: { container: { paddingHorizontal: 16, paddingVertical: 8 }, textSize: 13 },
  md: { container: { paddingHorizontal: 24, paddingVertical: 12 }, textSize: 15 },
  lg: { container: { paddingHorizontal: 32, paddingVertical: 16 }, textSize: 16 },
};

export function Button({
  title,
  onPress,
  variant = 'orange',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const v = variants[variant];
  const s = sizes[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        v.container,
        s.container,
        { opacity: disabled ? 0.5 : 1 },
        fullWidth ? { width: '100%', alignItems: 'center' } : {},
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text.color} size="small" />
      ) : (
        <Text
          style={[
            {
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: s.textSize,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            },
            v.text,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
