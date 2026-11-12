import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, PressableProps, ScrollView, StyleProp, Switch, Text, TextInput, TextInputProps, TextProps, TextStyle, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors, fonts } from '@/theme';

type TypeProps = TextProps & { s?: number; lh?: number; c?: string };

export function Title({ s = 18, lh = 1.2, c = colors.ink, style, ...rest }: TypeProps) {
  return <Text {...rest} style={[{ fontFamily: fonts.title, fontSize: s, lineHeight: s * lh, color: c }, style]} />;
}

export function Sans({ s = 14, lh = 1.4, c = colors.ink, w = 400, style, ...rest }: TypeProps & { w?: 400 | 500 | 600 | 700 }) {
  const fontFamily = { 400: fonts.sans400, 500: fonts.sans500, 600: fonts.sans600, 700: fonts.sans700 }[w];
  return <Text {...rest} style={[{ fontFamily, fontSize: s, lineHeight: s * lh, color: c }, style]} />;
}

export function Overline({ children, c = colors.muted, style }: { children: ReactNode; c?: string; style?: StyleProp<TextStyle> }) {
  return (
    <Sans s={12} w={600} c={c} style={[{ letterSpacing: 0.6, textTransform: 'uppercase' }, style]}>
      {children}
    </Sans>
  );
}

export function Press({ style, ...rest }: Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      accessibilityRole="button"
      {...rest}
      style={({ pressed }) => [style, pressed && { opacity: 0.82 }]}
    />
  );
}

export const Chevron = ({ color = colors.chevron, w = 9, h = 16 }: { color?: string; w?: number; h?: number }) => (
  <Svg width={w} height={h} viewBox="0 0 8 14">
    <Path d="M1 1l6 6-6 6" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ArrowLeft = ({ color, w = 11, h = 19 }: { color: string; w?: number; h?: number }) => (
  <Svg width={w} height={h} viewBox="0 0 9 15">
    <Path d="M7.5 1.5L1.5 7.5l6 6" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ArrowRight = ({ color, w = 11, h = 19 }: { color: string; w?: number; h?: number }) => (
  <Svg width={w} height={h} viewBox="0 0 9 15">
    <Path d="M1.5 1.5l6 6-6 6" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const Plus = ({ color, size = 20, strokeWidth = 1.8 }: { color: string; size?: number; strokeWidth?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <Path d="M8 2v12M2 8h12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const Bookmark = ({ stroke, fill = 'none', w = 16, h = 20 }: { stroke: string; fill?: string; w?: number; h?: number }) => (
  <Svg width={w} height={h} viewBox="0 0 13 16">
    <Path d="M1.5 1.5h10v13l-5-3.5-5 3.5z" stroke={stroke} fill={fill} strokeWidth={1.6} strokeLinejoin="round" />
  </Svg>
);

export const BookIcon = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <Path d="M3 3h4.5a1.5 1.5 0 0 1 1.5 1.5V14a1.5 1.5 0 0 0-1.5-1.5H3zM13 3H8.5A1.5 1.5 0 0 0 7 4.5V14a1.5 1.5 0 0 1 1.5-1.5H13z" stroke={color} strokeWidth={1.5} fill="none" strokeLinejoin="round" />
  </Svg>
);

export const CalendarIcon = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <Rect x={2} y={3} width={12} height={11} rx={2.5} stroke={color} strokeWidth={1.6} fill="none" />
    <Path d="M2 7h12" stroke={color} strokeWidth={1.6} />
  </Svg>
);

export const SearchIcon = ({ color, size = 17 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 15 15">
    <Circle cx={6.5} cy={6.5} r={5} stroke={color} strokeWidth={1.6} fill="none" />
    <Path d="M10.5 10.5L14 14" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
  </Svg>
);

export const PhoneIcon = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <Path d="M3.5 1.5h2.5l1.2 3.2-1.6 1.1a8.5 8.5 0 0 0 4.6 4.6l1.1-1.6 3.2 1.2v2.5a1.5 1.5 0 0 1-1.6 1.5A12.5 12.5 0 0 1 2 3.1a1.5 1.5 0 0 1 1.5-1.6z" stroke={color} strokeWidth={1.4} fill="none" strokeLinejoin="round" />
  </Svg>
);

export function useTopPad() {
  const insets = useSafeAreaInsets();
  return Math.max(insets.top, 16) + 8;
}

// Rolagem padrão das telas. `bottom` reserva o espaço da navegação flutuante.
export function Screen({ children, gap = 22, bottom = 130, padded = true, contentStyle }: { children: ReactNode; gap?: number; bottom?: number; padded?: boolean; contentStyle?: StyleProp<ViewStyle> }) {
  const top = useTopPad();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={[padded && { paddingTop: top, paddingHorizontal: 20, gap }, { paddingBottom: bottom, flexGrow: 1 }, contentStyle]}>
      {children}
    </ScrollView>
  );
}

export function useGoBack(fallback: '/hoje' | '/saude' | '/preparar' | '/aprender' | '/welcome') {
  const router = useRouter();
  return () => (router.canGoBack() ? router.back() : router.replace(fallback));
}

export function BackButton({ onPress, light = false }: { onPress: () => void; light?: boolean }) {
  return (
    <Press onPress={onPress} accessibilityLabel="Voltar" style={[styles.circle, { backgroundColor: light ? colors.card : colors.ink }]}>
      <ArrowLeft color={light ? colors.ink : colors.bg} />
    </Press>
  );
}

export function CircleButton({ children, onPress, bg = colors.card, label, size = 44 }: { children: ReactNode; onPress?: () => void; bg?: string; label: string; size?: number }) {
  return (
    <Press onPress={onPress} accessibilityLabel={label} style={[styles.circle, { backgroundColor: bg, width: size, height: size }]}>
      {children}
    </Press>
  );
}

export function PageHeader({ title, sub, fallback, right }: { title: string; sub?: string; fallback: '/hoje' | '/saude' | '/preparar' | '/aprender'; right?: ReactNode }) {
  const back = useGoBack(fallback);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <BackButton onPress={back} />
      <View style={{ flex: 1 }}>
        <Title s={22} lh={1.15}>{title}</Title>
        {sub ? <Sans s={12} lh={1.35} c={colors.muted} style={{ marginTop: 3 }}>{sub}</Sans> : null}
      </View>
      {right}
    </View>
  );
}

