import Ionicons from '@expo/vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import { Image, Text, View, type ImageSourcePropType } from 'react-native';

import { useUI } from '@/lib/settings';

/** Attribution for a photo taken from Wikimedia Commons. */
export type PhotoCredit = {
  author: string;
  /** Short license name, e.g. "CC BY-SA 4.0" or "Public domain". */
  license: string;
  /** Commons file page with the full license. */
  url: string;
};

/** Shows an example photo, or a neutral placeholder until one is added. */
export function Photo({
  source,
  size,
  height,
  radius = 12,
  icon = 'fish-outline',
  caption,
}: {
  source?: ImageSourcePropType;
  size?: number;
  height?: number;
  radius?: number;
  icon?: 'fish-outline' | 'medkit-outline';
  caption?: string;
}) {
  const { theme } = useUI();
  const box = { width: size ?? '100%', height: size ?? height ?? 220, borderRadius: radius, backgroundColor: theme.surface } as const;
  if (source) return <Image source={source} style={box} resizeMode="cover" accessibilityIgnoresInvertColors />;
  return (
    <View style={[box, { alignItems: 'center', justifyContent: 'center', gap: 6 }]}>
      <Ionicons name={icon} size={size ? size * 0.45 : 40} color={theme.muted} />
      {caption ? <Text style={{ fontSize: 12, color: theme.muted }}>{caption}</Text> : null}
    </View>
  );
}

/** Small "author · license" line under a photo; opens the Commons page on tap. */
export function PhotoCreditLine({ credit }: { credit?: PhotoCredit }) {
  const { theme, t } = useUI();
  if (!credit) return null;
  const who = credit.author || t('lib.photoUnknownAuthor');
  return (
    <Text
      onPress={() => WebBrowser.openBrowserAsync(credit.url)}
      accessibilityRole="link"
      numberOfLines={2}
      style={{ fontSize: 11, color: theme.muted }}>
      {t('lib.photoBy')} {who} · {credit.license} · Wikimedia Commons
    </Text>
  );
}
