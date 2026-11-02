import { View } from 'react-native';

import { MALA } from '@/content';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Checklist, PageHeader, Press, Sans, Screen, Serif } from '@/ui';

export default function Mala() {
  const { s, set } = useStore();
  const missing = MALA[s.malaTab].filter((l) => !s.mala[l]);
  return (
    <Screen gap={20}>
      <PageHeader title="Mala da maternidade" sub="Ideal ter pronta até 36 semanas" fallback="/preparar" />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {Object.keys(MALA).map((c) => {
          const on = s.malaTab === c;
          const fg = on ? colors.bg : colors.ink;
          return (
            <Press key={c} accessibilityState={{ selected: on }} onPress={() => set({ malaTab: c })} style={{ flex: 1, borderRadius: 24, paddingVertical: 14, paddingHorizontal: 12, gap: 10, minHeight: 96, backgroundColor: on ? colors.ink : colors.card }}>
              <Sans s={13} w={600} c={fg} numberOfLines={1} adjustsFontSizeToFit>{c}</Sans>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Serif s={22} lh={1.05} c={fg}>{MALA[c].filter((l) => s.mala[l]).length}</Serif>
                <Sans s={12} w={500} c={fg} style={{ opacity: 0.6 }}>/{MALA[c].length}</Sans>
              </View>
            </Press>
          );
        })}
      </View>
      <Checklist labels={MALA[s.malaTab]} map={s.mala} onToggle={(l) => set((st) => ({ mala: { ...st.mala, [l]: !st.mala[l] } }))} />
      <Sans s={13} c={colors.muted} style={{ paddingHorizontal: 4 }}>
        Falta separar: <Sans s={13} w={600}>{missing.length ? `${missing.length} itens de ${s.malaTab.toLowerCase()}` : 'nada, tudo separado'}</Sans>
      </Sans>
    </Screen>
  );
}