export function TabTitle({ title, sub, right }: { title: string; sub: string; right?: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Title s={28} lh={1.15}>{title}</Title>
        <Sans s={13} lh={1.35} c={colors.muted} style={{ marginTop: 4 }}>{sub}</Sans>
      </View>
      {right}
    </View>
  );
}

export function PrimaryButton({ label, onPress, bg = colors.ink, icon }: { label: string; onPress: () => void; bg?: string; icon?: ReactNode }) {
  return (
    <Press onPress={onPress} style={{ height: 58, borderRadius: 999, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }}>
      {icon}
      <Sans s={15} w={600} c={colors.bg}>{label}</Sans>
    </Press>
  );
}

export function TextButton({ label, onPress, c = colors.mutedStrong, w = 500, s = 13 }: { label: string; onPress: () => void; c?: string; w?: 500 | 600; s?: number }) {
  return (
    <Press onPress={onPress} style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
      <Sans s={s} w={w} c={c}>{label}</Sans>
    </Press>
  );
}

export function Segmented({ options, value, onChange, fontSize = 13, minHeight = 42 }: { options: { id: string; label: string }[]; value: string; onChange: (id: string) => void; fontSize?: number; minHeight?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 4, backgroundColor: colors.sand, borderRadius: 999, padding: 4 }}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <Press key={o.id} onPress={() => onChange(o.id)} accessibilityState={{ selected: on }} style={{ flex: 1, borderRadius: 999, minHeight, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, backgroundColor: on ? colors.ink : 'transparent' }}>
            <Sans s={fontSize} w={600} c={on ? colors.bg : colors.mutedStrong} style={{ textAlign: 'center' }}>{o.label}</Sans>
          </Press>
        );
      })}
    </View>
  );
}

export function Chip({ label, on, onPress, compact = false, offBg = colors.card, offBorder = colors.line }: { label: string; on: boolean; onPress: () => void; compact?: boolean; offBg?: string; offBorder?: string }) {
  return (
    <Press
      onPress={onPress}
      accessibilityState={{ selected: on }}
      style={{ borderWidth: 1.5, borderColor: on ? colors.ink : offBorder, backgroundColor: on ? colors.ink : offBg, borderRadius: 999, paddingHorizontal: compact ? 14 : 16, minHeight: compact ? 40 : 44, justifyContent: 'center' }}>
      <Sans s={13} w={500} c={on ? colors.bg : colors.ink}>{label}</Sans>
    </Press>
  );
}

export const Wrap = ({ children, gap = 8 }: { children: ReactNode; gap?: number }) => <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>{children}</View>;

export function Card({ children, style, bg = colors.card, radius = 24 }: { children: ReactNode; style?: StyleProp<ViewStyle>; bg?: string; radius?: number }) {
  return <View style={[{ backgroundColor: bg, borderRadius: radius }, style]}>{children}</View>;
}

