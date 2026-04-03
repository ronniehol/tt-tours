import { View, Text, TouchableOpacity, ViewStyle, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Tour } from '@/types';
import { Colors } from '@/constants/theme';
import { Badge } from './Badge';
import { formatVnd } from '@/lib/format';

interface TourCardProps {
  tour: Tour;
  index?: number;
  style?: ViewStyle;
}

const DURATION_LABEL: Record<string, string> = {
  cultural: '🏛',
  adventure: '⛰',
  nature: '🌿',
  water: '🤿',
  food: '🍜',
  transport: '🚌',
};

export function TourCard({ tour, index = 0, style }: TourCardProps) {
  const router = useRouter();
  const { t } = useTranslation('tourDetail');
  const [r1, r2] = tour.thumbGradient;

  const handlePress = () => {
    router.push(`/tour/${tour.slug}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.92}
      style={[
        {
          backgroundColor: Colors.white,
          overflow: 'hidden',
          ...Platform.select({
            web: {
              cursor: 'pointer',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            } as any,
          }),
        },
        style,
      ]}
    >
      {/* Image / Gradient thumbnail */}
      <View
        style={{
          height: 160,
          position: 'relative',
          ...(tour.coverImageUrl
            ? { backgroundColor: r1 }
            : Platform.OS === 'web'
            ? ({ background: `linear-gradient(135deg, ${r1} 0%, ${r2} 100%)` } as any)
            : { backgroundColor: r1 }),
        }}
      >
        {tour.coverImageUrl && (
          <Image
            source={{ uri: `${tour.coverImageUrl}&w=600&q=75&fit=crop` }}
            style={{ ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        )}
        {/* Dark overlay */}
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.25)',
          }}
        />
        {/* Category badge */}
        <View style={{ position: 'absolute', top: 10, left: 10 }}>
          <Badge
            label={tour.duration.includes('Full') ? t('labels.fullDay') : t('labels.halfDay')}
            variant="white"
          />
        </View>
        {/* Number watermark */}
        <Text
          style={{
            position: 'absolute',
            bottom: 6,
            right: 10,
            fontFamily: 'BarlowCondensed_700Bold_Italic',
            fontSize: 40,
            color: 'rgba(255,255,255,0.15)',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </Text>
        {/* Category icon */}
        <Text
          style={{
            position: 'absolute',
            top: 10,
            right: 12,
            fontSize: 18,
          }}
        >
          {DURATION_LABEL[tour.category] ?? '📍'}
        </Text>
        {/* Orange accent bar bottom */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: Colors.orange,
          }}
        />
      </View>

      {/* Card body */}
      <View style={{ padding: 14 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 6,
          }}
        >
          <Text
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 15,
              color: Colors.ink,
              flex: 1,
              marginRight: 8,
            }}
            numberOfLines={2}
          >
            {tour.name}
          </Text>
          <Text
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 15,
              color: Colors.orange,
            }}
          >
            {formatVnd(tour.priceVnd)}+
          </Text>
        </View>

        <Text
          style={{
            fontFamily: 'SpaceGrotesk_400Regular',
            fontSize: 13,
            color: Colors.muted,
            lineHeight: 19,
            marginBottom: 10,
          }}
          numberOfLines={2}
        >
          {tour.shortDescription}
        </Text>

        {/* Info chips */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Text style={{ fontSize: 11, color: Colors.muted, fontFamily: 'SpaceGrotesk_400Regular' }}>
            ⏱ {tour.duration}
          </Text>
          <Text style={{ fontSize: 11, color: Colors.muted, fontFamily: 'SpaceGrotesk_400Regular' }}>
            👥 Max {tour.maxGroupSize}
          </Text>
          <Text style={{ fontSize: 11, color: Colors.muted, fontFamily: 'SpaceGrotesk_400Regular' }}>
            🕐 {tour.departureTime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Need StyleSheet for absoluteFillObject
import { StyleSheet } from 'react-native';
