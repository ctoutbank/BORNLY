import { GLView, type ExpoWebGLRenderingContext } from 'expo-gl';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, PanResponder, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createEngine, Engine, Projected } from '@/baby3d/engine';
import { milestoneFor, PartId, PARTS, visibleParts } from '@/baby3d/milestones';
import { babyFor, useContent } from '@/content-provider';
import { gestation, trimester, useStore } from '@/store';
import { colors } from '@/theme';
import { ArrowLeft, ArrowRight, Press, Sans, Title } from '@/ui';

const WHITE = '#FFF7F0';
const GLASS = 'rgba(255,247,240,.2)';
const MARKER = 34;

function Marker({ part, x, y, opacity, pulse, onPress }: { part: PartId; x: Animated.Value; y: Animated.Value; opacity: Animated.Value; pulse: Animated.Value; onPress: () => void }) {
  return (
    <Animated.View style={{ position: 'absolute', left: -MARKER / 2, top: -MARKER / 2, opacity, transform: [{ translateX: x }, { translateY: y }] }}>
      <Pressable accessibilityRole="button" accessibilityLabel={PARTS[part].label} onPress={onPress} hitSlop={8} style={{ width: MARKER, height: MARKER, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={{ position: 'absolute', width: MARKER, height: MARKER, borderRadius: MARKER / 2, backgroundColor: 'rgba(255,247,240,.42)', opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.75, 0] }), transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1.1] }) }] }} />
        <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: WHITE, borderWidth: 3, borderColor: colors.terra }} />
      </Pressable>
    </Animated.View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(255,247,240,.9)', borderRadius: 24, paddingVertical: 12, paddingHorizontal: 14 }}>
      <Sans s={11} c={colors.mutedStrong}>{label}</Sans>
      <Title s={22} lh={1.15} numberOfLines={1} adjustsFontSizeToFit style={{ marginTop: 3 }}>{value}</Title>
    </View>
  );
}

