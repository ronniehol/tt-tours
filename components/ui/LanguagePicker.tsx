import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguageStore, AppLanguage } from '@/store/language-store';
import { Colors } from '@/constants/theme';

const LANGUAGES: { code: AppLanguage; flag: string }[] = [
  { code: 'en', flag: '🇬🇧' },
  { code: 'vi', flag: '🇻🇳' },
  { code: 'zh', flag: '🇨🇳' },
  { code: 'ru', flag: '🇷🇺' },
];

export function LanguagePicker() {
  const { t } = useTranslation('profile');
  const { language, setLanguage } = useLanguageStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('language.title')}</Text>
      <View style={styles.row}>
        {LANGUAGES.map((lang) => {
          const active = language === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              onPress={() => setLanguage(lang.code)}
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={[styles.label, active && styles.labelActive]}>
                {t(`language.${lang.code}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 12,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.cream,
  },
  chipActive: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
  },
  flag: { fontSize: 16 },
  label: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 13,
    color: Colors.ink,
  },
  labelActive: {
    color: Colors.white,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
});