export function RowButton({ title, sub, onPress, icon, iconBg }: { title: string; sub: string; onPress: () => void; icon: ReactNode; iconBg: string }) {
  return (
    <Press onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, minHeight: 64 }}>
      <View style={[styles.circle, { width: 40, height: 40, backgroundColor: iconBg }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Sans s={14} w={600}>{title}</Sans>
        <Sans s={12} lh={1.35} c={colors.muted} style={{ marginTop: 2 }}>{sub}</Sans>
      </View>
      <Chevron />
    </Press>
  );
}

export function CheckRow({ label, on, last, onPress, plain = false }: { label: string; on: boolean; last: boolean; onPress: () => void; plain?: boolean }) {
  return (
    <Press
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: on }}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, minHeight: 54, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.lineSoft }}>
      <View style={[styles.circle, { width: 26, height: 26, borderWidth: 1.5, backgroundColor: on ? colors.ink : 'transparent', borderColor: on ? colors.ink : colors.check }]}>
        {on ? (
          <CheckMark color={colors.bg} />
        ) : null}
      </View>
      <Sans s={14} c={on && !plain ? colors.muted : colors.ink} style={{ flex: 1, textDecorationLine: on && !plain ? 'line-through' : 'none' }}>{label}</Sans>
    </Press>
  );
}

export function ToggleRow({ label, sub, on, last, onToggle }: { label: string; sub: string; on: boolean; last: boolean; onToggle: () => void }) {
  return (
    <Press accessibilityRole="switch" accessibilityState={{ checked: on }} onPress={onToggle} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, minHeight: 64, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.lineSoft }}>
      <View style={{ flex: 1 }}>
        <Sans s={14} w={600}>{label}</Sans>
        <Sans s={12} lh={1.35} c={colors.muted} style={{ marginTop: 3 }}>{sub}</Sans>
      </View>
      <Switch value={on} onValueChange={onToggle} trackColor={{ true: colors.sageDot, false: colors.track }} thumbColor={colors.card} ios_backgroundColor={colors.track} />
    </Press>
  );
}

export const CheckMark = ({ color, w = 11, h = 9 }: { color: string; w?: number; h?: number }) => (
  <Svg width={w} height={h} viewBox="0 0 11 9">
    <Path d="M1 4.5l3 3L10 1.5" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export function Checklist({ labels, map, onToggle }: { labels: string[]; map: Record<string, boolean>; onToggle: (label: string) => void }) {
  return (
    <Card style={{ paddingVertical: 4, paddingHorizontal: 18 }}>
      {labels.map((label, i) => (
        <CheckRow key={label} label={label} on={!!map[label]} last={i === labels.length - 1} onPress={() => onToggle(label)} />
      ))}
    </Card>
  );
}

// Espaço de imagem do design: mostra a legenda até a arte final existir.
export function ImageSlot({ label, style }: { label?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ backgroundColor: colors.photo, alignItems: 'center', justifyContent: 'center', padding: 10, overflow: 'hidden' }, style]}>
      {label ? <Sans s={11} c={colors.muted} style={{ textAlign: 'center' }}>{label}</Sans> : null}
    </View>
  );
}

export function OnboardingShell({ step, children, gap = 24 }: { step: number; children: ReactNode; gap?: number }) {
  const back = useGoBack('/welcome');
  const insets = useSafeAreaInsets();
  return (
    <Screen gap={gap} bottom={Math.max(insets.bottom, 16) + 16}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <BackButton onPress={back} light />
        <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
          {[1, 2, 3, 4].map((n) => (
            <View key={n} style={{ flex: 1, height: 4, borderRadius: 9, backgroundColor: n <= step ? colors.ink : colors.line }} />
          ))}
        </View>
      </View>
      {children}
    </Screen>
  );
}

export function Field({ label, style, ...rest }: TextInputProps & { label?: string }) {
  return (
    <View style={{ gap: 8 }}>
      {label ? <Overline>{label}</Overline> : null}
      <TextInput
        accessibilityLabel={label ?? rest.placeholder}
        placeholderTextColor={colors.muted}
        {...rest}
        style={[{ minHeight: 54, borderRadius: 20, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.card, paddingHorizontal: 18, fontSize: 15, color: colors.ink, fontFamily: fonts.sans400 }, style]}
      />
    </View>
  );
}

export const Spacer = () => <View style={{ flex: 1 }} />;

const styles = {
  circle: { width: 44, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center', flexShrink: 0 } satisfies ViewStyle,
};
