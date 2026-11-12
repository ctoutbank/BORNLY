import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';

import { DAY, fmt, fromIso, iso, startOfToday, todayIso, useStore } from '@/store';
import { FEELINGS } from '@/content';
import { colors } from '@/theme';
import { Card, Field, PageHeader, Press, PrimaryButton, Sans, Screen, Title } from '@/ui';

const kgText = (n: number) => n.toFixed(1).replace('.', ',');

export default function Historico() {
  const { s, save, flash } = useStore();
  const today = startOfToday();
  const [kg, setKg] = useState('');

  const addWeight = () => {
    const value = parseFloat(kg.replace(',', '.'));
    if (!(value > 20 && value < 300)) return flash('Informe o peso em kg, por exemplo 65,8.');
    const day = todayIso();
    setKg('');
    save(`/weights/${day}`, 'PUT', { kg: value }, (st) => ({ weights: [...st.weights.filter((w) => w.day !== day), { day, kg: value }].sort((a, b) => a.day.localeCompare(b.day)) }));
  };

  const w = s.weights;
  const last = w[w.length - 1];
  const prev = w[w.length - 2];
  const min = w.length ? Math.min(...w.map((x) => x.kg)) - 0.5 : 0;
  const max = w.length ? Math.max(...w.map((x) => x.kg)) + 0.5 : 1;
  const pts = w.map((x, i) => [w.length > 1 ? (i / (w.length - 1)) * 312 + 4 : 160, 110 - ((x.kg - min) / (max - min)) * 100]);
  const line = pts.map((p) => p.join(',')).join(' ');
  const area = pts.length ? `M${pts[0][0]},120 L${line.replace(/ /g, ' L')} L${pts[pts.length - 1][0]},120 Z` : '';

  const bars = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getTime() - (6 - i) * DAY);
    return { d, count: s.symptoms.filter((x) => x.day === iso(d)).length };
  });
  const counts: Record<string, number> = {};
  for (const x of s.symptoms) counts[x.symptom] = (counts[x.symptom] ?? 0) + 1;
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const entries = Object.entries(s.diary).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 10);

  return (
    <Screen>
      <PageHeader title="Meu histórico" sub="Peso, sintomas e registros" fallback="/saude" />
      <Card radius={28} style={{ paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Sans s={12} c={colors.muted}>Peso</Sans>
          <Press onPress={() => save('/profile', 'PUT', { showWeight: !s.showWeight }, { showWeight: !s.showWeight })} style={{ backgroundColor: colors.sand, borderRadius: 999, paddingHorizontal: 12, minHeight: 32, justifyContent: 'center' }}>
            <Sans s={11} w={600} c={colors.mutedStrong}>{s.showWeight ? 'Ocultar' : 'Mostrar'}</Sans>
          </Press>
        </View>
        {s.showWeight ? (
          <>
            {last ? (
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                <Title s={40} lh={1.05}>{kgText(last.kg)}</Title>
                <Sans s={15} c={colors.muted}>kg</Sans>
                {prev ? <Sans s={12} w={600} c={colors.sageInk} style={{ marginLeft: 6 }}>{last.kg >= prev.kg ? '+' : '−'}{kgText(Math.abs(last.kg - prev.kg))} kg desde o anterior</Sans> : null}
              </View>
            ) : (
              <Sans s={14} lh={1.5} c={colors.muted} style={{ marginTop: 10 }}>Registre seu peso para acompanhar a evolução.</Sans>
            )}
            {w.length > 1 ? (
              <>
                <Svg width="100%" height={120} viewBox="0 0 320 120" preserveAspectRatio="none" style={{ marginTop: 14 }}>
                  <Path d={area} fill={colors.sand} />
                  <Polyline points={line} fill="none" stroke={colors.caramel} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                  <Circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={4} fill={colors.ink} />
                </Svg>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                  {[w[0], last].map((x) => <Sans key={x.day} s={11} c={colors.muted}>{fmt(fromIso(x.day), { day: 'numeric', month: 'short' }).replace(/\./g, '')}</Sans>)}
                </View>
              </>
            ) : null}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 14, alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}><Field value={kg} onChangeText={setKg} placeholder="Peso de hoje (kg)" keyboardType="decimal-pad" /></View>
              <View style={{ width: 96 }}><PrimaryButton label="Salvar" onPress={addWeight} /></View>
            </View>
          </>
        ) : (
          <Sans s={13} lh={1.5} c={colors.muted} style={{ marginTop: 10 }}>O peso está oculto. Você escolhe quando acompanhar.</Sans>
        )}
      </Card>
      <Card radius={28} style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Title s={18}>Sintomas · 7 dias</Title>
          <Sans s={12} c={colors.muted}>registros por dia</Sans>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end', minHeight: 96, marginTop: 16 }}>
          {bars.map((b, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
              <View style={{ width: '100%', maxWidth: 26, height: Math.min(72, b.count * 18) + 6, borderRadius: 10, backgroundColor: i === 6 ? colors.ink : '#E0CDBE' }} />
              <Sans s={11} w={600} c={colors.muted}>{fmt(b.d, { weekday: 'narrow' }).toUpperCase()}</Sans>
            </View>
          ))}
        </View>
        {top.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
            {top.map(([name, n]) => (
              <View key={name} style={{ backgroundColor: colors.sand, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 11 }}>
                <Sans s={12} w={600} c={colors.mutedStrong}>{name} · {n}x</Sans>
              </View>
            ))}
          </View>
        ) : null}
      </Card>
      <View>
        <Title s={18} style={{ marginBottom: 12 }}>Registros anteriores</Title>
        {entries.length ? (
          <View style={{ gap: 8 }}>
            {entries.map(([day, e]) => (
              <Card key={day} radius={20} style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Sans s={12} c={colors.muted}>{fmt(fromIso(day), { weekday: 'long', day: 'numeric', month: 'short' }).replace(/\./g, '')}</Sans>
                  <Sans s={12} c={colors.muted}>{FEELINGS[e.feel]}</Sans>
                </View>
                {e.note ? <Sans s={14} lh={1.5} c={colors.body} style={{ marginTop: 6 }}>{e.note}</Sans> : null}
              </Card>
            ))}
          </View>
        ) : (
          <Card style={{ padding: 20 }}><Sans s={14} lh={1.5} c={colors.muted}>Seus registros do diário aparecem aqui.</Sans></Card>
        )}
      </View>
    </Screen>
  );
}
