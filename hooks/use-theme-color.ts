/**
 * Stub — this app uses a fixed colour palette (no light/dark mode toggle).
 * Kept for compatibility with any legacy components.
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  _colorName?: string
): string {
  return props.light ?? '#000000';
}
