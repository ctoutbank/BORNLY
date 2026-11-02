import { View } from 'react-native';

import { ALERTS, DURATION, INTENSITY, SYMPTOMS } from '@/content';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Card, Overline, PageHeader, Press, PrimaryButton, Sans, Screen, Segmented, Serif } from '@/ui';

export default function Sintomas() {
  const { s, set, flash } = useStore();
  const logged = s.symLogged.includes(s.symSel);
  const options = (list: string[]) => list.map((l) => ({ id: l, label: l }));

  return (
    <Screen>
      <PageHeader title="Sintomas" sub="O que você está sentindo?" fallback="/saude" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {SYMPTOMS.map((l) => {
          const on = s.symSel === l;
          return (
            <Press key={l} accessibilityState={{ selected: on }} onPress={() => set({ symSel: l })} style={{ width: '48.5%', flexGrow: 1, borderWidth: 1.5, borderColor: on ? colors.ink : colors.line, backgroundColor: on ? colors.ink : colors.card, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, minHeight: 54, justifyContent: 'center' }}>
              <Sans s={14} w={600} c={on ? colors.bg : colors.ink}>{s.symLogged.includes(l) ? l + ' ✓' : l}</Sans>
            </Press>
          );
        })}
      </View>
      <View style={{ gap: 10 }}>
        <Overline>Intensidade</Overline>
        <Segmented fontSize={13} value={s.symInt} onChange={(symInt) => set({ symInt })} options={options(INTENSITY)} />
      </View>
      <View style={{ gap: 10 }}>
        <Overline>Duração</Overline>
        <Segmented fontSize={13} value={s.symDur} onChange={(symDur) => set({ symDur })} options={options(DURATION)} />
      </View>
      <PrimaryButton
        label={(logged ? 'Atualizar ' : 'Registrar ') + s.symSel.toLowerCase()}
        onPress={() => {
          set((st) => ({ symLogged: st.symLogged.includes(st.symSel) ? st.symLogged : [...st.symLogged, st.symSel] }));
          flash(s.symSel + ' registrado · ' + s.symInt.toLowerCase());
        }}
      />
      <Card bg={colors.peach} style={{ padding: 20 }}>
        <Serif s={18} c={colors.terraDark}>Procure atendimento imediatamente se tiver</Serif>
        <View style={{ gap: 7, marginTop: 12 }}>
          {ALERTS.map((a) => (
            <View key={a} style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.terra, marginTop: 7 }} />
              <Sans s={13.5} lh={1.45} c={colors.terraText} style={{ flex: 1 }}>{a}</Sans>
            </View>
          ))}
        </View>
        <Press onPress={() => flash('Telefone da maternidade ainda não cadastrado')} style={{ marginTop: 16, height: 50, borderRadius: 999, backgroundColor: colors.terraDark, alignItems: 'center', justifyContent: 'center' }}>
          <Sans s={14} w={600} c={colors.card}>Ligar para a maternidade</Sans>
        </Press>
        <Sans s={11.5} lh={1.5} c={colors.terraDark} style={{ marginTop: 10 }}>O Bornly não interpreta seus registros como diagnóstico. Sinais de alerta definidos pela equipe obstétrica revisora.</Sans>
      </Card>
    </Screen>
  );
}
