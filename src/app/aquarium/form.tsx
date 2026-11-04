import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';

import { DateField } from '@/components/date-field';
import { Button, Field, Icon, Screen } from '@/components/ui';
import { createAquarium, deleteAquarium, getAquarium, listReminders, updateAquarium } from '@/lib/db';
import { formatNumber, parseNumber } from '@/lib/i18n';
import { AQUARIUM_TYPES, L_PER_GAL, type AquariumType } from '@/lib/params';
import { cancelReminder } from '@/lib/reminders';
import { useUI } from '@/lib/settings';
import { radius } from '@/lib/theme';

/** Copies a picked image into the app's own folder so it survives cache cleanup. */
function persistPhoto(uri: string) {
  const dir = new Directory(Paths.document, 'photos');
  if (!dir.exists) dir.create({ intermediates: true });
  const ext = uri.split('.').pop()?.split('?')[0] || 'jpg';
  const dest = new File(dir, `aq-${Date.now()}.${ext}`);
  new File(uri).copySync(dest);
  return dest.uri;
}

export default function AquariumFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editingId = id ? Number(id) : null;
  const db = useSQLiteContext();
  const { theme, t, lang, settings } = useUI();

  const [name, setName] = useState('');
  const [volume, setVolume] = useState('');
  const [type, setType] = useState<AquariumType>('freshwater');
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [photo, setPhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: string; volume?: string }>({});
  const [saving, setSaving] = useState(false);

  const volumeUnit = settings.volumeUnit;

  useEffect(() => {
    if (!editingId) return;
    getAquarium(db, editingId).then((a) => {
      if (!a) return;
      setName(a.name);
      const v = volumeUnit === 'gal' ? a.volume_l / L_PER_GAL : a.volume_l;
      setVolume(formatNumber(lang, v, 1).replace(/\s/g, ''));
      setType(a.type);
      setStartedAt(a.started_at ?? a.created_at);
      setPhoto(a.photo_uri);
      setNotes(a.notes ?? '');
    });
  }, [db, editingId, lang, volumeUnit]);

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [4, 3] });
    if (!res.canceled && res.assets[0]) setPhoto(res.assets[0].uri);
  };

  const save = async () => {
    const v = parseNumber(volume);
    const next: typeof errors = {};
    if (!name.trim()) next.name = t('common.required');
    if (v == null || v <= 0) next.volume = t('common.invalidNumber');
    setErrors(next);
    if (Object.keys(next).length > 0 || v == null) return;

    setSaving(true);
    try {
      let photoUri = photo;
      if (photo && !photo.includes('/photos/aq-')) {
        try {
          photoUri = persistPhoto(photo);
        } catch {
          photoUri = photo;
        }
      }
      const input = {
        name: name.trim(),
        volume_l: volumeUnit === 'gal' ? v * L_PER_GAL : v,
        type,
        started_at: startedAt,
        photo_uri: photoUri,
        notes: notes.trim() || null,
      };
      if (editingId) {
        await updateAquarium(db, editingId, input);
        router.back();
      } else {
        const newId = await createAquarium(db, input);
        router.replace(`/aquarium/${newId}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = () => {
    if (!editingId) return;
    Alert.alert(t('aq.deleteTitle'), t('common.confirmDelete'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          const reminders = await listReminders(db, editingId);
          for (const r of reminders) await cancelReminder(r);
          await deleteAquarium(db, editingId);
          router.dismissTo('/');
        },
      },
    ]);
  };

  return (
    <Screen footer={<Button label={t('common.save')} onPress={save} loading={saving} />}>
      <Stack.Screen options={{ title: editingId ? t('aq.editTitle') : t('aq.newTitle') }} />

      <Pressable
        onPress={pickPhoto}
        accessibilityRole="button"
        accessibilityLabel={photo ? t('aq.changePhoto') : t('aq.addPhoto')}
        style={{ height: 160, borderRadius: radius.lg, backgroundColor: theme.surface, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        {photo ? (
          <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }} />
        ) : (
          <>
            <Icon name="camera-outline" color={theme.muted} size={28} />
            <Text style={{ color: theme.muted, fontSize: 14 }}>{t('aq.addPhoto')}</Text>
          </>
        )}
      </Pressable>

      <Field label={t('aq.name')} value={name} onChangeText={setName} placeholder={t('aq.namePh')} error={errors.name} />
      <Field
        label={t('aq.volume')}
        value={volume}
        onChangeText={setVolume}
        keyboardType="decimal-pad"
        suffix={volumeUnit === 'gal' ? 'gal' : 'L'}
        error={errors.volume}
      />

      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 13, color: theme.muted }}>{t('aq.type')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {AQUARIUM_TYPES.map((k) => {
            const selected = k === type;
            return (
              <Pressable
                key={k}
                onPress={() => setType(k)}
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
                <Text style={{ color: selected ? theme.accent : theme.text, fontWeight: '600', fontSize: 14 }}>{t(`aq.type.${k}`)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <DateField label={t('aq.startedAt')} value={startedAt} onChange={setStartedAt} maximumDate={new Date()} />
      <Field label={`${t('common.notes')} (${t('common.optional')})`} value={notes} onChangeText={setNotes} multiline />

      {editingId ? <Button label={t('aq.deleteTitle')} variant="danger" icon="trash-outline" onPress={remove} /> : null}
    </Screen>
  );
}
