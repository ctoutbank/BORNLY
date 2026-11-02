import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { PLAN } from '@/content';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Card, Chip, PageHeader, PrimaryButton, Sans, Screen, Serif, Wrap } from '@/ui';

export default function Plano() {
  const { s, set, flash } = useStore();
  const done = PLAN.filter(([t]) => (s.plan[t] || []).length).length;
  return (
    <Screen gap={18}>
      <PageHeader title="Plano de parto" sub={`${done} de ${PLAN.length} tópicos preenchidos`} fallback="/preparar" />
      <Sans s={13.5} lh={1.5} c={colors.body} style={{ paddingHorizontal: 2 }}>Suas preferências para conversar com a equipe do parto. O documento registra desejos e não substitui a avaliação clínica.</Sans>
      {PLAN.map(([topic, opts]) => {
        const cur = s.plan[topic] || [];
        return (
          <Card key={topic} radius={26} style={{ padding: 18 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Serif s={17}>{topic}</Serif>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: cur.length ? colors.sageDot : colors.track }} />
            </View>
            <Wrap gap={6}>
              {opts.map((o) => {
                const on = cur.includes(o);
                return <Chip key={o} compact label={o} on={on} offBg={colors.bg} offBorder={colors.bg} onPress={() => set((st) => ({ plan: { ...st.plan, [topic]: on ? cur.filter((x) => x !== o) : [...cur, o] } }))} />;
              })}
            </Wrap>
          </Card>
        );
      })}
      <PrimaryButton
        label="Exportar em PDF"
        onPress={() => flash('Exportação em PDF ainda não disponível')}
        icon={<Svg width={14} height={16} viewBox="0 0 14 16"><Path d="M7 1v10M3 7l4 4 4-4M1 15h12" stroke={colors.bg} strokeWidth={1.7} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg>}
      />
    </Screen>
  );
}
