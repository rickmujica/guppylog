import { router } from 'expo-router';
import { Image, View } from 'react-native';

import { Button, Card, Chip, Empty, Heading, IconButton, Muted, Screen, Stat, Title } from '@/components/ui';
import { latestReadingsAll, listAquariums, listReminders, type Reading } from '@/lib/db';
import { dayDiff, relativeDay } from '@/lib/i18n';
import { formatParam, formatVolume, getParam, rangeStatus } from '@/lib/params';
import { useUI } from '@/lib/settings';
import { useFocusQuery } from '@/lib/use-query';

const CARD_PARAMS = ['temp', 'ph', 'nitrate'] as const;

export default function HomeScreen() {
  const { theme, t, lang, settings } = useUI();
  const { data } = useFocusQuery(async (db) => {
    const [aquariums, readings, reminders] = await Promise.all([listAquariums(db), latestReadingsAll(db), listReminders(db)]);
    return { aquariums, readings, reminders };
  });

  const aquariums = data?.aquariums ?? [];
  const dueToday = (data?.reminders ?? []).filter((r) => dayDiff(r.next_due) <= 0);
  const pendingText =
    dueToday.length === 0 ? t('home.allDone') : dueToday.length === 1 ? t('home.pendingOne') : t('home.pending', { n: dueToday.length });

  const readingsFor = (id: number) => (data?.readings ?? []).filter((r) => r.aquarium_id === id);

  return (
    <Screen
      tab
      footer={aquariums.length > 0 ? <Button label={t('home.new')} icon="add" onPress={() => router.push('/aquarium/form')} /> : undefined}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ gap: 4, flex: 1 }}>
          <Title>{t('home.title')}</Title>
          {aquariums.length > 0 ? <Muted>{pendingText}</Muted> : null}
        </View>
        <IconButton icon="settings-outline" label={t('tab.settings')} onPress={() => router.push('/settings')} />
      </View>

      {data && aquariums.length === 0 ? (
        <Empty
          icon="fish-outline"
          title={t('home.empty.title')}
          body={t('home.empty.body')}
          action={<Button label={t('home.new')} icon="add" onPress={() => router.push('/aquarium/form')} style={{ alignSelf: 'stretch' }} />}
        />
      ) : null}

      {aquariums.map((a) => {
        const readings = readingsFor(a.id);
        const due = a.next_due;
        const dueDays = due != null ? dayDiff(due) : null;
        return (
          <Card key={a.id} onPress={() => router.push(`/aquarium/${a.id}`)} accessibilityLabel={a.name}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
              {a.photo_uri ? (
                <Image source={{ uri: a.photo_uri }} style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: theme.surface }} />
              ) : null}
              <View style={{ flex: 1, gap: 2 }}>
                <Heading>{a.name}</Heading>
                <Muted>
                  {formatVolume(a.volume_l, settings.volumeUnit, lang)} · {t(`aq.type.${a.type}`)}
                </Muted>
              </View>
              {due != null && dueDays != null ? (
                <Chip label={relativeDay(t, due)} tone={dueDays <= 0 ? 'accent' : 'muted'} />
              ) : null}
            </View>
            {readings.length > 0 ? (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {CARD_PARAMS.map((id) => {
                  const def = getParam(id)!;
                  const r = readings.find((x: Reading) => x.param === id);
                  return (
                    <Stat
                      key={id}
                      label={def.label[lang]}
                      value={r ? formatParam(def, r.value, lang, settings.tempUnit) : '–'}
                      warn={r ? rangeStatus(def, a.type, r.value) !== 'ok' : false}
                    />
                  );
                })}
              </View>
            ) : null}
            <Muted style={{ fontSize: 13 }}>
              {a.last_change ? t('home.lastChange', { when: relativeDay(t, a.last_change) }) : t('home.noChanges')}
            </Muted>
          </Card>
        );
      })}
    </Screen>
  );
}
