import { View } from 'react-native';

import { useContent } from '@/content-provider';
import { BabyIcon, BagIcon, FlowerIcon, PeopleIcon } from '@/components/love';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Checklist, PageHeader, Press, Sans, Screen, Title } from '@/ui';

export default function Mala() {
  const { s, set, save } = useStore();
  const MALA: Record<string, string[]> = Object.fromEntries(useContent().checklists.mala.map((g) => [g.group, g.items]));
  const missing = MALA[s.malaTab].filter((l) => !s.mala[l]);
  return (
    <Screen gap={20}>
      <PageHeader title="Mala da maternidade" sub="Ideal ter pronta até 36 semanas" fallback="/preparar" />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {Object.keys(MALA).map((c) => {
          const on = s.malaTab === c;
          const fg = on ? colors.terraDark : colors.ink;
          const icon = c === 'Mamãe' ? <FlowerIcon color={colors.terra} size={17} /> : c === 'Bebê' ? <BabyIcon color={colors.sageInk} size={17} /> : <PeopleIcon color={colors.mutedStrong} size={17} />;
          return (
            <Press key={c} accessibilityState={{ selected: on }} onPress={() => set({ malaTab: c })} style={{ flex: 1, borderRadius: 24, paddingVertical: 14, paddingHorizontal: 12, gap: 8, minHeight: 104, borderWidth: 1.5, borderColor: on ? colors.terra : 'transparent', backgroundColor: on ? colors.peach : colors.card }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: on ? colors.card : colors.bg, alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
              <Sans s={12} w={600} c={fg} numberOfLines={1}>{c === 'Acompanhante' ? 'Acomp.' : c}</Sans>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Title s={22} lh={1.05} c={fg}>{MALA[c].filter((l) => s.mala[l]).length}</Title>
                <Sans s={12} w={500} c={fg} style={{ opacity: 0.6 }}>/{MALA[c].length}</Sans>
              </View>
            </Press>
          );
        })}
      </View>
      <Checklist labels={MALA[s.malaTab]} map={s.mala} onToggle={(l) => { const done = !s.mala[l]; save('/checklist', 'PUT', { list: 'mala', label: l, category: s.malaTab, custom: false, done }, (st) => ({ mala: { ...st.mala, [l]: done } })); }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: 20, padding: 14 }}>
        <BagIcon color={colors.terra} size={18} />
        <Sans s={13} c={colors.mutedStrong} style={{ flex: 1 }}>
          Falta separar: <Sans s={13} w={600} c={colors.terraDark}>{missing.length ? `${missing.length} ${missing.length === 1 ? 'item' : 'itens'} de ${s.malaTab.toLowerCase()}` : 'nada, tudo separado'}</Sans>
        </Sans>
      </View>
    </Screen>
  );
}
