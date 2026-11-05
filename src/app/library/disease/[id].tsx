import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { Text, View } from 'react-native';

import { Photo, PhotoCreditLine } from '@/components/photo';
import { Body, Chip, Muted, Overline, Screen, Title } from '@/components/ui';
import { getDisease } from '@/data/diseases';
import { useUI } from '@/lib/settings';

export default function DiseaseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, t, lang } = useUI();
  const d = getDisease(id);
  if (!d) return <Screen>{null}</Screen>;

  const sections = [
    { title: t('lib.description'), text: d.description[lang] },
    { title: t('lib.symptoms'), text: d.symptoms[lang] },
    { title: t('lib.cause'), text: d.cause[lang] },
    { title: t('lib.treatment'), text: d.treatment[lang] },
    { title: t('lib.prevention'), text: d.prevention[lang] },
  ];

  return (
    <Screen>
      <Stack.Screen options={{ title: '' }} />
      <View style={{ gap: 6 }}>
        <Photo source={d.image} height={220} radius={16} icon="medkit-outline" caption={d.image ? undefined : t('lib.photoSoon')} />
        <PhotoCreditLine credit={d.credit} />
      </View>
      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Chip label={d.kind[lang]} />
          <Chip label={t(`lib.severity.${d.severity}`)} tone={d.severity === 'serious' ? 'warn' : 'muted'} />
        </View>
        <Title style={{ fontSize: 26 }}>{d.name[lang]}</Title>
        {d.scientific ? <Text style={{ fontSize: 14, fontStyle: 'italic', color: theme.muted }}>{d.scientific}</Text> : null}
      </View>
      {sections.map((s) => (
        <View key={s.title} style={{ gap: 6 }}>
          <Overline accent>{s.title}</Overline>
          <Body>{s.text}</Body>
        </View>
      ))}
      <Muted style={{ fontSize: 12 }}>{t('lib.disclaimer')}</Muted>
    </Screen>
  );
}
