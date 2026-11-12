import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { authClient } from '@/auth-client';
import { colors } from '@/theme';
import { Overline, Sans, Title } from '@/ui';

const RINGS = [
  { size: 560, color: 'rgba(226,185,166,.18)', delay: 0 },
  { size: 400, color: 'rgba(226,185,166,.22)', delay: 350 },
  { size: 260, color: 'rgba(251,247,242,.55)', delay: 700 },
  { size: 150, color: 'rgba(251,247,242,.8)', delay: 1050 },
];
const DURATION = 2800;
const BAR_WIDTH = 120;

function Ring({ size, color, delay }: (typeof RINGS)[number]) {
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const half = { duration: 2100, easing: Easing.inOut(Easing.ease), useNativeDriver: true };
    const loop = Animated.loop(Animated.sequence([Animated.timing(t, { toValue: 1, ...half }), Animated.timing(t, { toValue: 0, ...half })]));
    const start = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(start);
      loop.stop();
    };
  }, [t, delay]);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: -size / 2,
        top: -size / 2,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }),
        transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.04] }) }],
      }}
    />
  );
}

export default function Splash() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [bar] = useState(() => new Animated.Value(-BAR_WIDTH));

  const { data: session, isPending } = authClient.useSession();
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    Animated.timing(bar, { toValue: 0, duration: DURATION, easing: Easing.bezier(0.4, 0, 0.2, 1), useNativeDriver: true }).start();
    const next = setTimeout(() => setElapsed(true), DURATION);
    return () => clearTimeout(next);
  }, [bar]);

  // Quem já entrou vai direto para o app; a sessão fica guardada no aparelho.
  useEffect(() => {
    if (elapsed && !isPending) router.replace(session ? '/hoje' : '/welcome');
  }, [elapsed, isPending, router, session]);

  return (
    <Pressable accessibilityLabel="Abrir o Bornly" onPress={() => setElapsed(true)} style={{ flex: 1, alignItems: 'center', overflow: 'hidden', backgroundColor: '#F1E3D7' }}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <RadialGradient id="bg" cx="50%" cy="42%" rx="120%" ry="70%">
            <Stop offset="0" stopColor="#F7EFE7" />
            <Stop offset="0.48" stopColor="#F1E3D7" />
            <Stop offset="1" stopColor="#E8CFC2" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#bg)" />
      </Svg>
      <View style={{ position: 'absolute', left: '50%', top: '41%', width: 0, height: 0 }}>
        {RINGS.map((r) => <Ring key={r.size} {...r} />)}
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ alignItems: 'center', gap: 22 }}>
        <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: colors.ink, shadowColor: colors.ink, shadowOpacity: 0.22, shadowRadius: 20, shadowOffset: { width: 0, height: 18 } }}>
          <View style={{ position: 'absolute', left: 21, top: 21, width: 34, height: 34, borderRadius: 20, backgroundColor: colors.bg }} />
          <View style={{ position: 'absolute', left: 41, top: 39, width: 16, height: 16, borderRadius: 8, backgroundColor: '#E2B9A6' }} />
        </View>
        <Title s={46} lh={1.05}>Bornly</Title>
        <Sans s={14} c={colors.mutedStrong} style={{ letterSpacing: 0.28 }}>Cuidado em cada semana</Sans>
      </View>
      <View style={{ flex: 1.15 }} />
      <View style={{ alignItems: 'center', gap: 14, paddingBottom: Math.max(insets.bottom, 24) + 24 }}>
        <View style={{ width: BAR_WIDTH, height: 3, borderRadius: 999, backgroundColor: 'rgba(42,37,34,.1)', overflow: 'hidden' }}>
          <Animated.View style={{ width: '100%', height: '100%', borderRadius: 999, backgroundColor: colors.ink, transform: [{ translateX: bar }] }} />
        </View>
        <Overline style={{ fontSize: 11, letterSpacing: 0.88 }}>Da descoberta ao pós-parto</Overline>
      </View>
    </Pressable>
  );
}
