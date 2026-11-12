import { useRouter } from 'expo-router';
import { ReactNode, useEffect, useState } from 'react';
import { Animated, Easing, Pressable, PressableProps, ScrollView, StyleProp, Switch, Text, TextInput, TextInputProps, TextProps, TextStyle, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { authClient } from '@/auth-client';
import { colors, fonts } from '@/theme';

type TypeProps = TextProps & { s?: number; lh?: number; c?: string };

// Evita quebras ruins: uma palavra sozinha na última linha (a última palavra de cada parágrafo fica presa à anterior)
// por um espaço que não quebra. Vale para qualquer largura de tela e para o conteúdo da administração.
const NBSP = '\u00A0';
export function noWidow(text: string) {
  return text
    .split('\n')
    // palavras de uma letra (o, a, e, é) não terminam a linha: ficam presas à seguinte
    .map((line) => line.replace(/(^|[ \u00A0])(\S) (?=\S)/g, `$1$2${NBSP}`).replace(/(^|[ \u00A0])(\S) (?=\S)/g, `$1$2${NBSP}`))
    .map((line) => {
      const i = line.trimEnd().lastIndexOf(' ');
      if (i <= 0) return line;
      const last = line.slice(i + 1);
      // só em frases com mais de três palavras e quando a última não é longa demais
      if (line.split(' ').length < 4 || last.length > 14) return line;
      return line.slice(0, i) + NBSP + last;
    })
    .join('\n');
}
const tidy = (children: ReactNode): ReactNode => {
  if (typeof children === 'string') return noWidow(children);
  if (Array.isArray(children) && typeof children[children.length - 1] === 'string') return [...children.slice(0, -1), noWidow(children[children.length - 1] as string)];
  return children;
};

export function Title({ s = 18, lh = 1.2, c = colors.ink, style, children, ...rest }: TypeProps) {
  return <Text {...rest} style={[{ fontFamily: fonts.title, fontSize: s, lineHeight: s * lh, color: c }, style]}>{rest.numberOfLines === 1 ? children : tidy(children)}</Text>;
}

export function Sans({ s = 14, lh = 1.4, c = colors.ink, w = 400, style, children, ...rest }: TypeProps & { w?: 400 | 500 | 600 | 700 }) {
  const fontFamily = { 400: fonts.sans400, 500: fonts.sans500, 600: fonts.sans600, 700: fonts.sans700 }[w];
  return <Text {...rest} style={[{ fontFamily, fontSize: s, lineHeight: s * lh, color: c }, style]}>{rest.numberOfLines === 1 ? children : tidy(children)}</Text>;
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

// Botão de voltar claro em todas as telas (o parâmetro light fica por compatibilidade).
export function BackButton({ onPress }: { onPress: () => void; light?: boolean }) {
  return (
    <Press onPress={onPress} accessibilityLabel="Voltar" style={[styles.circle, { backgroundColor: colors.card }]}>
      <ArrowLeft color={colors.terraDark} />
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

export function PageHeader({ title, sub, fallback, right, light = false }: { title: string; sub?: string; fallback: '/hoje' | '/saude' | '/preparar' | '/aprender'; right?: ReactNode; light?: boolean }) {
  const back = useGoBack(fallback);
  // Título ao lado do botão de voltar, no mesmo tamanho dos títulos das abas (28). Se não couber, reduz até 22.
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <BackButton onPress={back} light={light} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Title s={28} lh={1.15} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78}>{title}</Title>
        {sub ? <Sans s={13} lh={1.35} c={colors.muted} style={{ marginTop: 2 }}>{sub}</Sans> : null}
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

const HEART_PATH = 'M12 21s-7.5-4.7-7.5-10.6A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.8C19.5 16.3 12 21 12 21z';

// Coração que bate devagar, em dois tempos, como um batimento.
function BeatingHeart({ color }: { color: string }) {
  const [beat] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(beat, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(beat, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(beat, { toValue: 0.7, duration: 160, useNativeDriver: true }),
        Animated.timing(beat, { toValue: 0, duration: 520, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [beat]);
  return (
    <Animated.View style={{ transform: [{ scale: beat.interpolate({ inputRange: [0, 1], outputRange: [1, 1.28] }) }] }}>
      <Svg width={18} height={18} viewBox="0 0 24 24"><Path d={HEART_PATH} fill={color} /></Svg>
    </Animated.View>
  );
}

// Botão principal: terracota, com coração que pulsa e um leve aperto ao tocar.
export function PrimaryButton({ label, onPress, bg = colors.terra, icon, heart = true }: { label: string; onPress: () => void; bg?: string; icon?: ReactNode; heart?: boolean }) {
  const [scale] = useState(() => new Animated.Value(1));
  const to = (v: number) => Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 8 }).start();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPress={onPress} onPressIn={() => to(0.96)} onPressOut={() => to(1)} accessibilityRole="button" accessibilityLabel={label} style={{ height: 58, borderRadius: 999, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }}>
        {icon ?? (heart ? <BeatingHeart color={colors.card} /> : null)}
        <Sans s={15} w={600} c={colors.card}>{label}</Sans>
      </Pressable>
    </Animated.View>
  );
}

export function TextButton({ label, onPress, c = colors.mutedStrong, w = 500, s = 13 }: { label: string; onPress: () => void; c?: string; w?: 500 | 600; s?: number }) {
  return (
    <Press onPress={onPress} accessibilityLabel={label} style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
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
          <Press key={o.id} onPress={() => onChange(o.id)} accessibilityLabel={o.label} accessibilityState={{ selected: on }} style={{ flex: 1, borderRadius: 999, minHeight, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, backgroundColor: on ? colors.card : 'transparent', shadowColor: colors.terra, shadowOpacity: on ? 0.12 : 0, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}>
            <Sans s={fontSize} w={on ? 700 : 600} c={on ? colors.terraDark : colors.mutedStrong} style={{ textAlign: 'center' }}>{o.label}</Sans>
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
      accessibilityLabel={label}
      accessibilityState={{ selected: on }}
      style={{ borderWidth: 1.5, borderColor: on ? colors.terra : offBorder, backgroundColor: on ? colors.peach : offBg, borderRadius: 999, paddingHorizontal: compact ? 14 : 16, minHeight: compact ? 40 : 44, justifyContent: 'center' }}>
      <Sans s={13} w={on ? 600 : 500} c={on ? colors.terraDark : colors.ink}>{label}</Sans>
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
      <View style={[styles.circle, { width: 26, height: 26, borderWidth: 1.5, backgroundColor: on ? colors.terra : 'transparent', borderColor: on ? colors.terra : colors.check }]}>
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
// Espaço de imagem sem foto: ilustração discreta na paleta do app. O rótulo serve só para leitores de tela.
export function ImageSlot({ label, style }: { label?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View accessible={!!label} accessibilityLabel={label} accessibilityRole={label ? 'image' : undefined} style={[{ backgroundColor: colors.peach, overflow: 'hidden' }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice">
        <Circle cx="92" cy="26" r="34" fill={colors.photo} />
        <Circle cx="24" cy="96" r="30" fill={colors.sage} />
        <Circle cx="60" cy="60" r="22" fill={colors.card} opacity={0.9} />
        <Path d="M60 68 C49 60 53 50 60 55 C67 50 71 60 60 68 Z" fill={colors.terra} opacity={0.75} />
      </Svg>
    </View>
  );
}

export function OnboardingShell({ step, children, gap = 24, total = 4 }: { step: number; children: ReactNode; gap?: number; total?: number }) {
  const back = useGoBack('/welcome');
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  return (
    <Screen gap={gap} bottom={Math.max(insets.bottom, 16) + 16}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <BackButton onPress={back} light />
        <View accessible accessibilityRole="progressbar" accessibilityLabel={`Etapa ${step} de ${total}`} style={{ flex: 1, height: 8, borderRadius: 9, backgroundColor: colors.sand, overflow: 'hidden' }}>
          <View style={{ width: `${(Math.min(step, total) / total) * 100}%`, height: '100%', borderRadius: 9, backgroundColor: colors.terra }} />
        </View>
        <View style={{ backgroundColor: colors.card, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 10 }}>
          <Sans s={12} w={700}>{Math.min(step, total)}/{total}</Sans>
        </View>
      </View>
      {children}
      {!isPending && !session ? <TextButton label="Já tenho uma conta" onPress={() => router.push({ pathname: '/login', params: { from: 'cadastro' } })} /> : null}
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
