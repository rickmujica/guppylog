import { router, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { Alert, Image, Pressable, Text, View } from 'react-native';

import { Button, Heading, Icon, IconButton, List, ListRow, Muted, Screen, Section } from '@/components/ui';
import {
  deleteReminder,
  deleteWaterChange,
  getAquarium,
  latestReadings,
  listReminders,
  listWaterChanges,
  type ReminderWithAquarium,
} from '@/lib/db';
import { dayDiff, formatDate, formatNumber, relativeDay } from '@/lib/i18n';
import { formatParam, formatVolume, paramsFor, rangeStatus } from '@/lib/params';
import { cancelReminder, completeReminder, reminderLabel } from '@/lib/reminders';
import { useUI } from '@/lib/settings';
import { radius } from '@/lib/theme';
import { useFocusQuery } from '@/lib/use-query';

const KIND_ICON = {
  water_change: 'water-outline',
  test: 'flask-outline',
  filter: 'funnel-outline',
  feed: 'nutrition-outline',
  custom: 'alarm-outline',
} as const;

export default function AquariumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const aquariumId = Number(id);
  const { theme, t, lang, settings } = useUI();

  const { data, reload, db } = useFocusQuery(
    async (db) => {
      const [aquarium, readings, changes, reminders] = await Promise.all([
        getAquarium(db, aquariumId),
        latestReadings(db, aquariumId),
        listWaterChanges(db, aquariumId, 5),
        listReminders(db, aquariumId),
      ]);
      return { aquarium, readings, changes, reminders };
    },
    aquariumId,
  );

  const a = data?.aquarium;
  if (!data) return <Screen>{null}</Screen>;
  if (!a) {
    return (
      <Screen>
        <Muted>—</Muted>
      </Screen>
    );
  }

  const lastReadingAt = data.readings.reduce((max, r) => Math.max(max, r.measured_at), 0);
  const defs = paramsFor(a.type).filter((d) => data.readings.some((r) => r.param === d.id));

  const markDone = async (r: ReminderWithAquarium) => {
    await completeReminder(db, r, t);
    reload();
  };

  const reminderMenu = (r: ReminderWithAquarium) => {
    Alert.alert(reminderLabel(t, r), t('rem.everyN', { n: r.interval_days }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await cancelReminder(r);
          await deleteReminder(db, r.id);
          reload();
        },
      },
    ]);
  };

  const changeMenu = (changeId: number) => {
    Alert.alert(t('wc.title'), t('common.confirmDelete'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteWaterChange(db, changeId);
          reload();
        },
      },
    ]);
  };

  return (
    <Screen
      footer={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            label={t('detail.logWater')}
            variant="secondary"
            style={{ flex: 1 }}
            onPress={() => router.push(`/aquarium/${aquariumId}/water`)}
          />
          <Button label={t('detail.logParams')} style={{ flex: 1 }} onPress={() => router.push(`/aquarium/${aquariumId}/params`)} />
        </View>
      }>
      <Stack.Screen
        options={{
          title: a.name,
          headerRight: () => (
            <IconButton icon="create-outline" label={t('common.edit')} onPress={() => router.push(`/aquarium/form?id=${aquariumId}`)} />
          ),
        }}
      />

      {a.photo_uri ? (
        <Image source={{ uri: a.photo_uri }} style={{ height: 160, borderRadius: radius.lg, backgroundColor: theme.surface }} />
      ) : null}

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Info label={t('aq.volume')} value={formatVolume(a.volume_l, settings.volumeUnit, lang)} />
        <Info label={t('aq.type')} value={t(`aq.type.${a.type}`)} />
        <Info label={t('aq.since')} value={formatDate(lang, a.started_at ?? a.created_at, { month: 'short', year: 'numeric' })} />
      </View>

      <Section title={t('detail.lastParams')} right={lastReadingAt ? <Muted style={{ fontSize: 13 }}>{relativeDay(t, lastReadingAt)}</Muted> : null}>
        {defs.length === 0 ? (
          <Muted>{t('detail.noParams')}</Muted>
        ) : (
          <List>
            {defs.map((def, i) => {
              const r = data.readings.find((x) => x.param === def.id)!;
              const status = rangeStatus(def, a.type, r.value);
              const suffix = status === 'high' ? ` · ${t('detail.high')}` : status === 'low' ? ` · ${t('detail.low')}` : '';
              return (
                <ListRow
                  key={def.id}
                  label={def.label[lang]}
                  value={formatParam(def, r.value, lang, settings.tempUnit) + suffix}
                  valueColor={status === 'ok' ? undefined : theme.warn}
                  last={i === defs.length - 1}
                />
              );
            })}
          </List>
        )}
      </Section>

      <Section
        title={t('detail.reminders')}
        right={
          <Pressable onPress={() => router.push(`/aquarium/${aquariumId}/reminder`)} accessibilityRole="button" hitSlop={8}>
            <Text style={{ color: theme.accent, fontWeight: '600', fontSize: 15 }}>{t('detail.addReminder')}</Text>
          </Pressable>
        }>
        {data.reminders.length === 0 ? <Muted>{t('detail.noReminders')}</Muted> : null}
        {data.reminders.map((r) => {
          const due = dayDiff(r.next_due) <= 0;
          return (
            <Pressable
              key={r.id}
              onLongPress={() => reminderMenu(r)}
              accessibilityHint={t('common.delete')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 10,
                paddingLeft: 14,
                paddingRight: 8,
                borderRadius: radius.md,
                backgroundColor: due ? theme.accentSoft : 'transparent',
                borderWidth: due ? 0 : 1,
                borderColor: theme.border,
              }}>
              <Icon name={KIND_ICON[r.kind]} size={20} color={due ? theme.accent : theme.muted} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>{reminderLabel(t, r)}</Text>
                <Text style={{ fontSize: 13, color: theme.muted }}>
                  {relativeDay(t, r.next_due)} · {t('rem.everyN', { n: r.interval_days })}
                </Text>
              </View>
              <Pressable
                onPress={() => markDone(r)}
                accessibilityRole="button"
                accessibilityLabel={t('rem.done')}
                style={{ height: 36, paddingHorizontal: 12, borderRadius: radius.pill, justifyContent: 'center', borderWidth: 1, borderColor: due ? theme.accent : theme.border }}>
                <Text style={{ color: due ? theme.accent : theme.text, fontWeight: '600', fontSize: 13 }}>{t('rem.done')}</Text>
              </Pressable>
            </Pressable>
          );
        })}
      </Section>

      <Section title={t('detail.waterChanges')}>
        {data.changes.length === 0 ? (
          <Muted>{t('detail.noWaterChanges')}</Muted>
        ) : (
          <List>
            {data.changes.map((c, i) => {
              const parts = [
                c.percent != null ? `${formatNumber(lang, c.percent, 0)} %` : null,
                c.liters != null ? formatVolume(c.liters, settings.volumeUnit, lang) : null,
                c.conditioner,
              ].filter(Boolean);
              return (
                <ListRow
                  key={c.id}
                  label={formatDate(lang, c.date)}
                  value={parts.join(' · ')}
                  onPress={() => changeMenu(c.id)}
                  last={i === data.changes.length - 1}
                />
              );
            })}
          </List>
        )}
      </Section>

      {a.notes ? (
        <Section title={t('common.notes')}>
          <Muted>{a.notes}</Muted>
        </Section>
      ) : null}
    </Screen>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  const { theme } = useUI();
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text style={{ fontSize: 12, color: theme.muted }}>{label}</Text>
      <Heading style={{ fontSize: 16 }}>{value}</Heading>
    </View>
  );
}
