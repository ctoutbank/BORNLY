import { View } from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';

import { WEIGHTS } from '@/content';
import { DAY, fmt, gestation, useStore } from '@/store';
import { colors } from '@/theme';
import { Card, PageHeader, Press, Sans, Screen, Serif } from '@/ui';

const MIN = 60.5;
const MAX = 66.5;

export default function Historico() {
  const { s, set } = useStore();
  const { week, today } = gestation(s);
  const pts = WEIGHTS.map((v, i) => [i * 40, 110 - ((v - MIN) / (MAX - MIN)) * 100]);
  const line = pts.map((p) => p.join(',')).join(' ');
  const area = 'M0,120 L' + pts.map((p) => p.join(',')).join(' L') + ' L320,120 Z';
  const bars = [2, 1, 3, 2, 1, 2, s.symLogged.length];
  const entries = [
    { date: 'Ontem', feel: 'Bem', text: 'Dormi melhor com a almofada entre os joelhos. Azia depois do jantar.' },
    { date: fmt(new Date(today.getTime() - 3 * DAY), { weekday: 'long', day: 'numeric' }), feel: 'Cansada', text: 'Pés inchados no fim do dia. Perguntar na consulta sobre meias de compressão.' },
    { date: fmt(new Date(today.getTime() - 6 * DAY), { weekday: 'long', day: 'numeric' }), feel: 'Muito bem', text: 'Bebê muito ativo à noite. Montamos o berço.' },
  ];

  return (
    <Screen>
      <PageHeader title="Meu histórico" sub={`Semanas 20 a ${week}`} fallback="/saude" />
      <Card radius={30} style={{ paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Sans s={12} c={colors.muted}>Peso</Sans>
          <Press onPress={() => set({ showWeight: !s.showWeight })} style={{ backgroundColor: colors.sand, borderRadius: 999, paddingHorizontal: 12, minHeight: 32, justifyContent: 'center' }}>
            <Sans s={11.5} w={600} c={colors.mutedStrong}>{s.showWeight ? 'Ocultar' : 'Mostrar'}</Sans>
          </Press>
        </View>
        {s.showWeight ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
              <Serif s={40} lh={1.05}>65,8</Serif>
              <Sans s={15} c={colors.muted}>kg</Sans>
              <Sans s={12.5} w={600} c={colors.sageInk} style={{ marginLeft: 6 }}>+0,5 kg na semana</Sans>
            </View>
            <Svg width="100%" height={120} viewBox="0 0 320 120" preserveAspectRatio="none" style={{ marginTop: 14 }}>
              <Path d={area} fill={colors.sand} />
              <Polyline points={line} fill="none" stroke={colors.caramel} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              <Circle cx={316} cy={pts[pts.length - 1][1]} r={4} fill={colors.ink} />
            </Svg>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
              {['20 sem', '24 sem', `${week} sem`].map((l) => <Sans key={l} s={11} c={colors.muted}>{l}</Sans>)}
            </View>
          </>
        ) : (
          <Sans s={13.5} lh={1.5} c={colors.muted} style={{ marginTop: 10 }}>O peso está oculto. Você escolhe quando acompanhar.</Sans>
        )}
      </Card>
      <Card radius={30} style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Serif s={18}>Sintomas · 7 dias</Serif>
          <Sans s={12} c={colors.muted}>registros por dia</Sans>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end', minHeight: 96, marginTop: 16 }}>
          {bars.map((n, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
              <View style={{ width: '100%', maxWidth: 26, height: n * 24 + 8, borderRadius: 10, backgroundColor: i === 6 ? colors.ink : '#E0CDBE' }} />
              <Sans s={10.5} w={600} c={colors.muted}>{fmt(new Date(today.getTime() - (6 - i) * DAY), { weekday: 'narrow' }).toUpperCase()}</Sans>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
          {['Azia · 5x', 'Cansaço · 4x', 'Cãibras · 2x'].map((t) => (
            <View key={t} style={{ backgroundColor: colors.sand, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 11 }}>
              <Sans s={12} w={600} c={colors.mutedStrong}>{t}</Sans>
            </View>
          ))}
        </View>
      </Card>
      <View>
        <Serif s={19} style={{ marginBottom: 12 }}>Registros anteriores</Serif>
        <View style={{ gap: 8 }}>
          {entries.map((e) => (
            <Card key={e.text} radius={22} style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Sans s={12} c={colors.muted}>{e.date}</Sans>
                <Sans s={12} c={colors.muted}>{e.feel}</Sans>
              </View>
              <Sans s={14} lh={1.5} c={colors.body} style={{ marginTop: 6 }}>{e.text}</Sans>
            </Card>
          ))}
        </View>
      </View>
    </Screen>
  );
}