export default function Baby3D() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { s, set } = useStore();
  const week = Math.max(4, Math.min(41, s.weekView ?? gestation(s).week));
  const baby = babyFor(week, useContent().weeks);

  const [inside, setInside] = useState(false);
  const [selected, setSelected] = useState<PartId | null>(null);
  const [ready, setReady] = useState(false);
  const [builtWeek, setBuiltWeek] = useState<number | null>(null);
  const building = builtWeek !== week;
  const [failed, setFailed] = useState(false);
  const engine = useRef<Engine | null>(null);
  const size = useRef({ width, height });

  const parts = useMemo(() => visibleParts(week, inside), [week, inside]);
  const [markers] = useState(() => new Map((Object.keys(PARTS) as PartId[]).map((p) => [p, { x: new Animated.Value(-99), y: new Animated.Value(-99), opacity: new Animated.Value(0) }])));
  const [pulse] = useState(() => new Animated.Value(0));
  const selectedRef = useRef(selected);

  useEffect(() => {
    size.current = { width, height };
    selectedRef.current = selected;
  }, [width, height, selected]);

  useEffect(() => {
    const loop = Animated.loop(Animated.timing(pulse, { toValue: 1, duration: 1500, easing: Easing.out(Easing.quad), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(() => () => engine.current?.dispose(), []);

  // Só uma semana é montada por vez; a montagem espera o aviso de "formando" aparecer.
  useEffect(() => {
    if (!ready || !engine.current) return;
    engine.current.clearFocus();
    const build = setTimeout(() => {
      engine.current?.setWeek(week, () => {
        setBuiltWeek(week);
        setTimeout(() => {
          if (week < 41) engine.current?.preload(week + 1);
        }, 900);
      });
    }, 40);
    return () => clearTimeout(build);
  }, [week, ready]);

  useEffect(() => {
    engine.current?.setInside(inside);
    engine.current?.setParts(parts);
    engine.current?.clearFocus();
  }, [inside, parts, ready]);

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    try {
      const e = createEngine(gl);
      engine.current = e;
      e.setOnFrame((list: Projected[]) => {
        const sel = selectedRef.current;
        for (const p of list) {
          const m = markers.get(p.part);
          if (!m) continue;
          m.x.setValue(p.x * size.current.width);
          m.y.setValue(p.y * size.current.height);
          m.opacity.setValue(sel ? (sel === p.part ? 1 : 0) : p.facing > 0.05 ? 1 : 0);
        }
      });
      setReady(true);
    } catch (err) {
      console.warn('3D indisponível', err);
      setFailed(true);
    }
  };

  const gesture = useRef({ pinch: 0 });
  const lastDrag = useRef({ x: 0, y: 0 });
  // Os refs só são lidos nos handlers de toque, nunca durante a renderização.
  // eslint-disable-next-line react-hooks/refs
  const [pan] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        gesture.current.pinch = 0;
        engine.current?.touch();
      },
      onPanResponderMove: (evt, g) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length >= 2) {
          const d = Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
          if (gesture.current.pinch > 0) engine.current?.zoom(d / gesture.current.pinch);
          gesture.current.pinch = d;
          return;
        }
        gesture.current.pinch = 0;
        if (!selectedRef.current) engine.current?.drag(g.dx - lastDrag.current.x, g.dy - lastDrag.current.y);
        lastDrag.current = { x: g.dx, y: g.dy };
      },
      onPanResponderRelease: () => {
        lastDrag.current = { x: 0, y: 0 };
      },
      onPanResponderTerminate: () => {
        lastDrag.current = { x: 0, y: 0 };
      },
    }),
  );

  const select = (part: PartId) => {
    setSelected(part);
    engine.current?.focus(part);
  };
  const closeSheet = () => {
    setSelected(null);
    engine.current?.clearFocus();
  };

  const info = selected ? milestoneFor(selected, week) : null;
  const go = (delta: number) => {
    setSelected(null);
    set({ weekView: Math.max(4, Math.min(41, week + delta)) });
  };
  const chooseInside = (value: boolean) => {
    setSelected(null);
    setInside(value);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#3A1512' }}>
      {failed ? null : <GLView style={StyleSheet.absoluteFill} msaaSamples={4} onContextCreate={onContextCreate} />}
      <View style={StyleSheet.absoluteFill} {...(failed ? {} : pan.panHandlers)}>
        {!failed && !building
          ? parts.map((p) => {
              const m = markers.get(p)!;
              return <Marker key={p} part={p} x={m.x} y={m.y} opacity={m.opacity} pulse={pulse} onPress={() => select(p)} />;
            })
          : null}
      </View>

      <View pointerEvents="box-none" style={{ position: 'absolute', top: insets.top + 8, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Press accessibilityLabel="Voltar" onPress={() => (router.canGoBack() ? router.back() : router.replace('/bebe'))} style={{ width: 44, height: 44, borderRadius: 20, backgroundColor: GLASS, alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft color={WHITE} />
        </Press>
        <View style={{ flex: 1 }}>
          <Title s={22} lh={1.15} c={WHITE}>Semana {week}</Title>
          <Sans s={12} c="rgba(255,247,240,.8)" style={{ marginTop: 2 }}>{trimester(week)}</Sans>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: GLASS, borderRadius: 999, padding: 4 }}>
          {[{ on: false, label: 'Por fora' }, { on: true, label: 'Por dentro' }].map((o) => {
            const active = inside === o.on;
            return (
              <Press key={o.label} accessibilityState={{ selected: active }} onPress={() => chooseInside(o.on)} style={{ borderRadius: 999, paddingHorizontal: 12, minHeight: 36, justifyContent: 'center', backgroundColor: active ? WHITE : 'transparent' }}>
                <Sans s={12} w={600} c={active ? colors.terraDark : WHITE}>{o.label}</Sans>
              </Press>
            );
          })}
        </View>
      </View>

      {failed ? (
        <ScrollView style={{ flex: 1, marginTop: insets.top + 70 }} contentContainerStyle={{ padding: 20, gap: 10, paddingBottom: 220 }}>
          <Sans s={14} lh={1.5} c={WHITE}>Este aparelho não conseguiu abrir o 3D. Veja o que já está em formação nesta semana:</Sans>
          {[...visibleParts(week, false), ...visibleParts(week, true)].map((p) => {
            const m = milestoneFor(p, week)!;
            return (
              <View key={p} style={{ backgroundColor: 'rgba(255,247,240,.92)', borderRadius: 20, padding: 16 }}>
                <Sans s={14} w={600}>{m.title}</Sans>
                <Sans s={13} lh={1.5} c={colors.body} style={{ marginTop: 4 }}>{m.text}</Sans>
              </View>
            );
          })}
        </ScrollView>
      ) : null}

      {!failed && (!ready || building) ? (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', gap: 10 }]}>
          <ActivityIndicator color={WHITE} />
          <Sans s={13} w={500} c={WHITE}>Formando a semana {week}</Sans>
        </View>
      ) : null}

      {selected && info ? (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 14, paddingHorizontal: 22, paddingBottom: Math.max(insets.bottom, 16) + 10 }}>
          <View style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: colors.line, alignSelf: 'center', marginBottom: 16 }} />
          <Sans s={12} w={600} c={colors.terra} style={{ letterSpacing: 0.6, textTransform: 'uppercase' }}>{PARTS[selected].label} · semana {week}</Sans>
          <Title s={22} style={{ marginTop: 6 }}>{info.title}</Title>
          <Sans s={14} lh={1.55} c={colors.body} style={{ marginTop: 8 }}>{info.text}</Sans>
          <Press onPress={closeSheet} style={{ marginTop: 16, height: 50, borderRadius: 999, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
            <Sans s={14} w={600} c={colors.bg}>Voltar para o bebê</Sans>
          </Press>
        </View>
      ) : (
        <View pointerEvents="box-none" style={{ position: 'absolute', left: 16, right: 16, bottom: Math.max(insets.bottom, 12) + 4, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Press accessibilityLabel="Semana anterior" disabled={week <= 4} onPress={() => go(-1)} style={{ width: 44, height: 44, borderRadius: 20, backgroundColor: WHITE, alignItems: 'center', justifyContent: 'center', opacity: week <= 4 ? 0.4 : 1 }}>
              <ArrowLeft color={colors.ink} />
            </Press>
            <Stat label="Comprimento" value={baby.cm} />
            <Stat label="Peso" value={baby.kg} />
            <Press accessibilityLabel="Próxima semana" disabled={week >= 41} onPress={() => go(1)} style={{ width: 44, height: 44, borderRadius: 20, backgroundColor: WHITE, alignItems: 'center', justifyContent: 'center', opacity: week >= 41 ? 0.4 : 1 }}>
              <ArrowRight color={colors.ink} />
            </Press>
          </View>
          <Sans s={11} lh={1.4} c="rgba(255,247,240,.85)" style={{ textAlign: 'center' }}>
            Arraste para girar, use dois dedos para aproximar e toque nos pontos. Representação artística, não mostra o seu bebê.
          </Sans>
        </View>
      )}
    </View>
  );
}
