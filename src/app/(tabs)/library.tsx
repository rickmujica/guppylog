import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Photo } from '@/components/photo';
import { Chip, Icon, Muted, Screen, Segmented, Title } from '@/components/ui';
import { DISEASES } from '@/data/diseases';
import { FISH } from '@/data/fish';
import { useUI } from '@/lib/settings';

type Tab = 'fish' | 'diseases';

/** Lowercase without accents, so "anemona" finds "anémona". */
function norm(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export default function LibraryScreen() {
  const { theme, t, lang } = useUI();
  const [tab, setTab] = useState<Tab>('fish');
  const [query, setQuery] = useState('');

  const items = useMemo(() => {
    const q = norm(query.trim());
    if (tab === 'fish') {
      return FISH.filter((f) => f.water === 'freshwater')
        .filter((f) => !q || norm(`${f.name.es} ${f.name.en} ${f.scientific}`).includes(q))
        .sort((a, b) => a.name[lang].localeCompare(b.name[lang], lang))
        .map((f) => ({
          key: f.id,
          title: f.name[lang],
          subtitle: f.scientific,
          italic: true,
          tag: t(`lib.care.${f.care}`),
          tone: f.care === 'hard' ? ('warn' as const) : ('accent' as const),
          image: f.image,
          href: `/library/fish/${f.id}` as const,
        }));
    }
    return DISEASES.filter(
      (d) => !q || norm(`${d.name.es} ${d.name.en} ${d.symptoms[lang]} ${d.scientific ?? ''}`).includes(q),
    ).map((d) => ({
      key: d.id,
      title: d.name[lang],
      subtitle: d.kind[lang],
      italic: false,
      tag: t(`lib.severity.${d.severity}`),
      tone: d.severity === 'serious' ? ('warn' as const) : ('accent' as const),
      image: d.image,
      href: `/library/disease/${d.id}` as const,
    }));
  }, [tab, query, lang, t]);

  return (
    <Screen tab>
      <Title>{t('lib.title')}</Title>
      <Segmented<Tab>
        value={tab}
        onChange={(v) => {
          setTab(v);
          setQuery('');
        }}
        options={[
          { value: 'fish', label: t('lib.fish') },
          { value: 'diseases', label: t('lib.diseases') },
        ]}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          height: 46,
          paddingHorizontal: 14,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 12,
        }}>
        <Icon name="search" size={18} color={theme.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={tab === 'fish' ? t('lib.searchFish') : t('lib.searchDisease')}
          placeholderTextColor={theme.muted}
          accessibilityLabel={tab === 'fish' ? t('lib.searchFish') : t('lib.searchDisease')}
          autoCorrect={false}
          style={{ flex: 1, fontSize: 15, color: theme.text }}
        />
      </View>
      {tab === 'fish' ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Chip label={t('lib.freshwater')} tone="solid" />
          <Chip label={t('lib.saltwaterSoon')} tone="muted" dashed />
        </View>
      ) : null}

      <View>
        {items.length === 0 ? <Muted>{t('lib.noResults')}</Muted> : null}
        {items.map((it) => (
          <Pressable
            key={it.key}
            onPress={() => router.push(it.href)}
            accessibilityRole="button"
            accessibilityLabel={it.title}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: theme.border,
              opacity: pressed ? 0.6 : 1,
            })}>
            <Photo source={it.image} size={60} icon={tab === 'fish' ? 'fish-outline' : 'medkit-outline'} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>{it.title}</Text>
              <Text style={{ fontSize: 13, color: theme.muted, fontStyle: it.italic ? 'italic' : 'normal' }}>{it.subtitle}</Text>
            </View>
            <Chip label={it.tag} tone={it.tone} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
