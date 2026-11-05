import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { Text, View } from 'react-native';

import { Photo, PhotoCreditLine } from '@/components/photo';
import { Body, Chip, List, ListRow, Muted, Overline, Screen, Title } from '@/components/ui';
import { getFish } from '@/data/fish';
import { formatNumber } from '@/lib/i18n';
import { cToF, formatVolume } from '@/lib/params';
import { useUI } from '@/lib/settings';

export default function FishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, t, lang, settings } = useUI();
  const f = getFish(id);
  if (!f) return <Screen>{null}</Screen>;

  const n = (x: number, d = 1) => formatNumber(lang, x, d);
  const temp =
    settings.tempUnit === 'F'
      ? `${n(cToF(f.tempC[0]), 0)}–${n(cToF(f.tempC[1]), 0)} °F`
      : `${n(f.tempC[0], 0)}–${n(f.tempC[1], 0)} °C`;
  const size = settings.volumeUnit === 'gal' ? `${n(f.sizeCm / 2.54)} in` : `${n(f.sizeCm)} cm`;

  const rows: { label: string; value: string }[] = [
    { label: t('lib.size'), value: size },
    { label: t('lib.temp'), value: temp },
    { label: t('lib.ph'), value: `${n(f.ph[0])}–${n(f.ph[1])}` },
    { label: t('lib.minTank'), value: formatVolume(f.minTankL, settings.volumeUnit, lang) },
    { label: t('lib.temperament'), value: t(`lib.temperament.${f.temperament}`) },
    ...(f.groupMin ? [{ label: t('lib.group'), value: `${f.groupMin}+` }] : []),
    { label: t('lib.origin'), value: f.origin[lang] },
  ];

  return (
    <Screen>
      <Stack.Screen options={{ title: '' }} />
      <View style={{ gap: 6 }}>
        <Photo source={f.image} height={220} radius={16} caption={f.image ? undefined : t('lib.photoSoon')} />
        <PhotoCreditLine credit={f.credit} />
      </View>
      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Chip label={t(`lib.care.${f.care}`)} tone={f.care === 'hard' ? 'warn' : 'accent'} />
          <Chip label={t('lib.freshwater')} tone="muted" />
        </View>
        <Title style={{ fontSize: 26 }}>{f.name[lang]}</Title>
        <Text style={{ fontSize: 14, fontStyle: 'italic', color: theme.muted }}>
          {f.scientific} · {f.family}
        </Text>
      </View>
      <List>
        {rows.map((r, i) => (
          <ListRow key={r.label} label={r.label} value={r.value} last={i === rows.length - 1} />
        ))}
      </List>
      <View style={{ gap: 6 }}>
        <Overline accent>{t('lib.diet')}</Overline>
        <Body>{f.diet[lang]}</Body>
      </View>
      <View style={{ gap: 6 }}>
        <Overline accent>{t('lib.notes')}</Overline>
        <Body>{f.notes[lang]}</Body>
      </View>
      <Muted style={{ fontSize: 12 }}>{t('lib.disclaimer')}</Muted>
    </Screen>
  );
}
