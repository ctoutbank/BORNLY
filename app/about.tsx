import { useRouter } from 'expo-router';
import { TextInput, View } from 'react-native';

import { useStore } from '@/store';
import { colors, fonts } from '@/theme';
import { Chip, OnboardingShell, Overline, PrimaryButton, Segmented, Title, Spacer, Wrap } from '@/ui';

export default function About() {
  const { s, set, flash } = useStore();
  const router = useRouter();
  return (
    <OnboardingShell step={3}>
      <Title s={28}>Conte um pouco sobre você</Title>
      <View style={{ gap: 8 }}>
        <Overline>Como gostaria de ser chamada?</Overline>
        <TextInput
          value={s.name}
          onChangeText={(name) => set({ name })}
          autoCapitalize="words"
          accessibilityLabel="Como gostaria de ser chamada?"
          style={{ height: 58, borderRadius: 20, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.card, paddingHorizontal: 18, fontSize: 16, color: colors.ink, fontFamily: fonts.sans400 }}
        />
      </View>
      <View style={{ gap: 8 }}>
        <Overline>É sua primeira gravidez?</Overline>
        <Segmented fontSize={13.5} minHeight={44} value={s.first} onChange={(first) => set({ first })} options={[{ id: 'Sim', label: 'Sim' }, { id: 'Não', label: 'Não' }]} />
      </View>
      <View style={{ gap: 10 }}>
        <Overline>Como prefere receber as informações?</Overline>
        <Wrap>
          {['Direta e curta', 'Mais detalhada', 'Só o essencial'].map((l) => (
            <Chip key={l} label={l} on={s.comm === l} onPress={() => set({ comm: l })} />
          ))}
        </Wrap>
      </View>
      <Spacer />
      <PrimaryButton label="Continuar" onPress={() => {
          if (!s.name.trim()) flash('Conte como gostaria de ser chamada.');
          else router.push('/ready');
        }} />
    </OnboardingShell>
  );
}
