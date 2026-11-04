import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUI } from '@/lib/settings';
import { radius, space } from '@/lib/theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function Icon({ name, size = 22, color }: { name: IconName; size?: number; color?: string }) {
  const { theme } = useUI();
  return <Ionicons name={name} size={size} color={color ?? theme.text} />;
}

/** Full screen with themed background. `tab` screens get top padding for the status bar. */
export function Screen({
  children,
  scroll = true,
  tab = false,
  footer,
  contentStyle,
}: {
  children: ReactNode;
  scroll?: boolean;
  tab?: boolean;
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const { theme } = useUI();
  const insets = useSafeAreaInsets();
  const padding: ViewStyle = {
    paddingHorizontal: space.xl,
    paddingTop: tab ? insets.top + space.lg : space.lg,
    paddingBottom: footer ? space.lg : insets.bottom + space.xxl,
    gap: space.lg,
  };
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {scroll ? (
        <ScrollView contentContainerStyle={[padding, contentStyle]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, padding, contentStyle]}>{children}</View>
      )}
      {footer ? (
        <View style={{ paddingHorizontal: space.xl, paddingTop: space.sm, paddingBottom: insets.bottom + space.md }}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}

type TextProps = { children: ReactNode; style?: StyleProp<TextStyle>; numberOfLines?: number };

export function Title({ children, style }: TextProps) {
  const { theme } = useUI();
  return <Text style={[styles.title, { color: theme.text }, style]}>{children}</Text>;
}

export function Heading({ children, style }: TextProps) {
  const { theme } = useUI();
  return <Text style={[styles.heading, { color: theme.text }, style]}>{children}</Text>;
}

export function Overline({ children, style, accent }: TextProps & { accent?: boolean }) {
  const { theme } = useUI();
  return <Text style={[styles.overline, { color: accent ? theme.accent : theme.muted }, style]}>{children}</Text>;
}

export function Body({ children, style, numberOfLines }: TextProps) {
  const { theme } = useUI();
  return (
    <Text numberOfLines={numberOfLines} style={[styles.body, { color: theme.text }, style]}>
      {children}
    </Text>
  );
}

export function Muted({ children, style, numberOfLines }: TextProps) {
  const { theme } = useUI();
  return (
    <Text numberOfLines={numberOfLines} style={[styles.muted, { color: theme.muted }, style]}>
      {children}
    </Text>
  );
}

export function Card({
  children,
  onPress,
  style,
  filled,
  accessibilityLabel,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  filled?: boolean;
  accessibilityLabel?: string;
}) {
  const { theme } = useUI();
  const base: ViewStyle = {
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.md,
    borderWidth: filled ? 0 : 1,
    borderColor: theme.border,
    backgroundColor: filled ? theme.surface : theme.bg,
  };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [base, { opacity: pressed ? 0.7 : 1 }, style]}>
      {children}
    </Pressable>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useUI();
  const primary = variant === 'primary';
  const color = primary ? theme.onAccent : variant === 'danger' ? theme.danger : theme.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: primary ? theme.accent : 'transparent',
          borderWidth: primary ? 0 : 1,
          borderColor: theme.border,
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={20} color={color} /> : null}
          <Text style={[styles.buttonText, { color }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

export function IconButton({ icon, onPress, label, color }: { icon: IconName; onPress: () => void; label: string; color?: string }) {
  const { theme } = useUI();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.6 : 1 }]}>
      <Ionicons name={icon} size={22} color={color ?? theme.text} />
    </Pressable>
  );
}

