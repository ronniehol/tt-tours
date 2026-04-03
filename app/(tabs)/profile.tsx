import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth-store';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { LanguagePicker } from '@/components/ui/LanguagePicker';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.teal }} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAccent} />
          <Text style={styles.headerTitle}>{t('header').toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.cream }}
        contentContainerStyle={{ padding: 20, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {user ? (
          <>
            {/* Profile card */}
            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.email[0].toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>{user.name ?? t('traveller')}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
              </View>
            </View>

            {/* Menu items */}
            <View style={styles.menuCard}>
              {[
                { icon: '📋', labelKey: 'menu.myBookings', onPress: () => router.push('/(tabs)/bookings') },
                { icon: '⚙️', labelKey: 'menu.accountSettings', onPress: () => {} },
                { icon: '💬', labelKey: 'menu.supportChat', onPress: () => {} },
              ].map((item) => (
                <TouchableOpacity
                  key={item.labelKey}
                  style={styles.menuItem}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuLabel}>{t(item.labelKey)}</Text>
                  <Text style={styles.menuArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title={t('signOut')}
              variant="outline-teal"
              onPress={signOut}
              fullWidth
              style={{ borderRadius: 8, marginTop: 8 }}
            />
          </>
        ) : (
          <>
            {/* Guest state */}
            <View style={styles.guestHero}>
              <Text style={styles.guestHeadline}>{t('guest.headline').toUpperCase()}</Text>
              <Text style={styles.guestSub}>{t('guest.sub')}</Text>
              <View style={{ gap: 10, marginTop: 24 }}>
                <Button
                  title={t('guest.signIn')}
                  onPress={() => router.push('/(auth)/login')}
                  fullWidth
                />
                <Button
                  title={t('guest.createAccount')}
                  variant="outline-white"
                  onPress={() => router.push('/(auth)/signup')}
                  fullWidth
                />
              </View>
            </View>

            {/* Guest options */}
            <View style={styles.menuCard}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/(tabs)/bookings')}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>📋</Text>
                <Text style={styles.menuLabel}>{t('menu.lookupBooking')}</Text>
                <Text style={styles.menuArrow}>→</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuIcon}>💬</Text>
                <Text style={styles.menuLabel}>{t('menu.whatsapp')}</Text>
                <Text style={styles.menuArrow}>→</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Language picker */}
        <LanguagePicker />

        {/* App info */}
        <Text style={styles.appInfo}>{t('appInfo')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.teal,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAccent: { width: 4, height: 22, backgroundColor: Colors.orange },
  headerTitle: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 26,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  profileCard: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: 'BarlowCondensed_700Bold_Italic', fontSize: 26, color: Colors.white },
  profileName: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 17, color: Colors.white },
  profileEmail: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  menuCard: { backgroundColor: Colors.white, borderRadius: 12, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIcon: { fontSize: 20 },
  menuLabel: { fontFamily: 'SpaceGrotesk_500Medium', fontSize: 15, color: Colors.ink, flex: 1 },
  menuArrow: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 16, color: Colors.muted },
  guestHero: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    padding: 24,
  },
  guestHeadline: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 42,
    color: Colors.white,
    textTransform: 'uppercase',
    lineHeight: 42,
    marginBottom: 10,
  },
  guestSub: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 21,
  },
  appInfo: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 12,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
});
