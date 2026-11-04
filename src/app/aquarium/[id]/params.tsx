import { router, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { DateField } from '@/components/date-field';
import { Button, Field, Muted, Screen } from '@/components/ui';
import { addReadings, getAquarium, type Aquarium } from '@/lib/db';
import { parseNumber } from '@/lib/i18n';
import { displayUnit, formatIdeal, fromDisplay, paramsFor, rangeStatus, type ParamId } from '@/lib/params';
import { completeKind } from '@/lib/reminders';
import { useUI } from '@/lib/settings';

export default function ParamsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const aquariumId = Number(id);
  const db = useSQLiteContext();
  const { theme, t, lang, settings } = useUI();

  const [aquarium, setAquarium] = useState<Aquarium | null>(null);
  const [date, setDate] = useState(() => Date.now());
  const [values, setValues] = useState<Partial<Record<ParamId, string>>>({});
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAquarium(db, aquariumId).then(setAquarium);
  }, [db, aquariumId]);

  if (!aquarium) return <Screen>{null}</Screen>;
  const defs = paramsFor(aquarium.type);

  const save = async () => {
    const parsed: { param: ParamId; value: number }[] = [];
    for (const def of defs) {
      const n = parseNumber(values[def.id] ?? '');
      if (n != null) parsed.push({ param: def.id, value: fromDisplay(def, n, settings.tempUnit) });
    }
    if (parsed.length === 0) return setError(t('params.atLeastOne'));
    setSaving(true);
    try {
      // Keep the chosen day but use the current time, so several tests on one day stay in order.
      const now = new Date();
      const d = new Date(date);
      d.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
      await addReadings(db, aquariumId, d.getTime(), parsed, notes.trim() || null);
      await completeKind(db, aquariumId, 'test', t);
      router.back();
    } finally {
      setSaving(false);
    }
  };

  // Lay the fields out two per row.
  const rows: (typeof defs)[] = [];
  for (let i = 0; i < defs.length; i += 2) rows.push(defs.slice(i, i + 2));

  return (
    <Screen footer={<Button label={t('common.save')} onPress={save} loading={saving} />}>
      <Stack.Screen options={{ title: t('params.title'), presentation: 'modal' }} />
      <Muted>
        {aquarium.name} · {t('params.hint')}
      </Muted>
      <DateField label={t('wc.date')} value={date} onChange={setDate} maximumDate={new Date()} />
      {rows.map((row) => (
        <View key={row.map((d) => d.id).join()} style={{ flexDirection: 'row', gap: 12 }}>
          {row.map((def) => {
            const raw = values[def.id] ?? '';
            const n = parseNumber(raw);
            const status = n == null ? 'ok' : rangeStatus(def, aquarium.type, fromDisplay(def, n, settings.tempUnit));
            return (
              <Field
                key={def.id}
                label={def.label[lang]}
                value={raw}
                onChangeText={(s) => {
                  setError(undefined);
                  setValues((v) => ({ ...v, [def.id]: s }));
                }}
                keyboardType="decimal-pad"
                suffix={displayUnit(def, settings.tempUnit)}
                warn={status !== 'ok'}
                hint={t('params.ideal', { range: formatIdeal(def, aquarium.type, lang, settings.tempUnit) })}
              />
            );
          })}
          {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
      {error ? <Text style={{ color: theme.danger, fontSize: 13 }}>{error}</Text> : null}
      <Field
        label={`${t('common.notes')} (${t('common.optional')})`}
        value={notes}
        onChangeText={setNotes}
        placeholder={t('params.notesPh')}
        multiline
      />
    </Screen>
  );
}
