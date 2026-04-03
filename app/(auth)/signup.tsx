import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

export default function SignupScreen() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    setError('');
    if (!email || !password || !name) {
      setError(t('signup.requiredError'));
      return;
    }
    if (password.length < 8) {
      setError(t('signup.passwordLengthError'));
      return;
    }
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (authError) throw authError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message ?? t('signup.failedError'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
        <Text style={{ fontFamily: 'BarlowCondensed_700Bold_Italic', fontSize: 52, color: Colors.white, textAlign: 'center', lineHeight: 50 }}>
          {t('signup.checkEmail').toUpperCase()}
        </Text>
        <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginTop: 14, lineHeight: 22 }}>
          {t('signup.confirmationSent', { email })}
        </Text>
        <Button title={t('signup.backToHome')} onPress={() => router.replace('/')} style={{ marginTop: 28 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.teal }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.dismiss()} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.eyebrow}>
          <View style={styles.eyebrowLine} />
          <Text style={styles.eyebrowText}>{t('signup.eyebrow')}</Text>
        </View>
        <Text style={styles.title}>{t('signup.title').toUpperCase()}</Text>

        <View style={styles.field}>
          <Text style={styles.label}>{t('signup.fullName')}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={t('signup.namePlaceholder')}
            placeholderTextColor="rgba(255,255,255,0.3)"
            autoCapitalize="words"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>{t('signup.email')}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={t('signup.emailPlaceholder')}
            placeholderTextColor="rgba(255,255,255,0.3)"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>{t('signup.password')}</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder={t('signup.passwordPlaceholder')}
            placeholderTextColor="rgba(255,255,255,0.3)"
            secureTextEntry
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button title={t('signup.createAccount')} onPress={handleSignup} loading={loading} fullWidth style={{ marginTop: 8 }} />

        <TouchableOpacity onPress={() => router.replace('/(auth)/login')} style={{ marginTop: 24, alignItems: 'center' }}>
          <Text style={styles.switchText}>
            {t('signup.hasAccount')}{' '}
            <Text style={{ color: Colors.orange, fontFamily: 'SpaceGrotesk_700Bold' }}>{t('signup.signInLink')}</Text>
          </Text>
        </TouchableOpacity>
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
  switchText: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.6)' },
});
