import { TextInput, View } from 'react-native';

import { APPOINTMENTS, PAST_APPOINTMENTS } from '@/content';
import { capitalize, DAY, fmt, startOfToday, useStore } from '@/store';
import { colors, fonts } from '@/theme';
import { Card, CircleButton, PageHeader, Plus, Press, Sans, Screen, Serif } from '@/ui';

export default function Consultas() {
  const { s, set, flash } = useStore();
  const today = startOfToday();
  const addQuestion = () => {
    const q = s.qDraft.trim();
    if (!q) return;
    set((st) => ({ questions: [...st.questions, q], qDraft: '' }));
    flash('Pergunta adicionada');
  };

  return (
    <Screen>
      <PageHeader title="Consultas e exames" sub={capitalize(fmt(today, { month: 'long', year: 'numeric' }))} fallback="/saude" right={<CircleButton label="Nova consulta"><Plus color={colors.ink} /></CircleButton>} />
      <Card radius={26} style={{ flexDirection: 'row', gap: 4, paddingVertical: 12, paddingHorizontal: 8 }}>
        {Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today.getTime() + i * DAY);
          const on = s.calSel === i;
          const has = APPOINTMENTS.some((a) => a.off === i);
          return (
            <Press key={i} accessibilityState={{ selected: on }} onPress={() => set({ calSel: i })} style={{ flex: 1, alignItems: 'center', gap: 6, borderRadius: 18, paddingTop: 10, paddingBottom: 8, backgroundColor: on ? colors.ink : 'transparent' }}>
              <Sans s={10.5} w={600} c={on ? colors.bg : colors.ink} style={{ opacity: 0.7, textTransform: 'uppercase' }}>{fmt(d, { weekday: 'short' }).replace('.', '').slice(0, 3)}</Sans>
              <Serif s={18} c={on ? colors.bg : colors.ink}>{d.getDate()}</Serif>
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: has ? (on ? colors.bg : colors.terra) : 'transparent' }} />
            </Press>
          );
        })}
      </Card>
      <View>
        <Serif s={19} style={{ marginBottom: 12 }}>Próximos compromissos</Serif>
        <View style={{ gap: 8 }}>
          {APPOINTMENTS.map((a, i) => {
            const d = new Date(today.getTime() + a.off * DAY);
            const fg = i === 0 ? colors.bg : colors.ink;
            return (
              <View key={a.off} style={{ flexDirection: 'row', gap: 14, alignItems: 'center', backgroundColor: i === 0 ? colors.ink : colors.card, borderRadius: 24, paddingVertical: 14, paddingHorizontal: 16 }}>
                <View style={{ width: 52, alignItems: 'center', borderRightWidth: 1, borderRightColor: i === 0 ? 'rgba(244,236,227,.2)' : 'rgba(42,37,34,.1)', paddingRight: 12 }}>
                  <Serif s={22} lh={1.05} c={fg}>{d.getDate()}</Serif>
                  <Sans s={11} w={600} c={fg} style={{ marginTop: 4, opacity: 0.7, textTransform: 'uppercase' }}>{fmt(d, { month: 'short' }).replace('.', '')}</Sans>
                </View>
                <View style={{ flex: 1 }}>
                  <Sans s={14.5} w={600} c={fg}>{a.title}</Sans>
                  <Sans s={12.5} c={fg} style={{ marginTop: 3, opacity: 0.7 }}>{a.meta}</Sans>
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <Card style={{ padding: 20 }}>
        <Serif s={18}>Perguntas para a próxima consulta</Serif>
        <View style={{ marginTop: 10 }}>
          {s.questions.map((text, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.lineSoft }}>
              <Serif s={14} lh={1.45} c={colors.terra}>{i + 1}</Serif>
              <Sans s={14} lh={1.45} style={{ flex: 1 }}>{text}</Sans>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
          <TextInput
            value={s.qDraft}
            onChangeText={(qDraft) => set({ qDraft })}
            onSubmitEditing={addQuestion}
            returnKeyType="done"
            accessibilityLabel="Escreva uma pergunta"
            placeholder="Escreva uma pergunta"
            placeholderTextColor={colors.muted}
            style={{ flex: 1, minWidth: 0, height: 48, borderRadius: 999, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.bg, paddingHorizontal: 16, fontSize: 14, color: colors.ink, fontFamily: fonts.sans400 }}
          />
          <CircleButton label="Adicionar pergunta" bg={colors.ink} size={48} onPress={addQuestion}><Plus color={colors.bg} /></CircleButton>
        </View>
      </Card>
      <View>
        <Serif s={19} style={{ marginBottom: 12 }}>Histórico</Serif>
        <Card style={{ paddingVertical: 4, paddingHorizontal: 18 }}>
          {PAST_APPOINTMENTS.map(([title, off, tag], i) => (
            <View key={off} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: i === PAST_APPOINTMENTS.length - 1 ? 0 : 1, borderBottomColor: colors.lineSoft }}>
              <View style={{ flex: 1 }}>
                <Sans s={14} w={600}>{title}</Sans>
                <Sans s={12} c={colors.muted} style={{ marginTop: 2 }}>{fmt(new Date(today.getTime() - off * DAY), { day: 'numeric', month: 'long' })}</Sans>
              </View>
              <View style={{ backgroundColor: i === 1 ? colors.sage : colors.sand, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 10 }}>
                <Sans s={11.5} w={600} c={i === 1 ? colors.sageInk : colors.mutedStrong}>{tag}</Sans>
              </View>
            </View>
          ))}
        </Card>
      </View>
    </Screen>
  );
}
