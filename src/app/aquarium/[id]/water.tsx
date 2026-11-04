import { router, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { DateField } from '@/components/date-field';
import { Button, Field, Muted, Screen } from '@/components/ui';
import { addWaterChange, getAquarium, type Aquarium } from '@/lib/db';
import { formatNumber, parseNumber } from '@/lib/i18n';
import { L_PER_GAL } from '@/lib/params';
import { completeKind } from '@/lib/reminders';
import { useUI } from '@/lib/settings';

export default function WaterChangeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const aquariumId = Number(id);
  const db = useSQLiteContext();
  const { t, lang, settings } = useUI();
  const gal = settings.volumeUnit === 'gal';

  const [aquarium, setAquarium] = useState<Aquarium | null>(null);
  const [date, setDate] = useState(() => Date.now());
  const [percent, setPercent] = useState('30');
  /** null until the user types a volume by hand; until then it follows the percentage. */
  const [amountInput, setAmountInput] = useState<string | null>(null);
  const [conditioner, setConditioner] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAquarium(db, aquariumId).then(setAquarium);
  }, [db, aquariumId]);

  const derivedAmount = (() => {
    const p = parseNumber(percent);
    if (!aquarium || p == null) return '';
    const liters = (aquarium.volume_l * p) / 100;
    return formatNumber(lang, gal ? liters / L_PER_GAL : liters, 1).replace(/\s/g, '');
  })();
  const amount = amountInput ?? derivedAmount;

  const save = async () => {
    const p = parseNumber(percent);
    const v = parseNumber(amount);
    if (p == null && v == null) return setError(t('common.invalidNumber'));
    setSaving(true);
    try {
      const liters = v == null ? null : gal ? v * L_PER_GAL : v;
      const pct = p ?? (liters != null && aquarium ? (liters / aquarium.volume_l) * 100 : null);
      await addWaterChange(db, {
        aquarium_id: aquariumId,
        date,
        percent: pct,
        liters,
        conditioner: conditioner.trim() || null,
        notes: notes.trim() || null,
      });
      await completeKind(db, aquariumId, 'water_change', t);
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen footer={<Button label={t('common.save')} onPress={save} loading={saving} />}>
      <Stack.Screen options={{ title: t('wc.title'), presentation: 'modal' }} />
      {aquarium ? <Muted>{aquarium.name}</Muted> : null}
      <DateField label={t('wc.date')} value={date} onChange={setDate} maximumDate={new Date()} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Field label={t('wc.percent')} value={percent} onChangeText={setPercent} keyboardType="decimal-pad" suffix="%" error={error} />
        <Field
          label={gal ? 'Gal' : t('wc.liters')}
          value={amount}
          onChangeText={setAmountInput}
          keyboardType="decimal-pad"
          suffix={gal ? 'gal' : 'L'}
        />
      </View>
      <Field
        label={`${t('wc.conditioner')} (${t('common.optional')})`}
        value={conditioner}
        onChangeText={setConditioner}
        placeholder={t('wc.conditionerPh')}
      />
      <Field label={`${t('common.notes')} (${t('common.optional')})`} value={notes} onChangeText={setNotes} multiline />
    </Screen>
  );
}
