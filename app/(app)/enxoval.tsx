import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useContent } from '@/content-provider';
import { checklistLabels, useStore } from '@/store';
import { colors } from '@/theme';
import { Checklist, CircleButton, Field, PageHeader, Plus, Press, PrimaryButton, Sans, Screen } from '@/ui';

export default function Enxoval() {
  const { s, set, save } = useStore();
  const ENX = Object.fromEntries(useContent().checklists.enxoval.map((g) => [g.group, g.items]));
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState('');
  const labelsOf = (cat: string) => checklistLabels(ENX[cat], s, 'enxoval', cat);
  const all = Object.keys(ENX).flatMap(labelsOf);
  const custom = (l: string) => s.customItems.some((c) => c.list === 'enxoval' && c.label === l);

  const toggle = (l: string) => {
    const done = !s.enx[l];
    save('/checklist', 'PUT', { list: 'enxoval', label: l, category: s.enxCat, custom: custom(l), done }, (st) => ({ enx: { ...st.enx, [l]: done } }));
  };
  const add = () => {
    const name = label.trim();
    if (!name || all.includes(name)) return;
    setLabel('');
    setAdding(false);
    save('/checklist', 'PUT', { list: 'enxoval', label: name, category: s.enxCat, custom: true, done: false }, (st) => ({ customItems: [...st.customItems, { list: 'enxoval', label: name, category: st.enxCat }] }));
  };

  return (
    <Screen gap={20}>
      <PageHeader title="Enxoval" sub={`${all.filter((l) => s.enx[l]).length} de ${all.length} itens`} fallback="/preparar" right={<CircleButton label="Novo item" bg={colors.peach} onPress={() => setAdding(!adding)}><Plus color={colors.terra} /></CircleButton>} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, flexGrow: 0 }} contentContainerStyle={{ gap: 6, paddingHorizontal: 20 }}>
        {Object.keys(ENX).map((c) => {
          const on = s.enxCat === c;
          const labels = labelsOf(c);
          return (
            <Press key={c} accessibilityState={{ selected: on }} onPress={() => set({ enxCat: c })} style={{ borderRadius: 999, paddingHorizontal: 16, minHeight: 42, flexDirection: 'row', gap: 6, alignItems: 'center', borderWidth: 1.5, borderColor: on ? colors.terra : 'transparent', backgroundColor: on ? colors.peach : colors.card }}>
              <Sans s={13} w={600} c={on ? colors.terraDark : colors.ink}>{c}</Sans>
              <Sans s={13} w={500} c={on ? colors.terraDark : colors.ink} style={{ opacity: 0.6 }}>{labels.filter((l) => s.enx[l]).length}/{labels.length}</Sans>
            </Press>
          );
        })}
      </ScrollView>
      {adding ? (
        <View style={{ gap: 10 }}>
          <Field value={label} onChangeText={setLabel} placeholder={`Novo item em ${s.enxCat}`} onSubmitEditing={add} returnKeyType="done" />
          <PrimaryButton label="Adicionar" onPress={add} />
        </View>
      ) : null}
      <Checklist labels={labelsOf(s.enxCat)} map={s.enx} onToggle={toggle} />
    </Screen>
  );
}
