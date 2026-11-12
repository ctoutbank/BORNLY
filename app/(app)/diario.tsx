import { useRouter } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { HeartsBackdrop, SparkleIcon, MoonIcon, PencilIcon, PulseIcon, SectionLabel, SmileIcon } from '@/components/love';
import { FEEL_DOTS, FEELINGS, HUMORS, SLEEP } from '@/content';
import { capitalize, fmt, startOfToday, todayIso, useStore } from '@/store';
import { colors, fonts } from '@/theme';
import { Chip, PageHeader, Plus, Press, PrimaryButton, Sans, Screen, Segmented, Title, Wrap } from '@/ui';

export default function Diario() {
  const { s, save, flash } = useStore();
  const router = useRouter();
  const today = todayIso();
  const entry = s.diary[today];
  const [feel, setFeel] = useState(entry?.feel ?? 1);
  const [humor, setHumor] = useState<string[]>(entry?.humor ?? []);
  const [sleep, setSleep] = useState(entry?.sleep ?? 'Regular');
  const [note, setNote] = useState(entry?.note ?? '');
  const logged = s.symptoms.filter((x) => x.day === today).map((x) => x.symptom);

  const submit = async () => {
    const body = { feel, humor, sleep, note };
    const ok = await save(`/diary/${today}`, 'PUT', body, (st) => ({ diary: { ...st.diary, [today]: body } }));
    if (ok) flash('Registro salvo');
  };

  return (
    <Screen>
      <PageHeader title="Meu diário" sub={capitalize(fmt(startOfToday(), { weekday: 'long', day: 'numeric', month: 'long' }))} fallback="/saude" />
      <View style={{ backgroundColor: colors.peach, borderRadius: 28, padding: 20, overflow: 'hidden' }}>
        <HeartsBackdrop />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <SparkleIcon color={colors.terra} size={15} />
          <Title s={18}>Como você está hoje?</Title>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
          {FEELINGS.map((label, i) => {
            const on = feel === i;
            const dot = 18 - i * 2.5;
            return (
              <Press key={label} accessibilityState={{ selected: on }} accessibilityLabel={label} onPress={() => setFeel(i)} style={{ alignItems: 'center', gap: 8, flex: 1 }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, borderWidth: on ? 2 : 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, borderColor: on ? colors.terra : 'rgba(163,96,78,.15)' }}>
                  <View style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: FEEL_DOTS[i] }} />
                </View>
                <Sans s={11} w={on ? 700 : 600} c={on ? colors.terraDark : colors.mutedStrong} style={{ textAlign: 'center' }}>{label}</Sans>
              </Press>
            );
          })}
        </View>
      </View>
      <View style={{ gap: 10 }}>
        <SectionLabel icon={<SmileIcon color={colors.terra} size={16} />} bg={colors.peach} label="Humor" />
        <Wrap>
          {HUMORS.map((l) => {
            const on = humor.includes(l);
            return <Chip key={l} label={l} on={on} onPress={() => setHumor(on ? humor.filter((x) => x !== l) : [...humor, l])} />;
          })}
        </Wrap>
      </View>
      <View style={{ gap: 10 }}>
        <SectionLabel icon={<MoonIcon color={colors.sageInk} size={15} />} bg={colors.sage} label="Qualidade do sono" />
        <Segmented value={sleep} onChange={setSleep} options={SLEEP.map((l) => ({ id: l, label: l }))} />
      </View>
      <Press onPress={() => router.push('/sintomas')} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, minHeight: 64 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' }}><PulseIcon color={colors.sageInk} /></View>
        <View style={{ flex: 1 }}>
          <Sans s={14} w={600}>Sintomas</Sans>
          <Sans s={12} c={colors.muted} style={{ marginTop: 2 }}>{logged.length ? logged.join(', ') : 'Nenhum registrado hoje'}</Sans>
        </View>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.peach, alignItems: 'center', justifyContent: 'center' }}><Plus color={colors.terra} size={16} strokeWidth={2} /></View>
      </Press>
      <View style={{ gap: 10 }}>
        <SectionLabel icon={<PencilIcon color={colors.mutedStrong} size={15} />} bg={colors.sand} label="Observações" />
        <TextInput value={note} onChangeText={setNote} multiline textAlignVertical="top" accessibilityLabel="Observações" placeholder="Algo que queira lembrar ou levar para a consulta" placeholderTextColor={colors.muted} style={{ minHeight: 96, borderRadius: 20, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.card, paddingVertical: 16, paddingHorizontal: 18, fontSize: 14, lineHeight: 22, color: colors.ink, fontFamily: fonts.sans400 }} />
      </View>
      <PrimaryButton label="Salvar registro" onPress={submit} />
    </Screen>
  );
}
