import { View } from 'react-native';

import { BIRTH } from '@/content';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Card, Checklist, CircleButton, PageHeader, PhoneIcon, Sans, Screen, Serif } from '@/ui';

export default function Nascimento() {
  const { s, set, flash } = useStore();
  return (
    <Screen gap={20}>
      <PageHeader title="Para o nascimento" sub="Organizado pela proximidade da DPP" fallback="/preparar" />
      <Card bg={colors.ink} style={{ paddingVertical: 18, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ flex: 1 }}>
          <Sans s={12} c={colors.onInkSoft}>Maternidade escolhida</Sans>
          <Serif s={18} lh={1.25} c={colors.bg} style={{ marginTop: 4 }}>Hospital e Maternidade Santa Clara</Serif>
          <Sans s={12} c={colors.onInkMid} style={{ marginTop: 4 }}>18 min de carro · plantão 24h</Sans>
        </View>
        <CircleButton label="Ligar para a maternidade" bg={colors.bg} onPress={() => flash('Telefone da maternidade ainda não cadastrado')}><PhoneIcon color={colors.ink} /></CircleButton>
      </Card>
      {BIRTH.map(([label, range, items], i) => (
        <View key={label}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Serif s={18}>{label}</Serif>
            <View style={{ backgroundColor: i === 0 ? colors.ink : colors.sand, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 }}>
              <Sans s={11.5} w={600} c={i === 0 ? colors.bg : colors.mutedStrong}>{range}</Sans>
            </View>
          </View>
          <Checklist labels={items} map={s.birth} onToggle={(l) => set((st) => ({ birth: { ...st.birth, [l]: !st.birth[l] } }))} />
        </View>
      ))}
    </Screen>
  );
}
