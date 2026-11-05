import { router, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { DateField } from '@/components/date-field';
import { Button, Field, Screen } from '@/components/ui';
import { alert } from '@/lib/alert';
import { createReminder, REMINDER_KINDS, type ReminderKind } from '@/lib/db';
import { parseNumber } from '@/lib/i18n';
import { dueInDays, ensureNotificationPermission, rescheduleReminder } from '@/lib/reminders';
import { useUI } from '@/lib/settings';
import { radius } from '@/lib/theme';

const DEFAULT_INTERVAL: Record<ReminderKind, number> = { water_change: 7, test: 14, filter: 30, feed: 1, custom: 7 };

export default function NewReminderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const aquariumId = Number(id);
  const db = useSQLiteContext();
  const { theme, t } = useUI();

  const [kind, setKind] = useState<ReminderKind>('water_change');
  const [title, setTitle] = useState('');
  const [interval, setInterval] = useState(String(DEFAULT_INTERVAL.water_change));
  const [firstDue, setFirstDue] = useState(() => dueInDays(DEFAULT_INTERVAL.water_change));
  const [errors, setErrors] = useState<{ title?: string; interval?: string }>({});
  const [saving, setSaving] = useState(false);

  const pickKind = (k: ReminderKind) => {
    setKind(k);
    setInterval(String(DEFAULT_INTERVAL[k]));
    setFirstDue(dueInDays(DEFAULT_INTERVAL[k]));
  };

  const save = async () => {
    const n = parseNumber(interval);
    const next: typeof errors = {};
    if (kind === 'custom' && !title.trim()) next.title = t('common.required');
    if (n == null || n < 1 || !Number.isInteger(n)) next.interval = t('common.invalidNumber');
    setErrors(next);
    if (Object.keys(next).length > 0 || n == null) return;

    setSaving(true);
    try {
      const granted = await ensureNotificationPermission();
      const d = new Date(firstDue);
      d.setHours(9, 0, 0, 0);
      const reminderId = await createReminder(db, {
        aquarium_id: aquariumId,
        kind,
        title: kind === 'custom' ? title.trim() : null,
        interval_days: n,
        next_due: d.getTime(),
      });
      await rescheduleReminder(db, reminderId, d.getTime(), t);
      if (!granted) alert(t('rem.newTitle'), t('rem.permDenied'));
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen footer={<Button label={t('common.save')} onPress={save} loading={saving} />}>
      <Stack.Screen options={{ title: t('rem.newTitle'), presentation: 'modal' }} />
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 13, color: theme.muted }}>{t('rem.kind')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {REMINDER_KINDS.map((k) => {
            const selected = k === kind;
            return (
              <Pressable
                key={k}
                onPress={() => pickKind(k)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                style={{
                  paddingHorizontal: 14,
                  height: 40,
                  borderRadius: radius.pill,
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: selected ? theme.accent : theme.border,
                  backgroundColor: selected ? theme.accentSoft : 'transparent',
                }}>
                <Text style={{ color: selected ? theme.accent : theme.text, fontWeight: '600', fontSize: 14 }}>{t(`rem.kind.${k}`)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      {kind === 'custom' ? <Field label={t('rem.customTitle')} value={title} onChangeText={setTitle} error={errors.title} /> : null}
      <Field label={t('rem.every')} value={interval} onChangeText={setInterval} keyboardType="number-pad" error={errors.interval} />
      <DateField label={t('rem.firstDue')} value={firstDue} onChange={setFirstDue} minimumDate={new Date()} />
    </Screen>
  );
}
