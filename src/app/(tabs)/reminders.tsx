import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Empty, Screen, Section, Title } from '@/components/ui';
import { listReminders, type ReminderWithAquarium } from '@/lib/db';
import { dayDiff, relativeDay } from '@/lib/i18n';
import { completeReminder, reminderLabel } from '@/lib/reminders';
import { useUI } from '@/lib/settings';
import { radius } from '@/lib/theme';
import { useFocusQuery } from '@/lib/use-query';

export default function RemindersScreen() {
  const { theme, t } = useUI();
  const { data, reload, db } = useFocusQuery((db) => listReminders(db));
  const list = data ?? [];

  const due = list.filter((r) => dayDiff(r.next_due) <= 0);
  const upcoming = list.filter((r) => dayDiff(r.next_due) > 0);

  const done = async (r: ReminderWithAquarium) => {
    await completeReminder(db, r, t);
    reload();
  };

  const row = (r: ReminderWithAquarium) => {
    const isDue = dayDiff(r.next_due) <= 0;
    const late = -dayDiff(r.next_due);
    return (
      <Pressable
        key={r.id}
        onPress={() => router.push(`/aquarium/${r.aquarium_id}`)}
        accessibilityRole="button"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 12,
          paddingLeft: 14,
          paddingRight: 8,
          borderRadius: radius.md,
          backgroundColor: isDue ? theme.accentSoft : 'transparent',
          borderWidth: isDue ? 0 : 1,
          borderColor: theme.border,
        }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>{reminderLabel(t, r)}</Text>
          <Text style={{ fontSize: 13, color: theme.muted }}>
            {r.aquarium_name} · {late > 1 ? t('common.overdue', { n: late }) : relativeDay(t, r.next_due)}
          </Text>
        </View>
        <Pressable
          onPress={() => done(r)}
          accessibilityRole="button"
          accessibilityLabel={`${t('rem.done')}: ${reminderLabel(t, r)}`}
          style={{ height: 36, paddingHorizontal: 12, borderRadius: radius.pill, justifyContent: 'center', borderWidth: 1, borderColor: isDue ? theme.accent : theme.border }}>
          <Text style={{ color: isDue ? theme.accent : theme.text, fontWeight: '600', fontSize: 13 }}>{t('rem.done')}</Text>
        </Pressable>
      </Pressable>
    );
  };

  return (
    <Screen tab>
      <Title>{t('rem.title')}</Title>
      {data && list.length === 0 ? <Empty icon="notifications-outline" title={t('rem.empty')} /> : null}
      {due.length > 0 ? <Section title={t('common.today').replace(/^./, (c) => c.toUpperCase())}>{due.map(row)}</Section> : null}
      {upcoming.length > 0 ? <Section title={t('detail.reminders')}>{upcoming.map(row)}</Section> : null}
    </Screen>
  );
}
