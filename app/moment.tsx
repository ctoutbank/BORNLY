import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { MOMENTS } from '@/content';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { OnboardingShell, Press, PrimaryButton, Sans, Serif, Spacer } from '@/ui';

export default function Moment() {
  const { s, set } = useStore();
  const router = useRouter();
  return (
    <OnboardingShell step={1} gap={26}>
      <View>
        <Serif s={28}>Em que momento você está?</Serif>
        <Sans s={14} lh={1.5} c={colors.muted} style={{ marginTop: 8 }}>Assim o Bornly mostra o que faz sentido para você agora.</Sans>
      </View>
      <View style={{ gap: 10 }}>
        {MOMENTS.map(([id, label, sub]) => {
          const on = s.moment === id;
          return (
            <Press key={id} accessibilityRole="radio" accessibilityState={{ selected: on }} onPress={() => set({ moment: id })} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 18, borderRadius: 24, borderWidth: 1.5, borderColor: on ? colors.ink : colors.line, backgroundColor: on ? colors.card : 'transparent', minHeight: 76 }}>
              <View style={{ flex: 1 }}>
                <Sans s={15.5} w={600}>{label}</Sans>
                <Sans s={12.5} c={colors.muted} style={{ marginTop: 3 }}>{sub}</Sans>
              </View>
              <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: on ? colors.ink : colors.check, alignItems: 'center', justifyContent: 'center' }}>
                {on ? <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.ink }} /> : null}
              </View>
            </Press>
          );
        })}
      </View>
      {s.moment === 'tentante' ? (
        <View style={{ backgroundColor: colors.sage, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16 }}>
          <Sans s={13} lh={1.5} c={colors.sageInk}>Vamos acompanhar seu ciclo e sua saúde. Nada sobre gestação aparece até você nos contar que confirmou.</Sans>
        </View>
      ) : null}
      <Spacer />
      <PrimaryButton label="Continuar" onPress={() => router.push('/date')} />
    </OnboardingShell>
  );
}
