import { Tabs } from 'expo-router';
import { Platform, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 2, paddingTop: 4 }}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <Text
        style={{
          fontSize: 10,
          fontFamily: focused ? 'SpaceGrotesk_700Bold' : 'SpaceGrotesk_400Regular',
          color: focused ? Colors.orange : 'rgba(255,255,255,0.45)',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation('common');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.teal,
          borderTopColor: 'rgba(255,255,255,0.1)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
        },
        tabBarActiveTintColor: Colors.orange,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label={t('nav.home')} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tours"
        options={{
          title: t('nav.tours'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="🗺" label={t('nav.tours')} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: t('nav.bookings'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label={t('nav.bookings')} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('nav.profile'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label={t('nav.profile')} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
