import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Text, View, type ImageSourcePropType } from 'react-native';

import { useUI } from '@/lib/settings';

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
