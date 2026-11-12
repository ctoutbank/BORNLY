import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { colors } from '@/theme';
import { Press, Sans, TextButton, Title, useTopPad } from '@/ui';

// Linha do tempo da gestação: um caminho de 40 semanas com marcos.
const VB_W = 360;
const VB_H = 440;
const MARKS = [
  { w: 12, label: '12 sem', sub: 'pré-natal' },
  { w: 20, label: '20 sem', sub: 'ultrassom' },
  { w: 28, label: '28 sem', sub: '3º trimestre' },
  { w: 40, label: '40 sem', sub: 'encontro' },
];
const pt = (t: number) => ({ x: 180 + 110 * Math.sin(t * Math.PI * 2.2), y: 40 + t * 360 });
const PATH = Array.from({ length: 61 }, (_, i) => {
  const p = pt(i / 60);
  return `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
}).join(' ');

function Timeline() {
  // A caixa mantém a proporção do desenho, para os rótulos ficarem sempre ao lado dos pontos.
  const [box, setBox] = useState({ w: 0, h: 0 });
  const scale = box.w && box.h ? Math.min(box.w / VB_W, box.h / VB_H) : 0;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
      {scale ? (
        <View style={{ width: VB_W * scale, height: VB_H * scale }} accessible accessibilityRole="image" accessibilityLabel="Linha do tempo da gestação: 12 semanas, pré-natal; 20 semanas, ultrassom; 28 semanas, terceiro trimestre; 40 semanas, o encontro">
          <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`}>
            <Path d={PATH} stroke={colors.card} strokeWidth={34} fill="none" strokeLinecap="round" />
            <Path d={PATH} stroke={colors.caramel} strokeWidth={2} strokeDasharray="2 9" fill="none" strokeLinecap="round" />
            {MARKS.map((m) => {
              const p = pt(m.w / 40);
              const last = m.w === 40;
              return (
                <G key={m.w}>
                  {last ? <Circle cx={p.x} cy={p.y} r={22} fill={colors.terra} opacity={0.18} /> : null}
                  <Circle cx={p.x} cy={p.y} r={last ? 13 : 9} fill={last ? colors.terra : colors.ink} />
                </G>
              );
            })}
            <Circle cx={pt(0).x} cy={pt(0).y} r={6} fill={colors.sageDot} />
          </Svg>
          {MARKS.map((m) => {
            const p = pt(m.w / 40);
            const right = p.x < 180;
            const gap = 24 * scale;
            return (
              <View key={m.w} pointerEvents="none" style={{ position: 'absolute', top: p.y * scale - 16, ...(right ? { left: p.x * scale + gap } : { right: (VB_W - p.x) * scale + gap }), alignItems: right ? 'flex-start' : 'flex-end' }}>
                <Sans s={13} w={700}>{m.label}</Sans>
                <Sans s={11} c={colors.mutedStrong}>{m.sub}</Sans>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

export default function Welcome() {
  const router = useRouter();
  const top = useTopPad();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.peach }}>
      <View style={{ paddingTop: top + 8, paddingHorizontal: 26, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <Title s={22}>Bornly</Title>
        <Sans s={11} w={600} c={colors.terra} numberOfLines={1} style={{ flexShrink: 1 }}>40 semanas, um passo por vez</Sans>
      </View>
      <Timeline />
      <View style={{ paddingHorizontal: 26, paddingBottom: Math.max(insets.bottom, 16) + 8, gap: 10 }}>
        <Title s={28} lh={1.15}>Cada semana tem o seu cuidado.</Title>
        <Sans s={15} lh={1.5} c={colors.mutedStrong} style={{ marginBottom: 6 }}>O que muda no bebê, no seu corpo e o que levar para a próxima consulta.</Sans>
        <Press accessibilityLabel="Começar" onPress={() => router.push('/moment')} style={{ height: 58, borderRadius: 999, backgroundColor: colors.terra, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 26, paddingRight: 8 }}>
          <Sans s={15} w={600} c={colors.bg}>Começar</Sans>
          <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={18} height={14} viewBox="0 0 16 12"><Path d="M1 6h13M9.5 1.5L14 6l-4.5 4.5" stroke={colors.ink} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg>
          </View>
        </Press>
        <TextButton label="Já tenho uma conta" onPress={() => router.push('/login')} />
      </View>
    </View>
  );
}
