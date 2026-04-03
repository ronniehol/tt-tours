import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Colors } from '@/constants/theme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((v) => !v)}
        activeOpacity={0.8}
      >
        <Text style={[styles.chevron, isOpen && { transform: [{ rotate: '90deg' }] }]}>›</Text>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chevron: { fontSize: 18, color: Colors.muted, fontFamily: 'SpaceGrotesk_400Regular' },
  title: { fontFamily: 'SpaceGrotesk_600SemiBold', fontSize: 14, color: Colors.ink },
  content: { marginTop: 6, marginLeft: 24 },
});
