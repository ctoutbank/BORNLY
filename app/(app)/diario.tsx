import { useRouter } from 'expo-router';
import { TextInput, View } from 'react-native';

import { FEEL_DOTS, FEELINGS, HUMORS, SLEEP } from '@/content';
import { capitalize, fmt, startOfToday, useStore } from '@/store';
import { colors, fonts } from '@/theme';
import { Card, Chip, Overline, PageHeader, Plus, Press, PrimaryButton, Sans, Screen, Segmented, Serif, Wrap } from '@/ui';

export default function Diario() {
  const { s, set, flash } = useStore();
  const router = useRouter();
  return (
    <Screen>
      <PageHeader title="Meu diário" sub={capitalize(fmt(startOfToday(), { weekday: 'long', day: 'numeric', month: 'long' }))} fallback="/saude" />
      <Card style={{ padding: 20 }}>
        <Serif s={18}>Como você está hoje?</Serif>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
          {FEELINGS.map((label, i) => {
            const on = s.feel === i;
            const dot = 18 - i * 2.5;
            return (
              <Press key={label} accessibilityState={{ selected: on }} accessibilityLabel={label} onPress={() => set({ feel: i })} style={{ alignItems: 'center', gap: 8, flex: 1 }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? colors.ink : colors.bg, borderColor: on ? colors.ink : colors.line }}>
                  <View style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: on ? colors.bg : FEEL_DOTS[i] }} />
                </View>
                <Sans s={11} w={600} c={on ? colors.ink : colors.muted} style={{ textAlign: 'center' }}>{label}</Sans>
              </Press>
            );
          })}
        </View>
      </Card>
      <View style={{ gap: 10 }}>
        <Overline>Humor</Overline>
        <Wrap>
          {HUMORS.map((l) => {
            const on = s.humor.includes(l);
            return <Chip key={l} label={l} on={on} onPress={() => set({ humor: on ? s.humor.filter((x) => x !== l) : [...s.humor, l] })} />;
          })}
        </Wrap>
      </View>
      <View style={{ gap: 10 }}>
        <Overline>Qualidade do sono</Overline>
        <Segmented value={s.sleep} onChange={(sleep) => set({ sleep })} options={SLEEP.map((l) => ({ id: l, label: l }))} />
      </View>
      <Press onPress={() => router.push('/sintomas')} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: 22, paddingVertical: 14, paddingHorizontal: 16, minHeight: 64 }}>
        <View style={{ flex: 1 }}>
          <Sans s={14.5} w={600}>Sintomas</Sans>
          <Sans s={12.5} c={colors.muted} style={{ marginTop: 2 }}>{s.symLogged.length ? s.symLogged.join(', ') : 'Nenhum registrado hoje'}</Sans>
        </View>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.sand, alignItems: 'center', justifyContent: 'center' }}><Plus color={colors.ink} size={12} strokeWidth={2} /></View>
      </Press>
      <View style={{ gap: 10 }}>
        <Overline>Observações</Overline>
        <TextInput
          value={s.note}
          onChangeText={(note) => set({ note })}
          multiline
          textAlignVertical="top"
          accessibilityLabel="Observações"
          placeholder="Algo que queira lembrar ou levar para a consulta"
          placeholderTextColor={colors.muted}
          style={{ minHeight: 96, borderRadius: 22, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.card, paddingVertical: 16, paddingHorizontal: 18, fontSize: 14.5, lineHeight: 22, color: colors.ink, fontFamily: fonts.sans400 }}
        />
      </View>
      <PrimaryButton
        label="Salvar registro"
        onPress={() => {
          set({ diaryDone: true, mood: FEELINGS[s.feel] });
          flash('Registro salvo');
        }}
      />
    </Screen>
  );
}
