/**
 * Template 4 — Bold Adventure colour palette & spacing
 */
export const Colors = {
  teal: '#0B4C5C',
  tealMid: '#136B82',
  tealLight: '#1E8FA8',
  tealDark: '#072E38',
  orange: '#F97316',
  orangeDark: '#C95A08',
  orangeFaint: 'rgba(249,115,22,0.08)',
  cream: '#F7F5F2',
  offWhite: '#EDE8E0',
  white: '#FFFFFF',
  ink: '#1A1A1A',
  muted: '#6B7280',
  border: '#E5E7EB',
};

export const Typography = {
  display: {
    fontSize: { xs: 32, sm: 40, md: 52, lg: 72 },
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    textTransform: 'uppercase' as const,
    letterSpacing: -0.5,
  },
  h1: { fontSize: 28, fontFamily: 'SpaceGrotesk_700Bold' },
  h2: { fontSize: 22, fontFamily: 'SpaceGrotesk_700Bold' },
  h3: { fontSize: 17, fontFamily: 'SpaceGrotesk_600SemiBold' },
  body: { fontSize: 15, fontFamily: 'SpaceGrotesk_400Regular' },
  caption: { fontSize: 12, fontFamily: 'SpaceGrotesk_400Regular' },
  label: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' as const },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 64,
};

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 999,
};
