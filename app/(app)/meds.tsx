import { View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { MEDS } from '@/content';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Card, PageHeader, Press, Sans, Screen, Serif } from '@/ui';

export default function Meds() {
  const { s, set } = useStore();
  return (
    <Screen>
      <PageHeader title="Medicamentos e vitaminas" sub="Conforme sua prescrição" fallback="/saude" />
      <Card radius={30} style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Serif s={18}>Hoje</Serif>
          <Sans s={12.5} c={colors.muted}>{MEDS.filter((m) => s.taken[m.id]).length} de {MEDS.length}</Sans>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <View style={{ position: 'absolute', left: '16%', right: '16%', top: 21, height: 2 }}>
            <Svg width="100%" height={2}><Line x1={0} y1={1} x2="100%" y2={1} stroke="#E0D2C4" strokeWidth={1.5} strokeDasharray="4 4" /></Svg>
          </View>
          {MEDS.map((m) => {
            const on = !!s.taken[m.id];
            return (
              <View key={m.id} style={{ flex: 1, alignItems: 'center', gap: 8 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? colors.sageDot : colors.sand }}>
                  <Sans s={12} w={600} c={on ? colors.card : colors.mutedStrong}>{m.time}</Sans>
                </View>
                <Sans s={12} c={colors.muted}>{m.slot}</Sans>
              </View>
            );
          })}
        </View>
      </Card>
      <View style={{ gap: 10 }}>
        {MEDS.map((m) => {
          const on = !!s.taken[m.id];
          return (
            <Card key={m.id} radius={26} style={{ padding: 16, paddingLeft: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Sans s={15} w={600}>{m.name}</Sans>
                <Sans s={12.5} c={colors.muted} style={{ marginTop: 3 }}>{m.dose} · {m.when}</Sans>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.sageDot }} />
                  <Sans s={11.5} w={600} c={colors.sageInk}>Lembrete às {m.time}</Sans>
                </View>
              </View>
              <Press accessibilityState={{ selected: on }} onPress={() => set((st) => ({ taken: { ...st.taken, [m.id]: !on } }))} style={{ borderRadius: 999, paddingHorizontal: 16, height: 44, justifyContent: 'center', backgroundColor: on ? colors.sage : colors.ink }}>
                <Sans s={13} w={600} c={on ? colors.sageInk : colors.bg}>{on ? 'Tomado' : 'Marcar'}</Sans>
              </Press>
            </Card>
          );
        })}
      </View>
      <Card bg={colors.sand} radius={24} style={{ paddingVertical: 16, paddingHorizontal: 18 }}>
        <Sans s={13} lh={1.5} c={colors.body}>O Bornly organiza o que foi prescrito. Não recomenda medicamentos nem altera doses; qualquer mudança é com sua equipe de saúde.</Sans>
      </Card>
    </Screen>
  );
}