export function Field({
  label,
  hint,
  error,
  suffix,
  warn,
  ...input
}: TextInputProps & { label: string; hint?: string; error?: string; suffix?: string; warn?: boolean }) {
  const { theme } = useUI();
  const borderColor = error ? theme.danger : warn ? theme.warn : theme.border;
  return (
    <View style={{ gap: 6, flex: 1 }}>
      <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
      <View style={[styles.inputBox, { borderColor, backgroundColor: theme.bg, minHeight: input.multiline ? 88 : 50 }]}>
        <TextInput
          placeholderTextColor={theme.muted}
          accessibilityLabel={label}
          {...input}
          style={[
            styles.input,
            { color: theme.text, textAlignVertical: input.multiline ? 'top' : 'center', paddingTop: input.multiline ? 12 : 0 },
            input.style,
          ]}
        />
        {suffix ? <Text style={[styles.suffix, { color: theme.muted }]}>{suffix}</Text> : null}
      </View>
      {error ? (
        <Text style={[styles.hint, { color: theme.danger }]}>{error}</Text>
      ) : hint ? (
        <Text style={[styles.hint, { color: warn ? theme.warn : theme.muted }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label?: string;
}) {
  const { theme } = useUI();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={[styles.segmented, { backgroundColor: theme.surface }]}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={[styles.segment, { backgroundColor: selected ? theme.bg : 'transparent' }]}>
            <Text style={[styles.segmentText, { color: theme.text }]} numberOfLines={1}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Chip({ label, tone = 'accent', dashed }: { label: string; tone?: 'accent' | 'muted' | 'warn' | 'solid'; dashed?: boolean }) {
  const { theme } = useUI();
  const bg = tone === 'accent' ? theme.accentSoft : tone === 'solid' ? theme.accent : dashed ? 'transparent' : theme.surface;
  const fg = tone === 'accent' ? theme.accent : tone === 'solid' ? theme.onAccent : tone === 'warn' ? theme.warn : theme.muted;
  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: bg, borderWidth: dashed ? 1 : 0, borderStyle: dashed ? 'dashed' : 'solid', borderColor: theme.border },
      ]}>
      <Text style={[styles.chipText, { color: fg }]}>{label}</Text>
    </View>
  );
}

/** A list of rows inside a bordered box. */
export function List({ children }: { children: ReactNode }) {
  const { theme } = useUI();
  return <View style={{ borderWidth: 1, borderColor: theme.border, borderRadius: radius.md, overflow: 'hidden' }}>{children}</View>;
}

export function ListRow({
  label,
  value,
  valueColor,
  onPress,
  last,
  right,
}: {
  label: string;
  value?: string;
  valueColor?: string;
  onPress?: () => void;
  last?: boolean;
  right?: ReactNode;
}) {
  const { theme } = useUI();
  const content = (
    <>
      <Text style={[styles.rowLabel, { color: theme.text }]} numberOfLines={1}>
        {label}
      </Text>
      {right ?? (value ? <Text style={[styles.rowValue, { color: valueColor ?? theme.text }]}>{value}</Text> : null)}
    </>
  );
  const style: ViewStyle = { ...styles.row, borderBottomWidth: last ? 0 : 1, borderBottomColor: theme.border };
  if (!onPress) return <View style={style}>{content}</View>;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [style, { opacity: pressed ? 0.6 : 1 }]}>
      {content}
    </Pressable>
  );
}

export function Section({ title, right, children }: { title: string; right?: ReactNode; children: ReactNode }) {
  return (
    <View style={{ gap: space.sm + 2 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Heading>{title}</Heading>
        {right}
      </View>
      {children}
    </View>
  );
}

export function Empty({ icon, title, body, action }: { icon: IconName; title: string; body?: string; action?: ReactNode }) {
  const { theme } = useUI();
  return (
    <View style={{ alignItems: 'center', gap: space.md, paddingVertical: space.xxl * 2, paddingHorizontal: space.lg }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: theme.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={30} color={theme.accent} />
      </View>
      <Heading style={{ textAlign: 'center' }}>{title}</Heading>
      {body ? <Muted style={{ textAlign: 'center' }}>{body}</Muted> : null}
      {action}
    </View>
  );
}

export function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  const { theme } = useUI();
  return (
    <View style={{ flex: 1, gap: 2, padding: 10, borderRadius: 12, backgroundColor: theme.surface }}>
      <Text style={{ fontSize: 12, color: theme.muted }}>{label}</Text>
      <Text style={{ fontSize: 16, fontWeight: '600', color: warn ? theme.warn : theme.text }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  heading: { fontSize: 17, fontWeight: '600' },
  overline: { fontSize: 13, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' },
  body: { fontSize: 15, lineHeight: 22 },
  muted: { fontSize: 14, lineHeight: 20 },
  button: {
    height: 52,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    paddingHorizontal: space.lg,
  },
  buttonText: { fontSize: 16, fontWeight: '600' },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 13 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12 },
  input: { flex: 1, fontSize: 17, fontWeight: '500', minHeight: 48 },
  suffix: { fontSize: 13, marginLeft: 6 },
  hint: { fontSize: 12 },
  segmented: { flexDirection: 'row', padding: 4, borderRadius: 12 },
  segment: { flex: 1, height: 40, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  segmentText: { fontSize: 15, fontWeight: '600' },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' },
  chipText: { fontSize: 12, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, minHeight: 48, gap: space.md },
  rowLabel: { fontSize: 15, flexShrink: 1 },
  rowValue: { fontSize: 15, fontWeight: '600' },
});
