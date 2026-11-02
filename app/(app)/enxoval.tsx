import { ScrollView } from 'react-native';

import { ENX } from '@/content';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Checklist, CircleButton, PageHeader, Plus, Press, Sans, Screen } from '@/ui';

export default function Enxoval() {
  const { s, set } = useStore();
  const all = Object.values(ENX).flat();
  return (
    <Screen gap={20}>
      <PageHeader title="Enxoval" sub={`${all.filter((l) => s.enx[l]).length} de ${all.length} itens`} fallback="/preparar" right={<CircleButton label="Novo item"><Plus color={colors.ink} /></CircleButton>} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, flexGrow: 0 }} contentContainerStyle={{ gap: 6, paddingHorizontal: 20 }}>
        {Object.keys(ENX).map((c) => {
          const on = s.enxCat === c;
          return (
            <Press key={c} accessibilityState={{ selected: on }} onPress={() => set({ enxCat: c })} style={{ borderRadius: 999, paddingHorizontal: 16, minHeight: 42, flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: on ? colors.ink : colors.card }}>
              <Sans s={13} w={600} c={on ? colors.bg : colors.ink}>{c}</Sans>
              <Sans s={13} w={500} c={on ? colors.bg : colors.ink} style={{ opacity: 0.6 }}>{ENX[c].filter((l) => s.enx[l]).length}/{ENX[c].length}</Sans>
            </Press>
          );
        })}
      </ScrollView>
      <Checklist labels={ENX[s.enxCat]} map={s.enx} onToggle={(l) => set((st) => ({ enx: { ...st.enx, [l]: !st.enx[l] } }))} />
    </Screen>
  );
}
