import { useRouter } from 'expo-router';
import { TextInput, View } from 'react-native';

import { capitalize, DAY, fmt, isUpcoming, startOfToday, useStore } from '@/store';
import { colors, fonts } from '@/theme';
import { Card, CircleButton, PageHeader, Plus, Press, PrimaryButton, Sans, Screen, Title } from '@/ui';

export default function Consultas() {
  const { s, set, save, load } = useStore();
  const router = useRouter();
  const today = startOfToday();
  const upcoming = s.appointments.filter(isUpcoming);
  const past = s.appointments.filter((a) => !isUpcoming(a)).reverse();
  const addQuestion = async () => {
    const text = s.qDraft.trim();
    if (!text) return;
    set({ qDraft: '' });
    if (await save('/questions', 'POST', { text })) await load();
  };
  const removeAppointment = (id: string) => save(`/appointments/${id}`, 'DELETE', undefined, (st) => ({ appointments: st.appointments.filter((a) => a.id !== id) }));
  const removeQuestion = (id: string) => save(`/questions/${id}`, 'DELETE', undefined, (st) => ({ questions: st.questions.filter((q) => q.id !== id) }));

  return (
    <Screen>
      <PageHeader title="Consultas e exames" sub={capitalize(fmt(today, { month: 'long', year: 'numeric' }))} fallback="/saude" right={<CircleButton label="Nova consulta" onPress={() => router.push('/nova-consulta')}><Plus color={colors.ink} /></CircleButton>} />
      <Card radius={24} style={{ flexDirection: 'row', gap: 4, paddingVertical: 12, paddingHorizontal: 8 }}>
        {Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today.getTime() + i * DAY);
          const on = s.calSel === i;
          const has = s.appointments.some((a) => new Date(a.startsAt).toDateString() === d.toDateString());
          return (
            <Press key={i} accessibilityState={{ selected: on }} onPress={() => set({ calSel: i })} style={{ flex: 1, alignItems: 'center', gap: 6, borderRadius: 20, paddingTop: 10, paddingBottom: 8, backgroundColor: on ? colors.ink : 'transparent' }}>
              <Sans s={11} w={600} c={on ? colors.bg : colors.ink} style={{ opacity: 0.7, textTransform: 'uppercase' }}>{fmt(d, { weekday: 'short' }).replace('.', '').slice(0, 3)}</Sans>
              <Title s={18} c={on ? colors.bg : colors.ink}>{d.getDate()}</Title>
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: has ? (on ? colors.bg : colors.terra) : 'transparent' }} />
            </Press>
          );
        })}
      </Card>
      <View>
        <Title s={18} style={{ marginBottom: 12 }}>Próximos compromissos</Title>
        {upcoming.length ? (
          <View style={{ gap: 8 }}>
            {upcoming.map((a, i) => {
              const d = new Date(a.startsAt);
              const fg = i === 0 ? colors.bg : colors.ink;
              const meta = [`${d.getHours()}h${d.getMinutes() ? String(d.getMinutes()).padStart(2, '0') : ''}`, a.who, a.place].filter(Boolean).join(' · ');
              return (
                <View key={a.id} style={{ flexDirection: 'row', gap: 14, alignItems: 'center', backgroundColor: i === 0 ? colors.ink : colors.card, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16 }}>
                  <View style={{ width: 52, alignItems: 'center', borderRightWidth: 1, borderRightColor: i === 0 ? 'rgba(244,236,227,.2)' : 'rgba(42,37,34,.1)', paddingRight: 12 }}>
                    <Title s={22} lh={1.05} c={fg}>{d.getDate()}</Title>
                    <Sans s={11} w={600} c={fg} style={{ marginTop: 4, opacity: 0.7, textTransform: 'uppercase' }}>{fmt(d, { month: 'short' }).replace('.', '')}</Sans>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Sans s={14} w={600} c={fg}>{a.title}</Sans>
                    <Sans s={12} c={fg} style={{ marginTop: 3, opacity: 0.7 }}>{meta}</Sans>
                  </View>
                  <Press accessibilityLabel={`Remover ${a.title}`} hitSlop={8} onPress={() => removeAppointment(a.id)} style={{ minHeight: 44, justifyContent: 'center' }}>
                    <Sans s={12} w={600} c={i === 0 ? colors.onInkMid : colors.terra}>Remover</Sans>
                  </Press>
                </View>
              );
            })}
          </View>
        ) : (
          <Card style={{ padding: 20, gap: 14 }}>
            <Sans s={14} lh={1.5} c={colors.mutedStrong}>Nenhum compromisso marcado. Cadastre sua próxima consulta ou exame.</Sans>
            <PrimaryButton label="Adicionar" onPress={() => router.push('/nova-consulta')} />
          </Card>
        )}
      </View>
      <Card style={{ padding: 20 }}>
        <Title s={18}>Perguntas para a próxima consulta</Title>
        <View style={{ marginTop: 10 }}>
          {s.questions.map((q, i) => (
            <View key={q.id} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.lineSoft }}>
              <Title s={14} lh={1.45} c={colors.terra}>{i + 1}</Title>
              <Sans s={14} lh={1.45} style={{ flex: 1 }}>{q.text}</Sans>
              <Press accessibilityLabel="Remover pergunta" hitSlop={10} onPress={() => removeQuestion(q.id)}><Sans s={12} w={600} c={colors.terra}>Remover</Sans></Press>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
          <TextInput value={s.qDraft} onChangeText={(qDraft) => set({ qDraft })} onSubmitEditing={addQuestion} returnKeyType="done" accessibilityLabel="Escreva uma pergunta" placeholder="Escreva uma pergunta" placeholderTextColor={colors.muted} style={{ flex: 1, minWidth: 0, height: 48, borderRadius: 999, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.bg, paddingHorizontal: 16, fontSize: 14, color: colors.ink, fontFamily: fonts.sans400 }} />
          <CircleButton label="Adicionar pergunta" bg={colors.ink} size={48} onPress={addQuestion}><Plus color={colors.bg} /></CircleButton>
        </View>
      </Card>
      {past.length ? (
        <View>
          <Title s={18} style={{ marginBottom: 12 }}>Histórico</Title>
          <Card style={{ paddingVertical: 4, paddingHorizontal: 18 }}>
            {past.map((a, i) => (
              <View key={a.id} style={{ paddingVertical: 14, borderBottomWidth: i === past.length - 1 ? 0 : 1, borderBottomColor: colors.lineSoft }}>
                <Sans s={14} w={600}>{a.title}</Sans>
                <Sans s={12} c={colors.muted} style={{ marginTop: 2 }}>{fmt(new Date(a.startsAt), { day: 'numeric', month: 'long' })}{a.who ? ` · ${a.who}` : ''}</Sans>
              </View>
            ))}
          </Card>
        </View>
      ) : null}
    </Screen>
  );
}
