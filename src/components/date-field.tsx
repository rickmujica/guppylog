import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, Text, View } from 'react-native';

import { formatDate } from '@/lib/i18n';
import { useUI } from '@/lib/settings';

/** A date picker that looks like the other fields. Keeps the time of day of `value`. */
export function DateField({
  label,
  value,
  onChange,
  maximumDate,
  minimumDate,
}: {
  label: string;
  value: number;
  onChange: (ms: number) => void;
  maximumDate?: Date;
  minimumDate?: Date;
}) {
  const { theme, lang } = useUI();

  if (Platform.OS === 'ios') {
    return (
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 13, color: theme.muted }}>{label}</Text>
        <View style={{ alignItems: 'flex-start' }}>
          <DateTimePicker
            value={new Date(value)}
            mode="date"
            display="compact"
            accentColor={theme.accent}
            themeVariant={theme.mode}
            locale={lang}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            onChange={(_, d) => d && onChange(d.getTime())}
          />
        </View>
      </View>
    );
  }

  const open = () =>
    DateTimePickerAndroid.open({
      value: new Date(value),
      mode: 'date',
      maximumDate,
      minimumDate,
      onChange: (event, d) => {
        if (event.type === 'set' && d) onChange(d.getTime());
      },
    });

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 13, color: theme.muted }}>{label}</Text>
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={{ height: 50, borderWidth: 1, borderColor: theme.border, borderRadius: 12, paddingHorizontal: 12, justifyContent: 'center' }}>
        <Text style={{ fontSize: 17, fontWeight: '500', color: theme.text }}>{formatDate(lang, value)}</Text>
      </Pressable>
    </View>
  );
}
