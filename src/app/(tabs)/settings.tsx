import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useSQLiteContext } from 'expo-sqlite';
import { Platform, Pressable, Switch, Text, View } from 'react-native';

import { List, ListRow, Muted, Overline, Screen, Segmented, Title } from '@/components/ui';
import { alert } from '@/lib/alert';
import { exportAll, importAll, isBackup } from '@/lib/db';
import { makeTranslate, type Lang } from '@/lib/i18n';
import { rescheduleAll } from '@/lib/reminders';
import { useSettings, type TempUnit, type VolumeUnit } from '@/lib/settings';
import { ACCENT_NAMES, ACCENTS } from '@/lib/theme';

export default function SettingsScreen() {
  const db = useSQLiteContext();
  const { settings, update, theme, t } = useSettings();
  const dark = theme.mode === 'dark';

  const setLang = async (lang: Lang) => {
    update({ lang });
    // Scheduled notifications keep the text they were created with; rebuild them in the new language.
    await rescheduleAll(db, makeTranslate(lang));
  };

  const exportBackup = async () => {
    const data = await exportAll(db);
    const stamp = new Date().toISOString().slice(0, 10);
    if (Platform.OS === 'web') {
      // Browsers have no share sheet for files: download the JSON instead.
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
      link.download = `guppylog-${stamp}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
      return;
    }
    const file = new File(Paths.cache, `guppylog-${stamp}.json`);
    if (file.exists) file.delete();
    file.create();
    file.writeSync(JSON.stringify(data));
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: t('set.export') });
    } else {
      alert(t('set.exportDone'), file.uri);
    }
  };

  const importBackup = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: ['application/json', 'text/plain', '*/*'], copyToCacheDirectory: true });
    if (res.canceled || !res.assets[0]) return;
    let parsed: unknown;
    try {
      const uri = res.assets[0].uri;
      parsed = JSON.parse(Platform.OS === 'web' ? await (await fetch(uri)).text() : await new File(uri).text());
    } catch {
      parsed = null;
    }
    if (!isBackup(parsed)) return alert(t('set.import'), t('set.importError'));
    const backup = parsed;
    alert(t('set.import'), t('set.importConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('set.import'),
        style: 'destructive',
        onPress: async () => {
          await importAll(db, backup);
          await rescheduleAll(db, t);
          alert(t('set.importDone'));
        },
      },
    ]);
  };

  return (
    <Screen tab>
      <Title>{t('set.title')}</Title>

      <View style={{ gap: 10 }}>
        <Overline>{t('set.appearance')}</Overline>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 14,
          }}>
          <View style={{ gap: 2, flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: theme.text }}>{t('set.darkMode')}</Text>
            <Muted style={{ fontSize: 13 }}>{t('set.darkHint')}</Muted>
          </View>
          <Switch
            value={dark}
            onValueChange={(v) => update({ mode: v ? 'dark' : 'light' })}
            trackColor={{ false: '#D4D4D8', true: theme.accent }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#D4D4D8"
            accessibilityLabel={t('set.darkMode')}
          />
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Overline>{t('set.accent')}</Overline>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {ACCENT_NAMES.map((name) => {
            const selected = settings.accent === name;
            const color = dark ? ACCENTS[name].dark : ACCENTS[name].light;
            return (
              <Pressable
                key={name}
                onPress={() => update({ accent: name })}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={t(`set.accent.${name}`)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  gap: 8,
                  paddingVertical: 12,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: selected ? theme.accent : theme.border,
                }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: color }} />
                <Text style={{ fontSize: 13, fontWeight: '500', color: theme.text }}>{t(`set.accent.${name}`)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Overline>{t('set.language')}</Overline>
        <Segmented<Lang>
          label={t('set.language')}
          value={settings.lang}
          onChange={setLang}
          options={[
            { value: 'es', label: 'Español' },
            { value: 'en', label: 'English' },
          ]}
        />
      </View>

      <View style={{ gap: 10 }}>
        <Overline>{t('set.units')}</Overline>
        <Segmented<TempUnit>
          label={t('set.temperature')}
          value={settings.tempUnit}
          onChange={(tempUnit) => update({ tempUnit })}
          options={[
            { value: 'C', label: '°C' },
            { value: 'F', label: '°F' },
          ]}
        />
        <Segmented<VolumeUnit>
          label={t('set.volume')}
          value={settings.volumeUnit}
          onChange={(volumeUnit) => update({ volumeUnit })}
          options={[
            { value: 'L', label: 'Litros / Liters' },
            { value: 'gal', label: 'Galones / Gallons' },
          ]}
        />
      </View>

      <View style={{ gap: 10 }}>
        <Overline>{t('set.data')}</Overline>
        <List>
          <ListRow label={t('set.export')} onPress={exportBackup} right={<Text style={{ color: theme.accent, fontWeight: '600' }}>JSON</Text>} />
          <ListRow label={t('set.import')} onPress={importBackup} last />
        </List>
      </View>

      <Muted style={{ textAlign: 'center', fontSize: 12 }}>{t('set.version', { version: Constants.expoConfig?.version ?? '1.0.0' })}</Muted>
    </Screen>
  );
}
