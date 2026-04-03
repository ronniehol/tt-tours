import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError(t('login.requiredError'));
      return;
    }
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.dismiss();
    } catch (err: any) {
      setError(err.message ?? t('login.failedError'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: Platform.OS === 'web' ? window.location.origin : 'tttours://' },
    });
    if (authError) setError(authError.message);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.teal }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.dismiss()} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.eyebrow}>
          <View style={styles.eyebrowLine} />
          <Text style={styles.eyebrowText}>{t('login.eyebrow')}</Text>
        </View>
        <Text style={styles.title}>{t('login.title').toUpperCase()}</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>{t('login.email')}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={t('login.emailPlaceholder')}
              placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>{t('login.password')}</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder={t('login.passwordPlaceholder')}
              placeholderTextColor="rgba(255,255,255,0.3)"
              secureTextEntry
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button title={t('login.signIn')} onPress={handleLogin} loading={loading} fullWidth style={{ marginTop: 8 }} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title={t('login.continueGoogle')}
            variant="outline-white"
            onPress={handleGoogle}
            fullWidth
          />

          <TouchableOpacity onPress={() => router.replace('/(auth)/signup')} style={{ marginTop: 24, alignItems: 'center' }}>
            <Text style={styles.switchText}>
              {t('login.noAccount')}{' '}
              <Text style={{ color: Colors.orange, fontFamily: 'SpaceGrotesk_700Bold' }}>{t('login.signUpLink')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 8 },
  closeBtn: { padding: 8 },
  closeBtnText: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18, color: 'rgba(255,255,255,0.6)' },
  content: { flex: 1, paddingHorizontal: 28, paddingTop: 20 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  eyebrowLine: { width: 24, height: 2, backgroundColor: Colors.orange },
  eyebrowText: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 11, color: Colors.orange, letterSpacing: 2, textTransform: 'uppercase' },
  title: { fontFamily: 'BarlowCondensed_700Bold_Italic', fontSize: 52, color: Colors.white, textTransform: 'uppercase', lineHeight: 50, marginBottom: 36 },
  form: {},
  field: { marginBottom: 16 },
  label: { fontFamily: 'SpaceGrotesk_600SemiBold', fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 15,
    color: Colors.white,
    borderRadius: 6,
  },
  errorText: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 13, color: '#FCA5A5', marginBottom: 8 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  dividerText: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  switchText: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.6)' },
});
